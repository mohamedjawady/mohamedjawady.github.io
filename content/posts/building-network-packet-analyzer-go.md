---
title: "Building a Network Packet Analyzer in Go"
description: "Learn how to build a custom network packet analyzer using Go and the gopacket library for deep packet inspection."
date: "2024-12-10"
author: "0xHabib"
tags: ["golang", "networking", "packet-analysis", "tools"]
---

# Building a Network Packet Analyzer in Go

Network packet analysis is crucial for understanding network behavior and detecting anomalies. Let's build a custom packet analyzer using Go.

## Prerequisites

```bash
go mod init packet-analyzer
go get github.com/google/gopacket
go get github.com/google/gopacket/pcap
```

## Basic Packet Capture

```go
package main

import (
    "fmt"
    "log"
    "time"

    "github.com/google/gopacket"
    "github.com/google/gopacket/pcap"
)

func main() {
    // Find all devices
    devices, err := pcap.FindAllDevs()
    if err != nil {
        log.Fatal(err)
    }

    // Print available devices
    fmt.Println("Available devices:")
    for _, device := range devices {
        fmt.Printf("Name: %s\n", device.Name)
        fmt.Printf("Description: %s\n", device.Description)
    }

    // Open device for capture
    handle, err := pcap.OpenLive("eth0", 1600, true, pcap.BlockForever)
    if err != nil {
        log.Fatal(err)
    }
    defer handle.Close()

    // Start packet capture
    packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
    for packet := range packetSource.Packets() {
        processPacket(packet)
    }
}

func processPacket(packet gopacket.Packet) {
    fmt.Printf("Packet: %s\n", packet.String())
}
```

## Advanced Analysis

Let's add more sophisticated analysis capabilities:

```go
package main

import (
    "fmt"
    "log"
    "net"

    "github.com/google/gopacket"
    "github.com/google/gopacket/layers"
    "github.com/google/gopacket/pcap"
)

type PacketAnalyzer struct {
    handle *pcap.Handle
    stats  map[string]int
}

func NewPacketAnalyzer(device string) (*PacketAnalyzer, error) {
    handle, err := pcap.OpenLive(device, 1600, true, pcap.BlockForever)
    if err != nil {
        return nil, err
    }

    return &PacketAnalyzer{
        handle: handle,
        stats:  make(map[string]int),
    }, nil
}

func (pa *PacketAnalyzer) Start() {
    packetSource := gopacket.NewPacketSource(pa.handle, pa.handle.LinkType())
    
    for packet := range packetSource.Packets() {
        pa.analyzePacket(packet)
    }
}

func (pa *PacketAnalyzer) analyzePacket(packet gopacket.Packet) {
    // Analyze different layers
    if ethLayer := packet.Layer(layers.LayerTypeEthernet); ethLayer != nil {
        pa.analyzeEthernet(ethLayer.(*layers.Ethernet))
    }

    if ipLayer := packet.Layer(layers.LayerTypeIPv4); ipLayer != nil {
        pa.analyzeIPv4(ipLayer.(*layers.IPv4))
    }

    if tcpLayer := packet.Layer(layers.LayerTypeTCP); tcpLayer != nil {
        pa.analyzeTCP(tcpLayer.(*layers.TCP))
    }

    if udpLayer := packet.Layer(layers.LayerTypeUDP); udpLayer != nil {
        pa.analyzeUDP(udpLayer.(*layers.UDP))
    }
}

func (pa *PacketAnalyzer) analyzeEthernet(eth *layers.Ethernet) {
    pa.stats["ethernet"]++
    fmt.Printf("Ethernet: %s -> %s\n", eth.SrcMAC, eth.DstMAC)
}

func (pa *PacketAnalyzer) analyzeIPv4(ip *layers.IPv4) {
    pa.stats["ipv4"]++
    fmt.Printf("IPv4: %s -> %s\n", ip.SrcIP, ip.DstIP)
    
    // Check for suspicious IPs
    if pa.isSuspiciousIP(ip.SrcIP) || pa.isSuspiciousIP(ip.DstIP) {
        fmt.Printf("⚠️  Suspicious IP detected: %s -> %s\n", ip.SrcIP, ip.DstIP)
    }
}

func (pa *PacketAnalyzer) analyzeTCP(tcp *layers.TCP) {
    pa.stats["tcp"]++
    fmt.Printf("TCP: %d -> %d [%s]\n", tcp.SrcPort, tcp.DstPort, pa.getTCPFlags(tcp))
    
    // Detect port scanning
    if pa.isPortScan(tcp) {
        fmt.Printf("🚨 Potential port scan detected!\n")
    }
}

func (pa *PacketAnalyzer) analyzeUDP(udp *layers.UDP) {
    pa.stats["udp"]++
    fmt.Printf("UDP: %d -> %d\n", udp.SrcPort, udp.DstPort)
}

func (pa *PacketAnalyzer) isSuspiciousIP(ip net.IP) bool {
    // Simple blacklist check (in real implementation, use threat intel)
    suspiciousIPs := []string{
        "192.168.1.100",
        "10.0.0.50",
    }
    
    for _, suspIP := range suspiciousIPs {
        if ip.String() == suspIP {
            return true
        }
    }
    return false
}

func (pa *PacketAnalyzer) getTCPFlags(tcp *layers.TCP) string {
    var flags []string
    if tcp.SYN { flags = append(flags, "SYN") }
    if tcp.ACK { flags = append(flags, "ACK") }
    if tcp.FIN { flags = append(flags, "FIN") }
    if tcp.RST { flags = append(flags, "RST") }
    if tcp.PSH { flags = append(flags, "PSH") }
    if tcp.URG { flags = append(flags, "URG") }
    
    return fmt.Sprintf("%v", flags)
}

func (pa *PacketAnalyzer) isPortScan(tcp *layers.TCP) bool {
    // Simple heuristic: SYN packet without ACK to common ports
    return tcp.SYN && !tcp.ACK && (tcp.DstPort < 1024)
}

func (pa *PacketAnalyzer) PrintStats() {
    fmt.Println("\n=== Packet Statistics ===")
    for protocol, count := range pa.stats {
        fmt.Printf("%s: %d packets\n", protocol, count)
    }
}
```

## Adding Filters

```go
func (pa *PacketAnalyzer) SetFilter(filter string) error {
    return pa.handle.SetBPFFilter(filter)
}

// Usage examples:
// analyzer.SetFilter("tcp port 80")           // HTTP traffic
// analyzer.SetFilter("host 192.168.1.1")     // Specific host
// analyzer.SetFilter("tcp and port 22")      // SSH traffic
```

## Conclusion

This packet analyzer provides a foundation for network monitoring and security analysis. You can extend it with:

- Protocol-specific analysis
- Anomaly detection algorithms  
- Integration with threat intelligence feeds
- Real-time alerting
- Web dashboard for visualization

Happy packet hunting! 📡

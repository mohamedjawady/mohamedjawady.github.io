---
title: "Network Defensibility: Building a Monitored and Secure Infrastructure"
description: "Building monitored and secure infrastructure through comprehensive Network Security Monitoring (NSM) and Continuous Security Monitoring (CSM) strategies."
source: "Richard Bejtlich's Defensible Network Architecture, NSM best practices, industry frameworks"
type: "article"
difficulty: "intermediate"
category: "security"
author: "Mohamed Habib Jaouadi"
publishedDate: "2025-07-20"
status: "completed"
tags: ["network-security", "nsm", "csm", "monitoring", "siem", "threat-hunting", "cybersecurity"]
visible: true
---

# Network Defensibility: Building a Monitored and Secure Infrastructure

## What Makes a Network Defensible?

A truly defensible network goes beyond just deploying security tools. It requires a comprehensive approach that combines visibility, control, and continuous assessment. The foundation of network defensibility rests on two critical pillars:

- **Network Security Monitoring (NSM)**: Monitoring network traffic and communications
- **Continuous Security Monitoring (CSM)**: Monitoring endpoints and host-based activities

## The Seven Pillars of Defensible Networks

Based on Richard Bejtlich's framework, a defensible network must be:

### 1. **Monitored**
Deploy comprehensive monitoring across both network and endpoint layers to capture security-relevant events and traffic patterns.

### 2. **Inventoried** 
Maintain complete asset inventory following frameworks like CIS Top 20 controls to know what devices, services, and applications exist in your environment.

### 3. **Controlled**
Implement strict access controls for both ingress and egress traffic, managing who can access what resources and when.

### 4. **Claimed**
Establish clear ownership and responsibility for all services, applications, and network segments within your infrastructure.

### 5. **Minimized**
Reduce attack surface by eliminating unnecessary services, closing unused ports, and implementing least-privilege principles.

### 6. **Assessed**
Regularly identify weaknesses through vulnerability assessments, penetration testing, and defense validation exercises.

### 7. **Current**
Maintain up-to-date systems with timely patching and remediation of known vulnerabilities.

## Network Security Monitoring (NSM)

NSM focuses on collecting and analyzing network traffic to understand communication patterns and detect malicious activity.

### Key NSM Questions
- **Who is talking to whom?** (Source and destination analysis)
- **What are they saying?** (Content and protocol analysis)
- **What services are being used?** (Application layer visibility)
- **Can we record the exchanges?** (Full packet capture capabilities)

### NSM Data Collection Layers

#### Layer 3/4 (Network/Transport)
**NetFlow and Flow-based Data**
- Bandwidth utilization and traffic volume
- Source/destination IP addresses and ports
- Protocol usage and connection patterns
- Timing and duration of communications

#### Layer 7 (Application)
**Transaction and Content Data**
- DNS queries and responses
- HTTP/HTTPS requests and responses
- SSL/TLS certificate information
- Application-specific protocol details

### Essential NSM Capabilities

Your NSM implementation should answer these critical questions:

✅ **Can you see high-level bandwidth statistics and traffic flows?**
- Monitor for unusual data volumes that might indicate exfiltration
- Example: Would you detect a 1TB data transfer?

✅ **Do you know which domains are being accessed?**
- DNS logging through next-gen firewalls, proxies, or tools like Zeek
- Track domain reputation and detect DNS tunneling

✅ **Can you retrieve full packet data when needed?**
- Packet capture (PCAP) storage for detailed forensic analysis
- Balance storage costs with investigation requirements

✅ **Can you detect malicious encrypted traffic?**
- SSL/TLS certificate analysis
- Encrypted traffic behavioral analysis
- JA3/JA4 fingerprinting

### NSM Tools and Technologies

**Zeek (formerly Bro)**
- Converts live traffic or PCAPs into structured logs
- Generates protocol-specific logs (HTTP, DNS, SSL, etc.)
- Excellent for threat hunting as it records activity without bias
- Integrates well with SIEM platforms

**Suricata**
- Intrusion Detection/Prevention System (IDS/IPS)
- Signature-based and behavioral detection
- Can generate both alerts and flow data

**Network Taps and Collection Points**
- Strategic placement across network segments
- DMZ, internal networks, and internet egress points
- Multiple collection points increase detection coverage

## Continuous Security Monitoring (CSM)

CSM focuses on endpoint and host-based monitoring to understand what's happening on individual systems.

### Key CSM Questions
- **What ports are listening and why?**
- **Are there any unauthorized applications running?**
- **Have critical system files been modified?**
- **Have malicious scripts been executed?**
- **Do systems have unauthorized startup items?**

### CSM Data Sources

#### Host-Based Logs
- **Windows Event Logs**: Security, System, Application logs
- **Sysmon**: Enhanced Windows logging for process creation, network connections
- **Linux System Logs**: Syslog, auditd, authentication logs

#### Security Tools
- **Antivirus/EDR Logs**: Malware detection and response activities
- **HIDS/HIPS**: Host-based intrusion detection and prevention
- **Vulnerability Scanner Output**: Regular security assessments

#### System Monitoring
- **File/Registry Integrity Monitoring**: Detecting unauthorized changes
- **Process and Service Monitoring**: Running applications and services
- **Autorun Items**: Persistence mechanisms and startup programs

### Why Both NSM and CSM Are Essential

**Network Data Advantages:**
- Detects lateral movement between systems
- Identifies command and control communications
- Reveals data exfiltration attempts
- Provides communication context and timing

**Endpoint Data Advantages:**
- Shows process execution details and parent-child relationships
- Reveals what happens inside encrypted connections
- Identifies persistence mechanisms and system changes
- Provides user and privilege context

**Example Scenario:**
NSM might detect a connection to a suspicious IP address, while CSM reveals that `calc.exe` (not from Microsoft) initiated the connection, was spawned by a malicious process, and created persistence mechanisms.

## Data Centralization Strategy

### The Challenge
Security teams often struggle with:
- Multiple security tools with separate interfaces
- Different data formats (binary, XML, proprietary)
- Lack of correlation between network and endpoint events
- Inefficient investigation workflows

### The Solution: Centralized Logging

**Convert Everything to Logs**
Most SIEM platforms work best with text-based log data, so conversion is essential:

#### Network Traffic Processing
1. **Raw Traffic Capture**: PCAP files from network taps/spans
2. **Traffic Analysis Tools**: Zeek or Suricata convert PCAP to structured logs
3. **SIEM Ingestion**: Text-based logs fed into central platform
4. **Forensic Reference**: Original PCAP retained for detailed analysis

#### Network Equipment Data
1. **Flow Data Collection**: NetFlow, sFlow, J-Flow from network devices
2. **Flow Receivers**: Tools that convert flow data to text format
3. **Direct SIEM Ingestion**: Some SIEMs can natively process flow data

#### Endpoint Log Processing
1. **Native Logs**: Windows Event Logs (EVTX), Linux Syslogs
2. **Log Collection Agents**: Tools like Windows Event Forwarding or custom parsers
3. **Format Conversion**: Binary/XML to text-based formats
4. **Enhanced Logging**: Tools like Sysmon for additional endpoint visibility

### Data Collection Architecture

```
[Endpoints] → [Log Agents] → [SIEM Platform] ← [Flow Receivers] ← [Network Devices]
     ↓              ↓              ↑              ↓              ↓
[Event Logs]   [Text Logs]   [Correlation]   [Text Logs]   [Flow Data]
     ↓              ↓         [Analytics]         ↓              ↓
[File Changes] [Process Info] [Alerting]   [Traffic Logs] [Bandwidth Stats]
```

## Implementation Best Practices

### Network Coverage
- **Perimeter Monitoring**: Internet ingress/egress points
- **DMZ Visibility**: External-facing services and applications
- **Internal Segmentation**: East-west traffic between network segments
- **Critical Asset Monitoring**: High-value servers and databases

### Endpoint Coverage
- **Workstations**: User devices and laptops
- **Servers**: Both on-premises and cloud instances
- **IoT Devices**: Network-connected operational technology
- **Mobile Devices**: BYOD and corporate mobile assets

### Data Retention and Storage
- **Hot Data**: Recent logs for active investigation (30-90 days)
- **Warm Data**: Historical logs for trend analysis (6-12 months)
- **Cold Data**: Long-term archival for compliance (1-7 years)
- **PCAP Storage**: High-value traffic captures (limited by storage costs)

## Tools and Technologies

### SIEM Platforms
- **Splunk**: Enterprise log management and analytics
- **Elastic Stack**: Open-source log aggregation and search
- **IBM QRadar**: Security intelligence platform
- **Microsoft Sentinel**: Cloud-native SIEM solution

### NSM Tools
- **Zeek**: Network traffic analysis and logging
- **Suricata**: IDS/IPS with NSM capabilities
- **Wireshark**: Packet analysis and forensics
- **Security Onion**: Integrated NSM platform

### CSM Tools
- **Sysmon**: Enhanced Windows endpoint logging
- **Osquery**: SQL-based endpoint visibility
- **OSSEC**: Host-based intrusion detection
- **Wazuh**: Open-source security monitoring platform

### Log Processing
- **Logstash**: Log processing and transformation
- **Fluentd**: Unified logging layer
- **rsyslog**: High-performance log processing
- **Windows Event Forwarding**: Native Windows log collection

## Measuring Defensibility

### Key Metrics
- **Mean Time to Detection (MTTD)**: How quickly you identify threats
- **Mean Time to Response (MTTR)**: How quickly you contain incidents
- **Coverage Percentage**: Proportion of assets under monitoring
- **Alert Quality**: Ratio of true positives to false positives

### Continuous Improvement
- Regular assessment of monitoring gaps
- Tuning detection rules and thresholds
- Expanding coverage to new assets and technologies
- Training security teams on new tools and techniques

---

## Conclusion

Building a defensible network requires a holistic approach that combines comprehensive monitoring, strategic tool deployment, and centralized data analysis. By implementing both NSM and CSM capabilities and ensuring proper data centralization, organizations can achieve the visibility and control necessary to detect, investigate, and respond to security threats effectively.

The key is not just deploying tools, but creating an integrated monitoring ecosystem that provides actionable intelligence to security teams while maintaining operational efficiency and cost-effectiveness.

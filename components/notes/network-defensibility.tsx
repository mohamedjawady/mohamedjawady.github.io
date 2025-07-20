'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle, Shield, Search, Monitor, Database, AlertTriangle, Network, Eye, Lock, Target, CheckSquare, RefreshCw } from 'lucide-react'

export function NetworkDefensibilityNotes() {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, id)}
      className="h-8 w-8 p-0"
    >
      {copiedStates[id] ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )

  return (
    <div className="space-y-8">
      {/* Core Principle Alert */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Core Principle:</strong> A truly defensible network goes beyond just deploying security tools. It requires a comprehensive approach that combines visibility, control, and continuous assessment through both Network Security Monitoring (NSM) and Continuous Security Monitoring (CSM).
        </AlertDescription>
      </Alert>

      {/* Seven Pillars Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          The Seven Pillars of Defensible Networks
        </h2>
        <p className="text-muted-foreground">Based on Richard Bejtlich's framework, a defensible network must be:</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5 text-green-600" />
                1. Monitored
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Deploy comprehensive monitoring across both network and endpoint layers to capture security-relevant events and traffic patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                2. Inventoried
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Maintain complete asset inventory following frameworks like CIS Top 20 controls to know what devices, services, and applications exist.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                3. Controlled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Implement strict access controls for both ingress and egress traffic, managing who can access what resources and when.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                4. Claimed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Establish clear ownership and responsibility for all services, applications, and network segments within your infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                5. Minimized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reduce attack surface by eliminating unnecessary services, closing unused ports, and implementing least-privilege principles.
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-yellow-600" />
                6. Assessed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Regularly identify weaknesses through vulnerability assessments, penetration testing, and defense validation exercises.
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 bg-cyan-50/50 dark:border-cyan-800 dark:bg-cyan-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-cyan-600" />
                7. Current
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Maintain up-to-date systems with timely patching and remediation of known vulnerabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* NSM Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Network className="h-6 w-6 text-green-600" />
          Network Security Monitoring (NSM)
        </h2>
        <p className="text-muted-foreground">
          NSM focuses on collecting and analyzing network traffic to understand communication patterns and detect malicious activity.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Key NSM Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">Who is talking to whom?</p>
                <p className="text-sm text-muted-foreground">Source and destination analysis</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">What are they saying?</p>
                <p className="text-sm text-muted-foreground">Content and protocol analysis</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">What services are being used?</p>
                <p className="text-sm text-muted-foreground">Application layer visibility</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Can we record the exchanges?</p>
                <p className="text-sm text-muted-foreground">Full packet capture capabilities</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                NSM Data Collection Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Layer 3/4 (Network/Transport)</h4>
                <Badge variant="outline" className="mb-2">NetFlow and Flow-based Data</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Bandwidth utilization and traffic volume</li>
                  <li>Source/destination IP addresses and ports</li>
                  <li>Protocol usage and connection patterns</li>
                  <li>Timing and duration of communications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Layer 7 (Application)</h4>
                <Badge variant="outline" className="mb-2">Transaction and Content Data</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>DNS queries and responses</li>
                  <li>HTTP/HTTPS requests and responses</li>
                  <li>SSL/TLS certificate information</li>
                  <li>Application-specific protocol details</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Essential NSM Capabilities
            </CardTitle>
            <CardDescription>Your NSM implementation should answer these critical questions:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Can you see high-level bandwidth statistics and traffic flows?</p>
                <p className="text-sm text-muted-foreground mt-1">Monitor for unusual data volumes that might indicate exfiltration</p>
                <p className="text-sm text-muted-foreground italic">Example: Would you detect a 1TB data transfer?</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Do you know which domains are being accessed?</p>
                <p className="text-sm text-muted-foreground mt-1">DNS logging through next-gen firewalls, proxies, or tools like Zeek</p>
                <p className="text-sm text-muted-foreground">Track domain reputation and detect DNS tunneling</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Can you retrieve full packet data when needed?</p>
                <p className="text-sm text-muted-foreground mt-1">Packet capture (PCAP) storage for detailed forensic analysis</p>
                <p className="text-sm text-muted-foreground">Balance storage costs with investigation requirements</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Can you detect malicious encrypted traffic?</p>
                <p className="text-sm text-muted-foreground mt-1">SSL/TLS certificate analysis</p>
                <p className="text-sm text-muted-foreground">Encrypted traffic behavioral analysis</p>
                <p className="text-sm text-muted-foreground">JA3/JA4 fingerprinting</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zeek (formerly Bro)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Converts live traffic or PCAPs into structured logs</li>
                <li>Generates protocol-specific logs (HTTP, DNS, SSL, etc.)</li>
                <li>Excellent for threat hunting as it records activity without bias</li>
                <li>Integrates well with SIEM platforms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suricata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Intrusion Detection/Prevention System (IDS/IPS)</li>
                <li>Signature-based and behavioral detection</li>
                <li>Can generate both alerts and flow data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
                Darktrace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>AI-driven network visibility and threat detection</li>
                <li>Self-learning behavioral analysis</li>
                <li>Real-time anomaly detection</li>
                <li>Autonomous response capabilities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
                Vectra AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>AI-powered network detection and response (NDR)</li>
                <li>Behavioral threat detection</li>
                <li>Attack progression tracking</li>
                <li>Cloud and hybrid environment support</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Onion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Integrated NSM platform</li>
                <li>Combines multiple tools (Zeek, Suricata, etc.)</li>
                <li>Full packet capture and analysis</li>
                <li>Open-source NSM distribution</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Network Taps & SPAN Ports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Strategic placement across network segments</li>
                <li>DMZ, internal networks, and internet egress points</li>
                <li>Multiple collection points increase detection coverage</li>
                <li>Hardware taps for high-speed networks</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSM Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Monitor className="h-6 w-6 text-blue-600" />
          Continuous Security Monitoring (CSM)
        </h2>
        <p className="text-muted-foreground">
          CSM focuses on endpoint and host-based monitoring to understand what's happening on individual systems.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Key CSM Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-sm space-y-1">
                <li>What ports are listening and why?</li>
                <li>Are there any unauthorized applications running?</li>
                <li>Have critical system files been modified?</li>
                <li>Have malicious scripts been executed?</li>
                <li>Do systems have unauthorized startup items?</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                CSM Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Host-Based Logs</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>Windows Event Logs:</strong> Security, System, Application logs</li>
                  <li><strong>Sysmon:</strong> Enhanced Windows logging for process creation, network connections</li>
                  <li><strong>Linux System Logs:</strong> Syslog, auditd, authentication logs</li>
                  <li><strong>Enhanced EVTX Parser:</strong> Advanced Windows Event Log analysis and parsing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security Tools</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>EDR Solutions:</strong> CrowdStrike, SentinelOne, Microsoft Defender for Endpoint</li>
                  <li><strong>HIDS/HIPS:</strong> Host-based intrusion detection and prevention</li>
                  <li><strong>Vulnerability Scanner Output:</strong> Regular security assessments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">System Monitoring</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>File/Registry Integrity Monitoring:</strong> Detecting unauthorized changes</li>
                  <li><strong>Process and Service Monitoring:</strong> Running applications and services</li>
                  <li><strong>Autorun Items:</strong> Persistence mechanisms and startup programs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Why Both NSM and CSM Are Essential:</strong> NSM might detect a connection to a suspicious IP address, while CSM reveals that calc.exe (not from Microsoft) initiated the connection, was spawned by a malicious process, and created persistence mechanisms. Together, they provide complete visibility.
          </AlertDescription>
        </Alert>
      </div>

      {/* Data Integration Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6 text-purple-600" />
          Data Centralization Strategy
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                The Challenge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>Multiple security tools with separate interfaces</li>
                <li>Different data formats (binary, XML, proprietary)</li>
                <li>Lack of correlation between network and endpoint events</li>
                <li>Inefficient investigation workflows</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                The Solution: Centralized Logging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-2">Convert Everything to Logs</p>
              <p className="text-sm text-muted-foreground">
                Most SIEM platforms work best with text-based log data, so conversion is essential for effective correlation and analysis.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Processing Workflows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Network Traffic Processing
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">1</Badge>
                    <span>Raw Traffic Capture: PCAP files from network taps/spans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2</Badge>
                    <span>Traffic Analysis Tools: Zeek or Suricata convert PCAP to structured logs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    <span>SIEM Ingestion: Text-based logs fed into central platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    <span>Forensic Reference: Original PCAP retained for detailed analysis</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Endpoint Log Processing
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">1</Badge>
                    <span>Native Logs: Windows Event Logs (EVTX), Linux Syslogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2</Badge>
                    <span>Log Collection Agents: Tools like Windows Event Forwarding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    <span>Format Conversion: Binary/XML to text-based formats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    <span>Enhanced Logging: Tools like Sysmon for additional visibility</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
              <div className="text-center mb-2 font-semibold">Data Collection Architecture</div>
              <div className="whitespace-pre text-xs">
{`[Endpoints] → [Log Agents] → [SIEM Platform] ← [Flow Receivers] ← [Network Devices]
     ↓              ↓              ↑              ↓              ↓
[Event Logs]   [Text Logs]   [Correlation]   [Text Logs]   [Flow Data]
     ↓              ↓         [Analytics]         ↓              ↓
[File Changes] [Process Info] [Alerting]   [Traffic Logs] [Bandwidth Stats]`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools & Technologies Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-orange-600" />
          Tools & Technologies
        </h2>

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Database className="h-4 w-4" />
                SIEM Platforms
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Splunk</span>
                  <CopyButton text="Splunk" id="splunk" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Elastic Stack</span>
                  <CopyButton text="Elastic Stack" id="elastic" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">IBM QRadar</span>
                  <CopyButton text="IBM QRadar" id="qradar" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Microsoft Sentinel</span>
                  <CopyButton text="Microsoft Sentinel" id="sentinel" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Network className="h-4 w-4" />
                NSM Tools
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Darktrace</span>
                  <CopyButton text="Darktrace" id="darktrace" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Vectra AI</span>
                  <CopyButton text="Vectra AI" id="vectra" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Zeek</span>
                  <CopyButton text="Zeek" id="zeek" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Suricata</span>
                  <CopyButton text="Suricata" id="suricata" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Security Onion</span>
                  <CopyButton text="Security Onion" id="security-onion" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                CSM & Analysis Tools
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Sysmon</span>
                  <CopyButton text="Sysmon" id="sysmon" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Osquery</span>
                  <CopyButton text="Osquery" id="osquery" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Wazuh (SIEM)</span>
                  <CopyButton text="Wazuh" id="wazuh" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Enhanced EVTX Parser</span>
                  <CopyButton text="https://github.com/mohamedjawady/Enhanced-EVTX-Parser" id="evtx-parser" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Log Processing
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Logstash</span>
                  <CopyButton text="Logstash" id="logstash" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Fluentd</span>
                  <CopyButton text="Fluentd" id="fluentd" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">rsyslog</span>
                  <CopyButton text="rsyslog" id="rsyslog" />
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">Windows Event Forwarding</span>
                  <CopyButton text="Windows Event Forwarding" id="wef" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced EVTX Parser Highlight */}
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Enhanced EVTX Parser
                <Badge variant="secondary">Open Source</Badge>
              </CardTitle>
              <CardDescription>Advanced Windows Event Log Analysis Tool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                A specialized tool for parsing Windows XML Event Log (EVTX) files for security analysis and threat hunting.
              </p>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded font-mono text-sm">
                <span className="flex-1">https://github.com/mohamedjawady/Enhanced-EVTX-Parser</span>
                <CopyButton text="https://github.com/mohamedjawady/Enhanced-EVTX-Parser" id="evtx-parser-link" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Key Features:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Advanced EVTX parsing</li>
                    <li>Security event analysis</li>
                    <li>Threat hunting capabilities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Use Cases:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>Incident response</li>
                    <li>Forensic analysis</li>
                    <li>Log aggregation pipelines</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Implementation Note */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Implementation Success:</strong> Building a defensible network requires a holistic approach that combines comprehensive monitoring, strategic tool deployment, and centralized data analysis. The key is not just deploying tools, but creating an integrated monitoring ecosystem that provides actionable intelligence while maintaining operational efficiency and cost-effectiveness.
        </AlertDescription>
      </Alert>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Copy, Check, Shield, Monitor, Server, Network, Eye, TrendingUp, Lock, AlertTriangle, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy text"}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

export function NetworkDefensibilityNotes() {
  return (
    <div className="space-y-8">

      {/* Key Concepts */}
      <Alert>
        <Monitor className="h-4 w-4" />
        <AlertDescription>
          <strong>Core Principle:</strong> A defensible network requires both <strong>Network Security Monitoring (NSM)</strong> for 
          traffic analysis and <strong>Continuous Security Monitoring (CSM)</strong> for endpoint visibility, 
          with centralized data collection for effective correlation and analysis.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="pillars" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pillars">7 Pillars</TabsTrigger>
          <TabsTrigger value="nsm">NSM</TabsTrigger>
          <TabsTrigger value="csm">CSM</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* Seven Pillars of Defensible Networks */}
        <TabsContent value="pillars" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Seven Pillars of Defensible Networks</h2>
            <Badge variant="secondary">Richard Bejtlich Framework</Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  1. Monitored
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Deploy comprehensive monitoring across network and endpoint layers to capture security-relevant events and traffic patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-green-500" />
                  2. Inventoried
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Maintain complete asset inventory following frameworks like CIS Top 20 controls. Know all devices, services, and applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="h-5 w-5 text-purple-500" />
                  3. Controlled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Implement strict access controls for ingress/egress traffic. Manage who can access what resources and when.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-orange-500" />
                  4. Claimed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Establish clear ownership and responsibility for all services, applications, and network segments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  5. Minimized
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reduce attack surface by eliminating unnecessary services, closing unused ports, implementing least-privilege principles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-indigo-500" />
                  6. Assessed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Regularly identify weaknesses through vulnerability assessments, penetration testing, and defense validation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-teal-500" />
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
        </TabsContent>

        {/* Network Security Monitoring */}
        <TabsContent value="nsm" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Network className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Network Security Monitoring (NSM)</h2>
            <Badge variant="secondary">Traffic Analysis</Badge>
          </div>

          <div className="grid gap-6">
            <Alert>
              <Network className="h-4 w-4" />
              <AlertDescription>
                <strong>NSM Key Questions:</strong> Who is talking to whom? What are they saying? 
                What services are used? Can we record the exchanges?
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">Layer 3/4</Badge>
                    Network/Transport
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">NetFlow Data</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Bandwidth utilization and traffic volume</li>
                      <li>Source/destination IP addresses and ports</li>
                      <li>Protocol usage and connection patterns</li>
                      <li>Timing and duration of communications</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">Layer 7</Badge>
                    Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Transaction Data</h4>
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
                <CardTitle>Essential NSM Capabilities Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">High-level bandwidth statistics visibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Domain access tracking (DNS logs)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Full packet capture capability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Malicious encrypted traffic detection</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key NSM Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Zeek (formerly Bro)</h4>
                      <p className="text-sm text-muted-foreground">Converts live traffic/PCAPs into structured logs for threat hunting</p>
                    </div>
                    <CopyButton text="zeek -r capture.pcap" />
                  </div>
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Suricata</h4>
                      <p className="text-sm text-muted-foreground">IDS/IPS with signature-based and behavioral detection</p>
                    </div>
                    <CopyButton text="suricata -c /etc/suricata/suricata.yaml -i eth0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Continuous Security Monitoring */}
        <TabsContent value="csm" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Continuous Security Monitoring (CSM)</h2>
            <Badge variant="secondary">Endpoint Visibility</Badge>
          </div>

          <div className="grid gap-6">
            <Alert>
              <Server className="h-4 w-4" />
              <AlertDescription>
                <strong>CSM Key Questions:</strong> What ports are listening? Any unauthorized apps? 
                Critical file changes? Malicious scripts? Unique startup items?
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Host-Based Data Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Windows Logs</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>Security Event Logs</li>
                        <li>System Event Logs</li>
                        <li>Application Logs</li>
                        <li>Sysmon (Enhanced)</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Linux Logs</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>Syslog messages</li>
                        <li>Auditd logs</li>
                        <li>Authentication logs</li>
                        <li>System journals</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Security Tools</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>AV/EDR logs</li>
                        <li>HIDS/HIPS alerts</li>
                        <li>Vulnerability scans</li>
                        <li>Integrity monitoring</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Both NSM and CSM Are Essential</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">Network Data Advantages</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Detects lateral movement between systems</li>
                        <li>Identifies C2 communications</li>
                        <li>Reveals data exfiltration attempts</li>
                        <li>Provides communication context</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Endpoint Data Advantages</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Shows process execution details</li>
                        <li>Reveals encrypted connection contents</li>
                        <li>Identifies persistence mechanisms</li>
                        <li>Provides user and privilege context</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Data Integration */}
        <TabsContent value="integration" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Data Centralization Strategy</h2>
            <Badge variant="secondary">SIEM Integration</Badge>
          </div>

          <div className="grid gap-6">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                <strong>Core Challenge:</strong> Multiple security tools with different data formats require 
                conversion and centralization for effective correlation and analysis.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Data Processing Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Network Traffic Processing</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">PCAP</Badge>
                      <span>→</span>
                      <Badge variant="outline">Zeek/Suricata</Badge>
                      <span>→</span>
                      <Badge variant="outline">Text Logs</Badge>
                      <span>→</span>
                      <Badge variant="outline">SIEM</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Network Equipment Data</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">NetFlow</Badge>
                      <span>→</span>
                      <Badge variant="outline">Flow Receiver</Badge>
                      <span>→</span>
                      <Badge variant="outline">Text Format</Badge>
                      <span>→</span>
                      <Badge variant="outline">SIEM</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Endpoint Log Processing</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">EVTX/Binary</Badge>
                      <span>→</span>
                      <Badge variant="outline">Log Agents</Badge>
                      <span>→</span>
                      <Badge variant="outline">Text Format</Badge>
                      <span>→</span>
                      <Badge variant="outline">SIEM</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coverage Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Network Coverage</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Perimeter monitoring (ingress/egress)</li>
                      <li>DMZ visibility (external services)</li>
                      <li>Internal segmentation (east-west traffic)</li>
                      <li>Critical asset monitoring</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Endpoint Coverage</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Workstations and laptops</li>
                      <li>Servers (on-prem and cloud)</li>
                      <li>IoT and OT devices</li>
                      <li>Mobile devices (BYOD/corporate)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tools and Technologies */}
        <TabsContent value="tools" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Tools and Technologies</h2>
            <Badge variant="secondary">Implementation</Badge>
          </div>

          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SIEM Platforms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Splunk</h5>
                        <p className="text-xs text-muted-foreground">Enterprise log management</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Elastic Stack</h5>
                        <p className="text-xs text-muted-foreground">Open-source analytics</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Microsoft Sentinel</h5>
                        <p className="text-xs text-muted-foreground">Cloud-native SIEM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">NSM Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Zeek</h5>
                        <p className="text-xs text-muted-foreground">Network traffic analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Suricata</h5>
                        <p className="text-xs text-muted-foreground">IDS/IPS capabilities</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Security Onion</h5>
                        <p className="text-xs text-muted-foreground">Integrated NSM platform</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CSM Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Sysmon</h5>
                        <p className="text-xs text-muted-foreground">Enhanced Windows logging</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Osquery</h5>
                        <p className="text-xs text-muted-foreground">SQL-based endpoint visibility</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Wazuh</h5>
                        <p className="text-xs text-muted-foreground">Open-source monitoring</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Log Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Logstash</h5>
                        <p className="text-xs text-muted-foreground">Log transformation</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Fluentd</h5>
                        <p className="text-xs text-muted-foreground">Unified logging layer</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between p-2 border rounded">
                      <div>
                        <h5 className="font-semibold text-sm">Windows Event Forwarding</h5>
                        <p className="text-xs text-muted-foreground">Native log collection</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics for Measuring Defensibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Detection Metrics</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Mean Time to Detection (MTTD)</li>
                      <li>Mean Time to Response (MTTR)</li>
                      <li>Alert quality (true positive ratio)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Coverage Metrics</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Asset monitoring percentage</li>
                      <li>Network segment visibility</li>
                      <li>Log collection completeness</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Implementation Note:</strong> Building defensible networks is an iterative process. 
          Start with core NSM and CSM capabilities, then expand coverage and enhance correlation 
          capabilities based on your organization's risk profile and threat landscape.
        </AlertDescription>
      </Alert>
    </div>
  )
}

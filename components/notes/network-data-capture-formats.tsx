'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle, Database, Network, Search, Monitor, HardDrive, Eye, Filter, Terminal, FileText, AlertTriangle } from 'lucide-react'

export function NetworkDataCaptureFormatsNotes() {
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

  const zeekCommand = `docker run --rm -v /dirtomount:/pcap:rw blacktop/zeek -r origin.pcap local`

  const wiresharkFilters = {
    protocol: `http                    # Filter to HTTP traffic only
dns                     # Filter to DNS traffic only
http or dns            # Filter to HTTP or DNS traffic`,
    network: `ip.addr eq 1.2.3.4                    # Source or destination IP
tcp.port eq 80                        # Source or destination port
ip.addr eq 1.2.3.4 && tcp.port eq 80  # Combined IP and port filter
frame contains "search"                # Content-based filtering`
  }

  return (
    <div className="space-y-8">
      {/* Overview Alert */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
        <Database className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Key Insight:</strong> Network traffic analysis operates on three distinct levels, each offering different trade-offs between storage requirements, analysis depth, and operational value. The most effective monitoring programs strategically implement all three levels.
        </AlertDescription>
      </Alert>

      {/* Three Levels Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">NetFlow</CardTitle>
            </div>
            <CardDescription>Layer 3/4 Analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Smallest Storage</Badge>
              <Badge variant="outline" className="text-xs">Limited Value</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Captures only network and transport layer information. Good for baseline monitoring and bandwidth analysis.
            </p>
            <div className="text-xs space-y-1">
              <p><strong>Alternatives:</strong> JFlow, NetStream, sFlow</p>
              <p><strong>Port:</strong> 9995 UDP</p>
              <p><strong>Integration:</strong> Direct SIEM ingestion</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Service Logs</CardTitle>
            </div>
            <CardDescription>Layer 7 Metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Best Value</Badge>
              <Badge variant="outline" className="text-xs">Rich Context</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Application layer metadata with exceptional analytical value for security operations.
            </p>
            <div className="text-xs space-y-1">
              <p><strong>Tools:</strong> Zeek, Suricata</p>
              <p><strong>Storage:</strong> Moderate requirements</p>
              <p><strong>Value:</strong> Highest ROI for security</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Full PCAP</CardTitle>
            </div>
            <CardDescription>Complete Information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Massive Storage</Badge>
              <Badge variant="outline" className="text-xs">Complete Data</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Contains actual data transferred. Definitive evidence for investigations but requires huge storage.
            </p>
            <div className="text-xs space-y-1">
              <p><strong>Formats:</strong> .pcap, .pcapng</p>
              <p><strong>Collection:</strong> Wire capture, mirror ports</p>
              <p><strong>Use:</strong> Forensic analysis, compliance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NetFlow Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-green-600" />
            <CardTitle>NetFlow Deep Dive</CardTitle>
          </div>
          <CardDescription>Layer 3/4 network flow analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Data Elements</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Source and destination IP addresses</li>
                <li>Source and destination ports</li>
                <li>Protocol type (TCP, UDP, ICMP)</li>
                <li>Traffic volume (bytes and packets)</li>
                <li>Interface information</li>
                <li>Timing data (start/end times, duration)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>High-level traffic pattern analysis</li>
                <li>Bandwidth utilization monitoring</li>
                <li>Basic anomaly detection</li>
                <li>Network baseline establishment</li>
              </ul>
            </div>
          </div>
          
          <Alert>
            <Monitor className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Collection Method:</strong> Generated by agents on routers, firewalls, or switches. Can be synthesized from network monitoring tools or PCAP files. Typically transmitted via UDP port 9995.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Zeek Analysis Example */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-600" />
            <CardTitle>Practical Implementation: Zeek Analysis</CardTitle>
          </div>
          <CardDescription>Docker-based traffic analysis workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Docker Zeek Command</span>
              <CopyButton text={zeekCommand} id="zeek-command" />
            </div>
            <pre className="text-sm text-green-400 overflow-x-auto">
              <code>{zeekCommand}</code>
            </pre>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <Terminal className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Command Breakdown:</strong> This Docker command uses the <code className="text-xs bg-muted px-1 rounded">blacktop/zeek</code> image to analyze PCAP files. 
              The <code className="text-xs bg-muted px-1 rounded">-v /dirtomount:/pcap:rw</code> flag mounts your local directory to the container, 
              <code className="text-xs bg-muted px-1 rounded">-r origin.pcap</code> specifies the input file, and <code className="text-xs bg-muted px-1 rounded">local</code> runs with local network configuration. 
              <br/><br/>
              <strong>Source:</strong> <a href="https://github.com/blacktop/docker-zeek" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">github.com/blacktop/docker-zeek</a>
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Generated Log Files</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 rounded">conn.log</code> - Connection summaries</li>
                <li><code className="text-xs bg-muted px-1 rounded">dns.log</code> - DNS queries and responses</li>
                <li><code className="text-xs bg-muted px-1 rounded">http.log</code> - HTTP transactions</li>
                <li><code className="text-xs bg-muted px-1 rounded">files.log</code> - File transfer activities</li>
                <li><code className="text-xs bg-muted px-1 rounded">stats.log</code> - Collection statistics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Analysis Capabilities</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Connection patterns and communication flows</li>
                <li>DNS resolution tracking and analysis</li>
                <li>HTTP transaction monitoring</li>
                <li>File extraction and analysis</li>
                <li>Protocol-specific metadata extraction</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PCAP Analysis Tools */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            <CardTitle>PCAP Analysis Toolkit</CardTitle>
          </div>
          <CardDescription>Tools for comprehensive packet analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                GUI-Based Analysis
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>Wireshark</strong> - Interactive packet analysis</li>
                <li><strong>PacketTotal.com</strong> - Online analysis platform</li>
                <li><strong>Moloch</strong> - Full packet capture and analysis</li>
                <li><strong>NetworkMiner</strong> - File and artifact extraction</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Command-Line Analysis
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>tcpdump</strong> - Packet capture and filtering</li>
                <li><strong>tshark</strong> - Wireshark's CLI interface</li>
                <li><strong>Zeek</strong> - Metadata extraction</li>
                <li><strong>Snort/Suricata</strong> - Intrusion detection</li>
                <li><strong>ngrep</strong> - Network grep functionality</li>
                <li><strong>tcpxtract</strong> - File carving from traffic</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wireshark Filtering */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-orange-600" />
            <CardTitle>Wireshark Filtering Techniques</CardTitle>
          </div>
          <CardDescription>Essential display filters for efficient analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Protocol-Based Filters</span>
                  <CopyButton text={wiresharkFilters.protocol} id="protocol-filters" />
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  <code>{wiresharkFilters.protocol}</code>
                </pre>
              </div>
            </div>
            <div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Network-Based Filters</span>
                  <CopyButton text={wiresharkFilters.network} id="network-filters" />
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  <code>{wiresharkFilters.network}</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Implementation Framework</CardTitle>
          <CardDescription>Best practices for comprehensive network monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Collection Strategy</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Implement all three levels for comprehensive coverage</li>
                <li>Prioritize Layer 7 metadata for optimal ROI</li>
                <li>Use NetFlow for baseline understanding</li>
                <li>Deploy selective PCAP based on triggers</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Analysis Workflow</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Start with NetFlow for initial triage</li>
                <li>Pivot to service logs for context</li>
                <li>Retrieve PCAP for definitive analysis</li>
                <li>Document findings and correlations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">Operational Considerations</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Plan storage based on traffic volumes</li>
                <li>Ensure processing capabilities for real-time analysis</li>
                <li>Design integration architecture for analysts</li>
                <li>Implement training programs for tools</li>
              </ul>
            </div>
          </div>
          
          <Alert className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Success Factor:</strong> The most effective network security monitoring programs don't choose one format over others, but architect a comprehensive collection strategy that leverages the strengths of each approach while managing costs and complexity.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default NetworkDataCaptureFormatsNotes

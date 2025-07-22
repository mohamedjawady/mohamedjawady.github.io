"use client"

import { useState } from "react"
import { Copy, Check, Shield, AlertCircle, Settings, Database, GitBranch, Activity, Bell, Users, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

interface WorkflowStepProps {
  step: string
  description: string
  icon: React.ReactNode
  details?: string[]
}

function WorkflowStep({ step, description, icon, details }: WorkflowStepProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {icon}
          </div>
          <CardTitle className="text-lg">{step}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {details && (
          <ul className="space-y-2 text-sm">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

interface ToolComparisonProps {
  category: string
  tools: {
    name: string
    type: 'commercial' | 'open-source' | 'traditional'
    description?: string
  }[]
}

function ToolComparison({ category, tools }: ToolComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <div key={index} className="flex items-center gap-3">
              <Badge 
                variant={
                  tool.type === 'commercial' ? 'default' :
                  tool.type === 'open-source' ? 'secondary' : 'outline'
                }
                className="flex-shrink-0"
              >
                {tool.type}
              </Badge>
              <div className="flex-1">
                <span className="font-medium">{tool.name}</span>
                {tool.description && (
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SecurityOperationsWorkflowNotes() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Security Operations Center (SOC) Workflow
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive guide to SOC operations from event collection to incident management
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge>SOC Operations</Badge>
          <Badge>Incident Management</Badge>
          <Badge>SIEM</Badge>
          <Badge>Alert Handling</Badge>
          <Badge>Threat Intelligence</Badge>
        </div>
      </div>

      {/* NIST Definitions */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>NIST SP800-61 Definitions:</strong> Events are any observable occurrence. 
          Alerts are events of interest that may be unwanted. Incidents are confirmed violations 
          of security policies (true positive alerts only).
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs defaultValue="workflow" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="alerts">Alert Types</TabsTrigger>
          <TabsTrigger value="tools">SOC Tools</TabsTrigger>
          <TabsTrigger value="investigation">Investigation</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">SOC Data Flow Pipeline</h2>
            <div className="inline-flex items-center gap-2 text-sm bg-muted px-4 py-2 rounded-lg">
              <Database className="w-4 h-4" />
              Events → Logs → SIEM → Alerts → Triage → Incidents
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WorkflowStep
              step="Event Collection"
              description="Strategic collection of security-relevant events from endpoints and network devices"
              icon={<Activity className="w-5 h-5 text-blue-500" />}
              details={[
                "Focus on events with security ramifications",
                "Balance budget constraints with coverage needs",
                "Implement hybrid collection strategy",
                "Continuously remove noise and optimize"
              ]}
            />
            
            <WorkflowStep
              step="SIEM Processing"
              description="Analysis, enrichment, and correlation of collected events"
              icon={<Database className="w-5 h-5 text-green-500" />}
              details={[
                "Pattern recognition and correlation",
                "Threat intelligence enrichment",
                "Automated detection rules",
                "Generate high-fidelity alerts"
              ]}
            />
            
            <WorkflowStep
              step="Alert Triage"
              description="Classification and prioritization of generated alerts"
              icon={<Bell className="w-5 h-5 text-orange-500" />}
              details={[
                "Distinguish signature vs anomaly alerts",
                "Context gathering and enrichment",
                "False positive elimination",
                "Priority assignment"
              ]}
            />
            
            <WorkflowStep
              step="Investigation"
              description="Deep analysis of confirmed alerts to determine malicious activity"
              icon={<FileText className="w-5 h-5 text-purple-500" />}
              details={[
                "Correlate with other logs and activities",
                "Gather additional context",
                "Determine malicious vs benign",
                "Document findings and actions"
              ]}
            />
            
            <WorkflowStep
              step="Incident Management"
              description="Case creation and tracking for confirmed malicious activity"
              icon={<AlertCircle className="w-5 h-5 text-red-500" />}
              details={[
                "Create incident tickets",
                "Assign to appropriate analysts",
                "Track investigation progress",
                "Coordinate response activities"
              ]}
            />
            
            <WorkflowStep
              step="Response & Recovery"
              description="Execute containment, eradication, and recovery procedures"
              icon={<Shield className="w-5 h-5 text-indigo-500" />}
              details={[
                "Implement containment measures",
                "Eradicate threat presence",
                "Restore normal operations",
                "Document lessons learned"
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Signature-Based Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Blacklist-based alerts that identify known malicious indicators
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Characteristics</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Known evil domains and C2 traffic patterns</li>
                      <li>Exploit kit URL patterns</li>
                      <li>Malware signatures and IOCs</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Best Practices</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Always investigate signature-based alerts</li>
                      <li>Maintain high-quality threat intelligence</li>
                      <li>Regularly tune rules to reduce false positives</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-yellow-500" />
                  Anomaly-Based Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Behavioral alerts that identify deviations from normal activity
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Examples</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Out-of-hours login attempts</li>
                      <li>Large file uploads</li>
                      <li>New device access</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Well-defined baseline environment</li>
                      <li>Understanding of normal behavior</li>
                      <li>Additional context and enrichment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ToolComparison
              category="Incident Management Systems (IMS)"
              tools={[
                { name: "Resilient", type: "commercial", description: "Enterprise security incident response platform" },
                { name: "Archer", type: "commercial", description: "Risk management and compliance platform" },
                { name: "ServiceNow", type: "commercial", description: "IT service management with security modules" },
                { name: "TheHive", type: "open-source", description: "Outstanding free IMS with case templates" },
                { name: "RTIR", type: "open-source", description: "Request Tracker for Incident Response" },
                { name: "FIR", type: "open-source", description: "Fast Incident Response platform" },
                { name: "BMC Remedy", type: "traditional", description: "Enterprise IT service management" },
                { name: "RT", type: "traditional", description: "Request Tracker ticketing system" },
              ]}
            />
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    SOC Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">SIEM</Badge>
                      <span className="text-sm">Log collection, correlation, and alerting</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">SOAR</Badge>
                      <span className="text-sm">Security orchestration and automation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">TIP</Badge>
                      <span className="text-sm">Threat intelligence platform</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">EDR/XDR</Badge>
                      <span className="text-sm">Endpoint detection and response</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Essential IMS Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Rich text documentation with inline media</li>
                    <li>Indicator database integration</li>
                    <li>Bulk operations (mass close/edit)</li>
                    <li>Hierarchical ticket relationships</li>
                    <li>API access for automation</li>
                    <li>Keyboard navigation for efficiency</li>
                    <li>Built-in knowledge base/wiki</li>
                    <li>Workflow customization</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="investigation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Analyst Response Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">1. Initial Assessment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verify alert validity and determine rule type
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">2. Context Gathering</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enrich with additional data and correlate activities
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium">3. Determination</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Make malicious/benign call and escalate if needed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  TheHive Integration Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Automatic Case Creation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>SIEM alerts automatically sent to TheHive</li>
                      <li>Cases populated with parsed alert fields</li>
                      <li>Tasks created from case templates</li>
                      <li>Observables enriched by Cortex analyzers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Case Management</h4>
                    <ul className="space-y-2 text-sm">
                      <li>Organized by case templates (playbooks)</li>
                      <li>Task-based workflow with work logs</li>
                      <li>Observable (IOC) management</li>
                      <li>Automated enrichment capabilities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Key Success Factors:</strong> Balance collection strategy with budget, 
              implement proper alert classification, choose tools analysts enjoy using, 
              and maintain updated playbooks and documentation.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Recommended Reading</h4>
              <ul className="space-y-1 text-sm">
                <li>NIST SP800-61: Computer Security Incident Handling Guide</li>
                <li>Cisco Security Capabilities Benchmark Study</li>
                <li>Risk-based alerting methodologies</li>
                <li>Exploit kit analysis techniques</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tools & Platforms</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="https://bammv.github.io/sguil/index.html" className="text-blue-600 hover:underline">Sguil Network Security Monitoring</a></li>
                <li>TheHive Project for case management</li>
                <li>MISP for threat intelligence sharing</li>
                <li>Cortex for automated analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

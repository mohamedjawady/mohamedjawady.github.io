"use client"

import { useState } from "react"
import { Copy, Check, Shield, Database, GitBranch, Activity, Bell, Users, FileText, Brain, Zap, Search, BarChart3, Link, Target } from "lucide-react"
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

interface ConceptCardProps {
  title: string
  description: string
  icon: React.ReactNode
  details?: string[]
  keyPoints?: string[]
}

function ConceptCard({ title, description, icon, details, keyPoints }: ConceptCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {keyPoints && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Points:</h4>
            <ul className="space-y-1 text-sm">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        {details && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Details:</h4>
            <ul className="space-y-1 text-sm">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface HierarchyCardProps {
  level: string
  definition: string
  characteristics: string[]
  examples?: string[]
  color: string
}

function HierarchyCard({ level, definition, characteristics, examples, color }: HierarchyCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className={`text-lg border-l-4 pl-3 border-${color}-500`}>
          {level}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium">{definition}</p>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Characteristics:</h4>
          <ul className="space-y-1 text-sm">
            {characteristics.map((char, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 bg-${color}-500 rounded-full mt-2 flex-shrink-0`} />
                {char}
              </li>
            ))}
          </ul>
        </div>
        {examples && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Examples:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface PlatformComparisonProps {
  category: string
  platforms: {
    name: string
    type: 'open-source' | 'commercial' | 'cloud'
    description?: string
    features?: string[]
  }[]
}

function PlatformComparison({ category, platforms }: PlatformComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms.map((platform, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <Badge 
                  variant={
                    platform.type === 'commercial' ? 'default' :
                    platform.type === 'open-source' ? 'secondary' : 'outline'
                  }
                >
                  {platform.type}
                </Badge>
                <span className="font-medium">{platform.name}</span>
              </div>
              {platform.description && (
                <p className="text-sm text-muted-foreground mb-2">{platform.description}</p>
              )}
              {platform.features && (
                <ul className="text-sm space-y-1">
                  {platform.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CyberThreatIntelligenceSiemIntegrationNotes() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cyber Threat Intelligence & SIEM Integration
        </h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          Comprehensive guide to integrating cyber threat intelligence with SIEM systems for enhanced SOC operations
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge>Threat Intelligence</Badge>
          <Badge>SIEM</Badge>
          <Badge>SOAR</Badge>
          <Badge>MISP</Badge>
          <Badge>Automation</Badge>
          <Badge>Use Cases</Badge>
        </div>
      </div>

      {/* Key Definition */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Core Principle:</strong> Cyber Threat Intelligence is NOT just a list of bad domains and IPs. 
          It's analyzed cyber threat data that provides strategic and tactical advantages over adversaries, 
          driving "offense informs defense" strategies.
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs defaultValue="intelligence" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="platforms">TIP</TabsTrigger>
          <TabsTrigger value="siem">SIEM</TabsTrigger>
          <TabsTrigger value="automation">SOAR</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Threat Intelligence Fundamentals</h2>
            <p className="text-muted-foreground">Understanding the progression from data to actionable intelligence</p>
          </div>

          {/* Data-Information-Intelligence Hierarchy */}
          <div className="grid gap-6 md:grid-cols-3">
            <HierarchyCard
              level="Data"
              definition="Raw data collected from environment"
              characteristics={[
                "Unprocessed information",
                "High volume output",
                "Requires context to be useful",
                "Foundation for analysis"
              ]}
              examples={["Log entries", "Network packets", "File hashes", "IP addresses"]}
              color="red"
            />
            
            <HierarchyCard
              level="Information"
              definition="Answers questions using data and environment context"
              characteristics={[
                "Data + Context = Information",
                "Provides situational awareness",
                "Answers specific questions",
                "Structured and organized"
              ]}
              examples={["IP connected to malicious domain", "User login from unusual location", "File hash matches malware"]}
              color="yellow"
            />
            
            <HierarchyCard
              level="Intelligence"
              definition="Uses information + human analysis to drive action"
              characteristics={[
                "Information + Analysis + Judgment",
                "Drives decision making",
                "Prioritizes defensive actions",
                "Strategic and tactical advantage"
              ]}
              examples={["Threat campaign attribution", "Attack vector prioritization", "Defensive recommendations"]}
              color="green"
            />
          </div>

          {/* Threat Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Threat Definition Framework: Intent + Capability + Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Intent</h4>
                  <p className="text-sm text-muted-foreground">Malicious actor's desire to target your organization</p>
                  <ul className="text-sm space-y-1">
                    <li>Motivation behind attacks</li>
                    <li>Strategic objectives</li>
                    <li>Target selection criteria</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Capability</h4>
                  <p className="text-sm text-muted-foreground">Means to achieve their goals</p>
                  <ul className="text-sm space-y-1">
                    <li>Malware and tools</li>
                    <li>Technical sophistication</li>
                    <li>Attack techniques</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600 dark:text-green-400">Opportunity</h4>
                  <p className="text-sm text-muted-foreground">Opening needed to succeed</p>
                  <ul className="text-sm space-y-1">
                    <li>Software vulnerabilities</li>
                    <li>Hardware weaknesses</li>
                    <li>Personnel security gaps</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Threat Intelligence Platforms (TIP)</h2>
            <p className="text-muted-foreground">Central repositories for organizing and accessing threat intelligence</p>
          </div>

          {/* TIP Functions */}
          <div className="grid gap-6 md:grid-cols-2">
            <ConceptCard
              title="Core TIP Functions"
              description="Essential capabilities that every threat intelligence platform should provide"
              icon={<Database className="w-5 h-5 text-blue-500" />}
              keyPoints={[
                "Store analysis and threat information for indicators",
                "Perform automated/fast lookups via API",
                "Record rich context (not just lists)",
                "Find associations across multiple events",
                "Enable sharing with other organizations"
              ]}
            />

            <ConceptCard
              title="MISP Deep Dive"
              description="Open-source threat intelligence platform and analyst favorite"
              icon={<Shield className="w-5 h-5 text-green-500" />}
              keyPoints={[
                "High-volume indicator storage capability",
                "Excellent web UI and REST API",
                "Classification and sharing functionality",
                "Easy import/export capabilities",
                "Integration with TheHive"
              ]}
            />
          </div>

          {/* Platform Comparison */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PlatformComparison
              category="Open Source TIP Solutions"
              platforms={[
                {
                  name: "MISP (misp-project.org)",
                  type: "open-source",
                  description: "Malware Information Sharing Platform - analyst favorite",
                  features: ["High-volume storage", "Great web UI", "REST API", "Sharing functionality", "GitHub: MISP/MISP"]
                },
                {
                  name: "CIF (csirtgadgets.com)",
                  type: "open-source",
                  description: "Collective Intelligence Framework",
                  features: ["Feed aggregation", "API-driven", "Scalable architecture", "GitHub: csirtgadgets/bearded-avenger"]
                },
                {
                  name: "YETI (yeti-platform.github.io)",
                  type: "open-source",
                  description: "Your Everyday Threat Intelligence",
                  features: ["Observable tracking", "Analytics", "Investigation support", "GitHub: yeti-platform/yeti"]
                }
              ]}
            />

            <PlatformComparison
              category="Commercial TIP Solutions"
              platforms={[
                {
                  name: "ThreatConnect (threatconnect.com)",
                  type: "commercial",
                  description: "Enterprise threat intelligence platform",
                  features: ["Advanced analytics", "Workflow automation", "Enterprise integrations", "CAL (Collective Analytics Layer)"]
                },
                {
                  name: "Anomali (anomali.com)",
                  type: "commercial",
                  description: "Cloud-based threat intelligence",
                  features: ["Machine learning", "Threat hunting", "Automated analysis", "ThreatStream platform"]
                },
                {
                  name: "ThreatQuotient (threatq.com)",
                  type: "commercial",
                  description: "Threat intelligence management",
                  features: ["Data fusion", "Scoring algorithms", "Visualization", "ThreatQ platform"]
                }
              ]}
            />
          </div>

          {/* MISP Terminology */}
          <Card>
            <CardHeader>
              <CardTitle>MISP Terminology & Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Core Entities</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Events:</strong> Contextually linked information containers</li>
                      <li><strong>Attributes:</strong> Indicators, links, files, and notes</li>
                      <li><strong>Sightings:</strong> True/false positive tracking</li>
                      <li><strong>Tags:</strong> Additional context and categorization</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Workflow Process</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Create new event for threat/incident</li>
                      <li>2. Add attributes (indicators, files, notes)</li>
                      <li>3. Apply tags and classifications</li>
                      <li>4. Review and publish to organizations</li>
                      <li>5. Automated API integration with SOC tools</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="siem" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">SIEM Architecture and Capabilities</h2>
            <p className="text-muted-foreground">Central nervous system of SOC operations</p>
          </div>

          {/* SIEM Core Functions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ConceptCard
              title="Data Collection"
              description="Ingesting and processing diverse log sources"
              icon={<Activity className="w-5 h-5 text-blue-500" />}
              keyPoints={[
                "Receive all log data from sources",
                "High-performance logging agents",
                "Multi-format log compatibility",
                "Message buffering for resiliency"
              ]}
            />

            <ConceptCard
              title="Processing & Enrichment"
              description="Transforming raw data into actionable information"
              icon={<GitBranch className="w-5 h-5 text-green-500" />}
              keyPoints={[
                "Parse data into structured format",
                "Filter unwanted events",
                "Enrich with additional context",
                "Index into searchable database"
              ]}
            />

            <ConceptCard
              title="Analysis & Alerting"
              description="Generating insights and notifications"
              icon={<Bell className="w-5 h-5 text-orange-500" />}
              keyPoints={[
                "Fast searching capabilities",
                "Visualization and dashboards",
                "Analytics and correlation",
                "Flexible alerting options"
              ]}
            />
          </div>

          {/* SIEM Data Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                SIEM Data Flow Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-4 text-sm bg-muted px-6 py-3 rounded-lg">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded">Endpoint Logs</span>
                    <span>+</span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded">Network Logs</span>
                    <span>→</span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded">Aggregation</span>
                    <span>→</span>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded">Filtering</span>
                    <span>→</span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded">SIEM</span>
                    <span>→</span>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900 rounded">Alerts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle>SIEM Use Cases Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  A SIEM use case answers "What is the SIEM doing for us?" by providing documented, actionable items.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Essential Documentation</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Name and description</li>
                      <li>Problem statement and goals</li>
                      <li>Data sources (primary/secondary)</li>
                      <li>Analytic logic and expected outputs</li>
                      <li>Testing and validation procedures</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Common Use Case Examples</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Brute force login attempts</li>
                      <li>Suspicious upload traffic volumes</li>
                      <li>Potentially malicious downloads</li>
                      <li>Unauthorized privilege escalation</li>
                      <li>Credentials to phishing sites</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SIEM Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PlatformComparison
              category="Enterprise SIEM Solutions"
              platforms={[
                {
                  name: "Splunk Enterprise Security (splunk.com)",
                  type: "commercial",
                  description: "Leading enterprise SIEM with advanced analytics",
                  features: ["Machine learning", "Advanced correlation", "Extensive integrations", "Premium Apps ecosystem"]
                },
                {
                  name: "IBM QRadar (ibm.com/qradar)",
                  type: "commercial",
                  description: "AI-powered security intelligence platform",
                  features: ["Watson for Cyber Security", "Flow-based analysis", "Risk prioritization", "Cognitive insights"]
                },
                {
                  name: "Microsoft Sentinel (azure.com/sentinel)",
                  type: "cloud",
                  description: "Cloud-native SIEM with AI capabilities",
                  features: ["Azure integration", "SOAR capabilities", "ML-driven detection", "Hunting queries (KQL)"]
                }
              ]}
            />

            <PlatformComparison
              category="Open Source & Alternative SIEM"
              platforms={[
                {
                  name: "Elastic SIEM (elastic.co)",
                  type: "open-source",
                  description: "Built on Elasticsearch with detection engine",
                  features: ["ELK Stack foundation", "Detection rules", "Timeline analysis", "Elastic Security"]
                },
                {
                  name: "Wazuh (wazuh.com)",
                  type: "open-source",
                  description: "Comprehensive security monitoring platform",
                  features: ["HIDS/HIPS", "Log analysis", "Compliance monitoring", "Active response"]
                },
                {
                  name: "OSSIM/AlienVault (at&t.com)",
                  type: "commercial",
                  description: "Unified Security Management platform",
                  features: ["Asset discovery", "Vulnerability assessment", "Behavioral monitoring", "Event correlation"]
                }
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Security Orchestration, Automation & Response (SOAR)</h2>
            <p className="text-muted-foreground">Automating and orchestrating security operations workflows</p>
          </div>

          {/* Automation vs Orchestration */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Accomplishes specific, individual tasks
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Single-purpose actions</li>
                  <li>Reduces manual effort</li>
                  <li>Executes predefined tasks</li>
                  <li>Improves consistency</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-purple-500" />
                  Orchestration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Chains automated tasks into complex workflows
                </p>
                <ul className="space-y-2 text-sm">
                  <li>Multi-step process execution</li>
                  <li>"Running playbooks for you"</li>
                  <li>Decision trees and logic</li>
                  <li>Workflow coordination</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* SOAR Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>SOAR Platform Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Operational Improvements</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Standardization of response tasks</li>
                    <li>Immediate response time</li>
                    <li>Higher capacity to address alerts</li>
                    <li>Faster onboarding for new employees</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Quality Benefits</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Focused effort on high-value analysis</li>
                    <li>Reduced analyst fatigue</li>
                    <li>Improved job satisfaction</li>
                    <li>Consistent response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOAR Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle>SOAR Automation Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600 dark:text-red-400">Malware Detection</h4>
                  <ul className="text-sm space-y-1">
                    <li>Network isolation</li>
                    <li>Forensic image creation</li>
                    <li>Incident notification</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Phishing Response</h4>
                  <ul className="text-sm space-y-1">
                    <li>Password expiration</li>
                    <li>Email quarantine</li>
                    <li>User awareness notification</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600 dark:text-green-400">C2 Communication</h4>
                  <ul className="text-sm space-y-1">
                    <li>Domain reputation checking</li>
                    <li>Passive DNS analysis</li>
                    <li>Network blocking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOAR Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PlatformComparison
              category="Enterprise SOAR Platforms"
              platforms={[
                {
                  name: "Phantom (now Splunk SOAR) (splunk.com)",
                  type: "commercial",
                  description: "Leading SOAR platform with extensive integrations",
                  features: ["1000+ integrations", "Visual playbook editor", "Case management", "Custom functions"]
                },
                {
                  name: "Demisto (now Cortex XSOAR) (paloaltonetworks.com)",
                  type: "commercial",
                  description: "AI-powered security orchestration platform",
                  features: ["Machine learning", "Incident lifecycle management", "Marketplace integrations", "Multi-tenant"]
                },
                {
                  name: "IBM Resilient (ibm.com/resilient)",
                  type: "commercial",
                  description: "Incident response platform with automation",
                  features: ["Workflow automation", "Threat intelligence", "Communication tools", "Compliance reporting"]
                }
              ]}
            />

            <PlatformComparison
              category="Open Source & Emerging SOAR"
              platforms={[
                {
                  name: "TheHive + Cortex (thehive-project.org)",
                  type: "open-source",
                  description: "Open source incident response platform",
                  features: ["Case management", "Observable analysis", "Custom analyzers", "MISP integration"]
                },
                {
                  name: "WALKOFF (walkoff.readthedocs.io)",
                  type: "open-source",
                  description: "Flexible automation framework",
                  features: ["Drag-and-drop workflows", "Python-based", "REST APIs", "Custom applications"]
                },
                {
                  name: "Shuffle (shuffler.io)",
                  type: "open-source",
                  description: "Modern automation platform",
                  features: ["Cloud & on-premise", "Docker-based", "Workflow sharing", "OpenAPI integration"]
                }
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Integrated SOC Technology Stack</h2>
            <p className="text-muted-foreground">Building cohesive security operations through API-driven integration</p>
          </div>

          {/* Integration Architecture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Technology Integration Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="text-center p-4 border rounded-lg">
                    <Database className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">SIEM</h4>
                    <p className="text-xs text-muted-foreground">Data Collection</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <h4 className="font-medium">TIP</h4>
                    <p className="text-xs text-muted-foreground">Threat Context</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">IMS</h4>
                    <p className="text-xs text-muted-foreground">Case Management</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-medium">SOAR</h4>
                    <p className="text-xs text-muted-foreground">Automation</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <h4 className="font-medium">Knowledge</h4>
                    <p className="text-xs text-muted-foreground">Documentation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Detection to Response Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flow-diagram">
                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 text-sm bg-muted px-4 py-2 rounded-lg">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs">SIEM Events</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded text-xs">TIP Context</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded text-xs">IMS Cases</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded text-xs">SOAR Response</span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 rounded text-xs">Knowledge</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Critical Integration Points</h4>
                    <ul className="space-y-1 text-sm">
                      <li>SIEM ↔ TIP: Indicator lookups and context</li>
                      <li>SIEM ↔ IMS: Alert to case conversion</li>
                      <li>TIP ↔ IMS: Threat intelligence enrichment</li>
                      <li>SOAR ↔ All: Orchestrated workflows</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Success Metrics</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Reduced mean time to detection (MTTD)</li>
                      <li>Improved response consistency</li>
                      <li>Enhanced analyst productivity</li>
                      <li>Better threat attribution</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Best Practices */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Start Simple</h4>
                    <p className="text-xs text-muted-foreground">Begin with high-volume, low-complexity tasks</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">API-First Design</h4>
                    <p className="text-xs text-muted-foreground">Ensure all platforms support robust API integration</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Human Oversight</h4>
                    <p className="text-xs text-muted-foreground">Build in approval gates for critical actions</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Continuous Improvement</h4>
                    <p className="text-xs text-muted-foreground">Iterate based on analyst feedback and metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Future Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">AI/ML Integration</h4>
                    <p className="text-xs text-muted-foreground">Advanced analytics and automated analysis</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Cloud-Native Architecture</h4>
                    <p className="text-xs text-muted-foreground">Scalable, distributed security platforms</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Real-time Intelligence</h4>
                    <p className="text-xs text-muted-foreground">Automated sharing and context generation</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Skills Development</h4>
                    <p className="text-xs text-muted-foreground">API skills and automation capabilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Key Takeaways */}
      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          <strong>Integration Success:</strong> The most effective SOCs integrate TIP, SIEM, IMS, and SOAR platforms 
          through robust APIs, creating seamless workflows from threat detection to incident resolution while 
          maintaining human oversight for critical decisions.
        </AlertDescription>
      </Alert>
    </div>
  )
}

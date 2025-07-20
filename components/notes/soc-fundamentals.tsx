"use client"

import { useState } from "react"
import { Copy, Check, Shield, Users, Settings, Target, AlertTriangle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

interface ConceptCardProps {
  title: string
  description: string
  keyPoints?: string[]
  examples?: string[]
  note?: string
}

function ConceptCard({ title, description, keyPoints, examples, note }: ConceptCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {keyPoints && keyPoints.length > 0 && (
          <div className="space-y-2">
            <ul className="space-y-1">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {examples && examples.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Examples:</h4>
            <div className="space-y-1">
              {examples.map((example, index) => (
                <div key={index} className="bg-muted/50 p-2 rounded text-xs">
                  <code>{example}</code>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {note && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Note:</strong> {note}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function SocFundamentalsNotes() {
  return (
    <div className="space-y-8">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Notes on Security Operations Center (SOC) fundamentals, including key industry reports, 
          organizational structure, processes, and best practices.
        </AlertDescription>
      </Alert>

      {/* Overview Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">Core concepts and mission of Security Operations Centers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="SOC Mission"
            description="The primary mission of a Security Operations Center is to identify, minimize, and remediate security incidents through continuous monitoring and response capabilities."
            keyPoints={[
              "Mission: Identify and reduce breaches",
              "Charter provides authority to operate",
              "Steering committee provides guidance and budget",
              "Complex system of People-Technology-Processes"
            ]}
          />
          
          <ConceptCard
            title="High-Level SOC Process"
            description="The fundamental workflow that drives all SOC operations, from initial data collection to continuous improvement."
            keyPoints={[
              "Collection: Gather data from various sources",
              "Detection: Identify potential threats and anomalies",
              "Triage: Prioritize and categorize alerts",
              "Investigation: Deep dive into incidents",
              "Continuous Improvement: Learn and adapt"
            ]}
          />
          
          <ConceptCard
            title="SOC Input/Output Model"
            description="Understanding what feeds into the SOC and what it produces as value for the organization."
            keyPoints={[
              "Input: Threat intelligence and signatures",
              "Input: Network traffic and endpoint events",
              "Output: Identified incidents",
              "Output: Minimized impact through response",
              "Output: Remediated security issues"
            ]}
          />
          
          <ConceptCard
            title="Core SOC Activities"
            description="The essential functions that every SOC must perform to meet its mission objectives."
            keyPoints={[
              "Data Collection: From network and devices",
              "Detection: Using rules, signatures, and analytics",
              "Triage and Investigation: Analyzing alerts",
              "Incident Response: Containing and remediating threats"
            ]}
          />
        </div>
      </div>

      {/* Key Reports Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Key Industry Reports</h2>
          <p className="text-muted-foreground">Essential reading for understanding current threat landscape</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Verizon Data Breach Investigations Report (DBIR) 2025"
            description="Annual report providing comprehensive analysis of security incidents and data breaches across industries worldwide."
            keyPoints={[
              "Industry-standard breach statistics and trends",
              "Attack patterns and threat actor motivations",
              "Industry-specific threat landscapes",
              "Valuable for threat modeling and risk assessment",
              "Updated annually with current year's data"
            ]}
            note="Essential reading for understanding current threat landscape and industry benchmarks"
          />
          
          <ConceptCard
            title="Mandiant M-Trends Report 2025"
            description="Annual threat intelligence report from Mandiant (now part of Google Cloud) focusing on advanced persistent threats and incident response insights."
            keyPoints={[
              "Advanced persistent threat (APT) analysis",
              "Incident response case studies",
              "Dwell time statistics and trends",
              "Attack lifecycle and TTPs analysis",
              "Regional threat intelligence insights"
            ]}
            note="Particularly valuable for understanding sophisticated attack methods and response strategies"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Verizon DBIR 2025 Key Statistics
                <Badge variant="destructive">Critical</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Third-party breaches doubled:</strong> Breaches linked to third-party involvement increased 
                    significantly, driven by vulnerability exploitation and business interruptions.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Vulnerability exploitation surge:</strong> Major increase in attackers exploiting 
                    vulnerabilities for initial access compared to last year.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Poor patch management:</strong> Less than half of perimeter-device vulnerabilities 
                    were fully remediated, with almost half remaining unresolved.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Ransomware rise:</strong> Notable increase in ransomware presence across 
                    all breaches analyzed.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Mandiant M-Trends 2025 Insights
                <Badge variant="secondary">Intelligence</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-xs">
                <strong>Data Theft Statistics:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• 37% of investigations showed evidence of data theft</li>
                  <li>• 11% involved data theft extortion without ransomware</li>
                  <li>• 6% involved multi-faceted extortion (data theft + ransomware)</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-xs">
                <strong>APT28 (Russian):</strong> Selective data theft focusing on personnel data, 
                email content, and geopolitical documents aligned with Russian interests.
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-xs">
                <strong>APT41 (Chinese):</strong> Used SQLULDR2 and PINEGROVE tools for systematic 
                large-scale data exfiltration via OneDrive in EMEA and JAPAC campaigns.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Organization Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Organization & Structure</h2>
          <p className="text-muted-foreground">SOC roles, responsibilities, and organizational models</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              SOC Roles and Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Core Analyst Roles</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Security Analyst:</strong> Investigation, triage of alerts, incident response</li>
                  <li><strong>Threat Intelligence Analyst:</strong> Research and analysis of threat data</li>
                  <li><strong>Incident Lead:</strong> Coordinates response efforts (SOC Lead → Incident Lead → Team)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Supporting Roles</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Engineering & Infrastructure:</strong> Design and implementation of SOC infrastructure</li>
                  <li><strong>System Administrator:</strong> Care and upkeep of SOC tools</li>
                  <li><strong>SOC Manager:</strong> Strategic oversight and coordination</li>
                  <li><strong>Subject Matter Expert:</strong> Specialized knowledge in specific areas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Tiered SOC Structure"
            description="Traditional hierarchical approach to SOC operations with escalation paths based on complexity and expertise required."
            keyPoints={[
              "Tier 1: Initial triage and analysis, ticket generation",
              "Tier 2: Attack scoping, further analysis, tactical and remediation support",
              "Tier 3: Highly complex tasks, deep analysis, methodology development, strategic support, hunting"
            ]}
            note="Each tier has specific responsibilities and escalation criteria"
          />
          
          <ConceptCard
            title="Tierless SOC Model"
            description="Alternative approach where analysts work collaboratively across all levels of complexity rather than strict hierarchical escalation."
            keyPoints={[
              "Cross-functional teams with varied expertise",
              "Collaborative approach to incident handling",
              "Flexible resource allocation based on incident needs",
              "Emphasis on knowledge sharing and skill development"
            ]}
            note="Growing trend in modern SOC operations for improved efficiency"
          />
        </div>
      </div>

      {/* Processes Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Processes & Operations</h2>
          <p className="text-muted-foreground">Core processes and operational frameworks</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Direction Setting: Crafting the InfoSec Playbook
              <Badge variant="secondary">Industry Best Practice</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Key Questions to Answer</h4>
                <ul className="space-y-2 text-sm">
                  <li>What are we trying to protect?</li>
                  <li>What are the threats?</li>
                  <li>How do we detect them?</li>
                  <li>How do we respond?</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Critical Understanding</h4>
                <p className="text-sm text-muted-foreground">
                  Understanding the organization's <strong>risk appetite</strong> is fundamental. 
                  The SOC's job is to meet this risk appetite through appropriate controls and responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Specialty/Auxiliary Capabilities"
            description="Supporting functions that enhance core SOC operations and provide specialized expertise for complex scenarios."
            keyPoints={[
              "Threat Intelligence: Research and analysis of threat actors and TTPs",
              "Digital Forensics: Deep investigation and reverse engineering support",
              "Self-Assessment: Inventory, configuration monitoring, vulnerability assessment",
              "Red Team Operations: Adversarial testing and validation",
              "Compliance and Audit Support"
            ]}
            note="These capabilities support but don't replace core SOC functions"
          />
          
          <ConceptCard
            title="SOC as People-Process-Technology"
            description="The SOC is fundamentally built on three pillars that must work together harmoniously to achieve mission success."
            keyPoints={[
              "People: Skilled analysts, engineers, and managers",
              "Process: Standardized procedures and workflows",
              "Technology: Security tools, SIEM, detection platforms",
              "Integration: All three must be aligned and optimized",
              "Command Center: Central coordination point"
            ]}
            note="Weakness in any pillar compromises overall SOC effectiveness"
          />
        </div>
      </div>

      {/* Documentation Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Documentation Framework</h2>
          <p className="text-muted-foreground">Essential documentation types and governance</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Critical SOC Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Technical Documentation</h4>
                <ul className="space-y-1 text-sm">
                  <li>Network diagram (simplified version)</li>
                  <li>Points of visibility: taps, span ports, full packet capture</li>
                  <li>Data/log flow diagram</li>
                  <li>List of critical assets</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Response Documentation</h4>
                <ul className="space-y-1 text-sm">
                  <li>Incident response plan</li>
                  <li>Communication plan (who to inform, when)</li>
                  <li>Disaster Recovery Plan (DRP)</li>
                  <li>Business Continuity Plan (BCP)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConceptCard
            title="Policies"
            description="High-level, broad, direction-setting documents that are mandatory for the organization."
            keyPoints={[
              "Mandatory compliance required",
              "Broad scope and direction",
              "High-level requirements"
            ]}
            examples={[
              "All systems plugged into the network must have antivirus installed"
            ]}
          />
          
          <ConceptCard
            title="Standards"
            description="Mandatory documents that define how or how much, providing specific requirements for implementation."
            keyPoints={[
              "Mandatory like policies",
              "Define specific implementation details",
              "Measurable requirements"
            ]}
            examples={[
              "Configuration settings for antivirus agents must be..."
            ]}
          />
          
          <ConceptCard
            title="Procedures"
            description="Step-by-step instructions for completing specific processes or tasks within the SOC."
            keyPoints={[
              "Detailed step-by-step instructions",
              "Process-oriented guidance",
              "Operational focus"
            ]}
            examples={[
              "How to install and ensure antivirus is working"
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Guidelines & Baselines"
            description="Discretionary recommendations and specific configuration settings for SOC operations."
            keyPoints={[
              "Guidelines: Discretionary, suggested actions where standards don't exist",
              "Baselines: Highly specific settings (e.g., CIS benchmarks)",
              "Best practice recommendations",
              "Configuration templates"
            ]}
            examples={[
              "Best practices for antivirus deployment",
              "CIS benchmark configurations"
            ]}
          />
          
          <ConceptCard
            title="Use Cases & Playbooks"
            description="SOC-specific prescriptive rules and procedures for detection and response scenarios."
            keyPoints={[
              "SOC-specific detection rules",
              "Prescriptive response procedures",
              "Scenario-based guidance",
              "Threat-specific workflows"
            ]}
            note="Essential for consistent and effective SOC operations"
          />
        </div>
      </div>

      {/* Metrics Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Metrics & Measurement</h2>
          <p className="text-muted-foreground">Performance indicators and effectiveness measurement</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              SOC Metrics Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Metrics serve as a crucial communication line from the SOC to management. 
              Good metrics must be clearly understandable, repeatable, automatable, and useful for decision-making.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-green-600">Good Metrics Are:</h4>
                <ul className="text-xs space-y-1">
                  <li>Clearly understandable</li>
                  <li>Repeatable</li>
                  <li>Automatable</li>
                  <li>Useful for decisions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-blue-600">Metric Categories:</h4>
                <ul className="text-xs space-y-1">
                  <li>Key Performance Indicators (KPIs)</li>
                  <li>Operational Metrics</li>
                  <li>Efficiency Metrics</li>
                  <li>Effectiveness Metrics</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-purple-600">Communication:</h4>
                <ul className="text-xs space-y-1">
                  <li>Management reporting</li>
                  <li>Trend analysis</li>
                  <li>Performance tracking</li>
                  <li>Improvement identification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Example SOC Metrics"
            description="Practical examples of metrics that provide value to SOC operations and management reporting."
            keyPoints={[
              "Incidents by delivery factor (interesting trend analysis)",
              "Unique hosts with viruses detected (KPI)",
              "% of systems with logs collected (operational metric)",
              "% of network traffic monitored (coverage metric)",
              "Number of attacks blocked (challenging to define)"
            ]}
            note="'Attacks' is a very broad term and difficult to define consistently"
          />
          
          <ConceptCard
            title="Operational Improvement Metrics"
            description="Metrics focused on measuring and improving SOC operational efficiency over time."
            keyPoints={[
              "Mean Time to Detection (MTTD)",
              "Mean Time to Response (MTTR)",
              "False positive rates by detection rule",
              "Analyst productivity and case closure rates",
              "Coverage improvement over time"
            ]}
            note="Focus on 'are we doing better over time?' questions"
          />
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Key Industry References:</strong> These notes incorporate best practices from industry reports including 
          Verizon DBIR, Mandiant M-Trends and NIST Cybersecurity Framework. 
          Review and update regularly as SOC practices and threat landscape evolve.
        </AlertDescription>
      </Alert>
    </div>
  )
}

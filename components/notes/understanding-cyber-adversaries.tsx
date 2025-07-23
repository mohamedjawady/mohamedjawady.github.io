import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Users, 
  Target, 
  AlertTriangle, 
  Zap, 
  Globe, 
  Eye,
  TrendingUp,
  Clock,
  MapPin,
  DollarSign,
  Settings,
  Lock
} from "lucide-react";

export default function UnderstandingCyberAdversaries() {
  const threatActorCategories = [
    {
      type: "Nation-State APTs",
      icon: <Globe className="h-5 w-5" />,
      characteristics: [
        "Long-term persistence in target networks",
        "Custom malware and zero-day exploits",
        "Sophisticated social engineering campaigns",
        "Focus on intelligence gathering and strategic disruption"
      ],
      examples: [
        { name: "APT28 (Fancy Bear)", origin: "Russia", focus: "NATO countries targeting" },
        { name: "APT40 (Leviathan)", origin: "China", focus: "Maritime and healthcare sectors" },
        { name: "Lazarus Group", origin: "North Korea", focus: "Financial crimes and cryptocurrency" },
        { name: "APT35 (Charming Kitten)", origin: "Iran", focus: "Credential harvesting campaigns" }
      ]
    },
    {
      type: "Cybercriminal Organizations",
      icon: <DollarSign className="h-5 w-5" />,
      characteristics: [
        "Profit-driven motivations",
        "Sophisticated business operations",
        "Ransomware-as-a-Service models",
        "Specialized roles and services"
      ],
      examples: [
        { name: "LockBit", origin: "Russia", focus: "Ransomware operations (disrupted Feb 2024, variants active)" },
        { name: "FIN7", origin: "International", focus: "Point-of-sale malware and restaurant targeting" },
        { name: "Carbanak", origin: "Eastern Europe", focus: "Banking sector theft ($1B+)" },
        { name: "Play", origin: "Russia", focus: "Healthcare and education targeting (2024-2025)" }
      ]
    },
    {
      type: "Hacktivists",
      icon: <Users className="h-5 w-5" />,
      characteristics: [
        "Ideologically or politically motivated",
        "Public awareness campaigns",
        "Data leaks and website defacements",
        "Distributed and decentralized operations"
      ],
      examples: [
        { name: "Anonymous", origin: "Global", focus: "Various political and social causes" },
        { name: "Killnet", origin: "Russia", focus: "Pro-Russian operations against Ukraine" },
        { name: "IT Army of Ukraine", origin: "Ukraine", focus: "Cyber resistance operations" },
        { name: "DDoSecrets", origin: "Global", focus: "Data transparency and leak publication" }
      ]
    },
    {
      type: "Insider Threats",
      icon: <Eye className="h-5 w-5" />,
      characteristics: [
        "Privileged access and institutional knowledge",
        "Financial, ideological, or coercive motivations",
        "Difficult to detect and prevent",
        "High potential for significant damage"
      ],
      examples: [
        { name: "Financial Motivation", origin: "Internal", focus: "Data theft for monetary gain" },
        { name: "Ideological", origin: "Internal", focus: "Whistleblowing or political motivations" },
        { name: "Coercion", origin: "Internal", focus: "External pressure or blackmail situations" },
        { name: "Negligent", origin: "Internal", focus: "Unintentional security violations" }
      ]
    }
  ];

  const modernAttackTrends = [
    {
      trend: "Cloud-Native Attacks",
      techniques: [
        "Container escape techniques",
        "Kubernetes cluster compromise", 
        "Cloud storage misconfigurations",
        "Identity and Access Management (IAM) abuse"
      ]
    },
    {
      trend: "Supply Chain Targeting",
      techniques: [
        "Software development lifecycle compromise",
        "Package repository poisoning",
        "Hardware implant insertion", 
        "Third-party service provider attacks"
      ]
    },
    {
      trend: "AI and ML Exploitation",
      techniques: [
        "Adversarial machine learning attacks",
        "Deepfake technology for social engineering",
        "AI-powered automation in attack campaigns",
        "Large Language Model (LLM) prompt injection"
      ]
    }
  ];

  const caseStudies = [
    {
      title: "SolarWinds Supply Chain Attack (2020)",
      actor: "APT29 (Cozy Bear/SVR)",
      timeline: [
        "Sept 2019: Initial compromise of SolarWinds build environment",
        "March 2020: Trojanized Orion updates distributed", 
        "Dec 2020: Attack discovery and public disclosure"
      ],
      impact: [
        "Multiple U.S. government agencies compromised",
        "Fortune 500 companies affected",
        "Estimated remediation costs exceeding $100 million"
      ],
      lessons: [
        "Supply chain security requires comprehensive vendor assessment",
        "Code signing verification is insufficient against sophisticated actors",
        "Network segmentation and zero-trust architecture are critical"
      ]
    },
    {
      title: "Colonial Pipeline Ransomware (2021)",
      actor: "DarkSide (Russian-speaking cybercriminal group)",
      timeline: [
        "May 7, 2021: Initial compromise through VPN credential theft",
        "May 8, 2021: Ransomware deployment across IT systems",
        "May 12, 2021: Pipeline operations resumed after $4.4M ransom payment"
      ],
      impact: [
        "5,500-mile pipeline system shutdown for six days",
        "Fuel shortages across the Eastern United States", 
        "Significant economic and social disruption"
      ],
      lessons: [
        "OT and IT segregation is essential",
        "Incident response planning must include business continuity",
        "Ransomware payments may be recoverable through law enforcement"
      ]
    },
    {
      title: "MOVEit Zero-Day Campaign (2023)",
      actor: "Clop (Lace Tempest)",
      timeline: [
        "May 2023: Zero-day exploitation begins",
        "June 2023: Mass data extortion campaign launches",
        "Ongoing: New victims continue to be identified"
      ],
      impact: [
        "Over 40 million individuals' personal data compromised",
        "Major organizations including BBC, British Airways, Siemens affected",
        "Healthcare, financial, and government sectors heavily impacted"
      ],
      lessons: [
        "Third-party file transfer solutions require rigorous security assessment",
        "Zero-day vulnerabilities in widely-used software create systemic risk",
        "Coordinated disclosure and rapid patching are critical"
      ]
    },
    {
      title: "Change Healthcare Cyberattack (2024)",
      actor: "ALPHV/BlackCat (RaaS affiliate)",
      timeline: [
        "Feb 21, 2024: Initial compromise detected",
        "Feb 2024: Payment systems and prescription services disrupted",
        "March 2024: Gradual service restoration begins"
      ],
      impact: [
        "Disruption to one-third of all U.S. healthcare transactions",
        "Millions of patients unable to fill prescriptions",
        "Estimated $100+ billion financial impact across healthcare sector"
      ],
      lessons: [
        "Critical infrastructure attacks have cascading sector-wide effects",
        "Ransomware targeting payment systems can paralyze essential services",
        "Healthcare sector remains highly vulnerable to sophisticated attacks"
      ]
    }
  ];

  const attributionChallenges = [
    {
      category: "Technical Factors",
      challenges: [
        "Code similarities and shared development artifacts",
        "Command and control infrastructure patterns",
        "Encryption and obfuscation techniques",
        "Compilation timestamps and language settings"
      ]
    },
    {
      category: "Operational Challenges", 
      challenges: [
        "False flag operations using other groups' tools",
        "Language and cultural artifact manipulation",
        "Infrastructure sharing and misdirection",
        "Nation-states employing cybercriminal proxies"
      ]
    }
  ];

  const defensiveStrategies = [
    {
      threat: "Nation-State Threats",
      controls: [
        "Advanced persistent threat detection",
        "Air-gapped critical systems",
        "Insider threat programs",
        "Zero-trust architecture implementation"
      ]
    },
    {
      threat: "Cybercriminals",
      controls: [
        "Email security and anti-phishing",
        "Endpoint protection and EDR",
        "Backup and recovery planning",
        "Network segmentation"
      ]
    },
    {
      threat: "Hacktivists",
      controls: [
        "Web application security",
        "DDoS mitigation capabilities",
        "Social media monitoring",
        "Public-facing asset protection"
      ]
    },
    {
      threat: "Insider Threats",
      controls: [
        "Privileged access management",
        "Data loss prevention (DLP)",
        "Behavioral analytics",
        "Regular access reviews"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Understanding Cyber Adversaries
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive analysis of the modern threat landscape, from nation-state actors to opportunistic criminals
        </p>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            "If you know the enemy and know yourself, you need not fear the result of a hundred battles." - Sun Tzu
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="actors" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="actors">Threat Actors</TabsTrigger>
          <TabsTrigger value="trends">Modern Trends</TabsTrigger>
          <TabsTrigger value="cases">Case Studies</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
          <TabsTrigger value="future">Future Threats</TabsTrigger>
        </TabsList>

        <TabsContent value="actors" className="space-y-6">
          <div className="grid gap-6">
            {threatActorCategories.map((category, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Characteristics:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {category.characteristics.map((char, idx) => (
                          <li key={idx}>{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Notable Examples:</h4>
                      <div className="space-y-2">
                        {category.examples.map((example, idx) => (
                          <div key={idx} className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{example.name}</Badge>
                              <Badge variant="secondary">{example.origin}</Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{example.focus}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Modern Attack Trends (2024-2025)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {modernAttackTrends.map((trend, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-lg mb-2">{trend.trend}</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {trend.techniques.map((technique, idx) => (
                          <li key={idx}>{technique}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Traditional APT Tactics, Techniques, and Procedures (TTPs)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Initial Access:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Spear-phishing with contextually relevant lures</li>
                      <li>Watering hole attacks on industry-specific websites</li>
                      <li>Supply chain compromises</li>
                      <li>Zero-day exploitation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Persistence & Escalation:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Living-off-the-land techniques</li>
                      <li>Registry modification and service installation</li>
                      <li>Credential dumping and pass-the-hash attacks</li>
                      <li>Kernel-level rootkits and bootkits</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-6">
          <div className="grid gap-6">
            {caseStudies.map((study, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{study.title}</span>
                    <Badge variant="destructive">{study.actor}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Timeline:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {study.timeline.map((event, idx) => (
                          <li key={idx}>{event}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Impact:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {study.impact.map((impact, idx) => (
                          <li key={idx}>{impact}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        Key Lessons:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {study.lessons.map((lesson, idx) => (
                          <li key={idx}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Attribution Challenges in Modern Threat Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {attributionChallenges.map((challenge, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-3">{challenge.category}:</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        {challenge.challenges.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Attribution Complexity:</strong> Modern threat actors increasingly use false flag operations, 
                shared infrastructure, and proxy relationships, making accurate attribution extremely challenging. 
                Nation-states often employ cybercriminal groups, creating plausible deniability and complicating 
                intelligence analysis.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        <TabsContent value="defense" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Threat-Informed Defense Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Risk Assessment Framework:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">1</Badge>
                          <span className="text-sm">Threat Actor Identification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">2</Badge>
                          <span className="text-sm">Capability Assessment</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">3</Badge>
                          <span className="text-sm">Intent Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">4</Badge>
                          <span className="text-sm">Opportunity Evaluation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Tailored Security Controls:</h4>
                    <div className="grid gap-4">
                      {defensiveStrategies.map((strategy, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h5 className="font-medium mb-2">{strategy.threat}:</h5>
                          <div className="flex flex-wrap gap-2">
                            {strategy.controls.map((control, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {control}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Intelligence-Driven Security Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Threat Intelligence Integration:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Indicators of Compromise (IoC) feeds</li>
                      <li>Tactics, Techniques, and Procedures (TTP) mapping</li>
                      <li>Diamond Model analysis framework</li>
                      <li>MITRE ATT&CK framework alignment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Proactive Threat Hunting:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Hypothesis-driven hunting campaigns</li>
                      <li>Behavioral analytics and anomaly detection</li>
                      <li>Network traffic analysis and forensics</li>
                      <li>Endpoint detection and response (EDR) platforms</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="future" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Emerging Technologies and Attack Vectors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold mb-2">Quantum Computing Threats:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Cryptographic algorithm vulnerabilities</li>
                      <li>Post-quantum cryptography transition challenges</li>
                      <li>Timeline for quantum supremacy achievement</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold mb-2">Internet of Things (IoT) Security:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Massive attack surface expansion</li>
                      <li>Weak authentication and encryption</li>
                      <li>Botnet recruitment potential</li>
                      <li>Critical infrastructure dependencies</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">5G and Edge Computing:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Network slicing security implications</li>
                      <li>Edge device compromise risks</li>
                      <li>Supply chain security concerns</li>
                      <li>Nation-state competition over infrastructure</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geopolitical Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cyber Warfare Evolution:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Integration with conventional military operations</li>
                      <li>Critical infrastructure targeting normalization</li>
                      <li>Economic warfare through cyber means</li>
                      <li>International law and norms development</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Great Power Competition:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>U.S.-China technology rivalry</li>
                      <li>Russia's asymmetric cyber capabilities</li>
                      <li>Middle East regional cyber conflicts</li>
                      <li>Proxy group proliferation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="text-center">Key Takeaways</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <span>Understanding cyber adversaries requires continuous analysis of evolving threats and geopolitical contexts</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <span>Effective cybersecurity strategy must be threat-informed, intelligence-driven, and adaptable</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <span>Organizations must implement tailored defenses based on their specific threat landscape</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <span>Modern threats are characterized by sophisticated nation-state actors and professionalized cybercrime</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">5</Badge>
                <span>Attribution challenges increase due to false flag operations and proxy relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">6</Badge>
                <span>Success requires comprehensive threat intelligence capabilities and adaptive defense strategies</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

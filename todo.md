CTI SERIES — SEASON 1, WEEK 1
What is CTI and Why It Matters
Intelligence lifecycle, IOCs vs TTPs, common misconceptions debunked.


Most organizations treat threat intelligence as a feed you subscribe to. You pay the vendor, you get a list of IPs and hashes, you block them at the firewall, and you call it a day. That's not CTI. That's a blocklist. The distinction matters more than it might seem.
Cyber Threat Intelligence is the product of a disciplined analytical process that transforms raw data about adversary behavior into actionable knowledge. The operative word is *actionable*. Raw data becomes intelligence only when it reduces uncertainty for a specific decision-maker with a specific problem.
If you're an incident responder trying to scope a breach, intelligence helps you understand what the attacker did next after gaining a foothold. If you're a CISO presenting to the board, intelligence tells you which threat actors have historically targeted your sector and what their typical dwell time looks like. Same raw data, different intelligence products, different consumers.
The Intelligence Lifecycle
Intelligence doesn't appear fully formed. It goes through a structured process, and skipping any stage produces garbage at the end. The lifecycle has six phases, and they're circular — not linear.
Direction is where every intelligence effort begins. Before you collect anything, you define the questions you're trying to answer. This sounds obvious, but it's where most programs fail. "Tell me everything about APT29" is not a direction. "Is APT29 currently targeting financial services firms using spearphishing lures related to SWIFT transfers?" is. Good direction requirements are specific, answerable, and tied to a real decision someone needs to make.
Collection is gathering raw data that might answer your question. This includes technical feeds (passive DNS, sandbox reports, dark web forum data), human sources, and open-source material. The key discipline here is not collecting everything — it's collecting enough of the right things. More data creates more noise.
Processing turns raw collection into something an analyst can work with. This means normalizing formats, deduplicating records, translating forum posts, extracting structured indicators from unstructured reports, and tagging data with confidence and source information. It's unglamorous work that determines the quality of everything downstream.
Analysis is where human judgment enters the picture. An analyst takes processed data and starts asking "so what?" They identify patterns, test hypotheses, challenge assumptions, and produce assessments with explicit confidence levels. This is the step that separates intelligence from information.
Dissemination is delivering the finished intelligence product to the right consumer in the right format at the right time. A 40-page technical report is wrong for a CISO who has five minutes before a board meeting. A one-line verdict is wrong for a threat hunter who needs the underlying evidence. Format follows consumer.
Feedback closes the loop. Did the intelligence actually answer the question? Did the consumer act on it? Was the assessment accurate? Without feedback, programs drift out of alignment with the people they're supposed to serve.
IOCs vs TTPs: One Ages in Hours, the Other Lasts Years
This is the distinction that changes how you prioritize your work.
An Indicator of Compromise (IOC) is a technical artifact: a hash, an IP address, a domain, a file path. IOCs are concrete and easy to share. They're also the least durable form of intelligence. An attacker who discovers their C2 domain is burning will rotate infrastructure overnight. The IP you blocked yesterday is worthless by Thursday. IOCs have a half-life measured in hours to days.
Tactics, Techniques, and Procedures (TTPs) describe how an adversary operates. Not which IP they used, but how they established persistence — via a scheduled task or a WMI event subscription. Not which payload they dropped, but how they moved laterally — via pass-the-hash or valid account credentials. TTPs are behavioral. Changing them requires retraining, retooling, and often restructuring the attacker's entire operation. They're orders of magnitude more expensive to modify than rotating an IP address.
This is why the Pyramid of Pain (introduced by David Bianco) matters so much. Hash values sit at the base: trivial for attackers to change, low value for defenders to detect. TTPs sit at the apex: extraordinarily painful for attackers to change, high value for defenders who can detect them.
In practice, a mature CTI program collects IOCs because they're immediately actionable for blocking and detection, but it invests analytical effort in understanding TTPs because that knowledge transfers across campaigns, infrastructure rotations, and even when a threat actor rebrands.
Strategic, Tactical, and Operational Intelligence
Not all CTI is the same product for the same audience.
Strategic intelligence answers long-horizon questions: Which threat actors are likely to target our organization over the next 12-18 months? How does the geopolitical environment affect our risk posture? Strategic intelligence is consumed by executives and boards. It shapes resource allocation and risk appetite. It rarely contains technical indicators.
Operational intelligence describes specific adversary campaigns: a phishing campaign targeting CFOs in the energy sector this month, with attributed infrastructure and specific lure themes. It bridges the strategic and tactical layers — specific enough to act on, abstracted enough to inform planning. Security managers and threat hunters are the primary consumers.
Tactical intelligence is the most granular: YARA rules, Sigma detections, specific hashes, IP ranges to block, C2 communication patterns. This is what an analyst or an automated system ingests directly into defensive tooling. It requires no further analysis — it's immediately operationalizable.
The mistake organizations make is producing only tactical intelligence (because it's easiest to generate from feeds) while starving the strategic layer (which requires the most human judgment). A program that can only tell you to block an IP but can't tell you why that IP matters and what it signals about upcoming campaigns is running at a fraction of its potential value.
Who Consumes CTI and What They Actually Need
Understanding your consumers is not a soft skill — it's an analytical requirement. Intelligence that doesn't reach the right person in the right form at the right moment is not intelligence. It's overhead.
SOC analysts need actionable indicators and detection rules. They're responding to alerts in real time and need to know: is this a false positive or a real attack? Which known threat actor does this behavior resemble?
Incident responders need campaign context. When they're inside a breach, they need to know the full kill chain of the adversary they're dealing with — their persistence mechanisms, their lateral movement preferences, their exfiltration methods.
Threat hunters need TTPs and hypotheses. They're proactively searching for adversary activity that hasn't triggered any alerts yet. They need to know: what does this threat actor's pre-compromise reconnaissance look like?
Security engineers need detection requirements. They translate intelligence into Sigma rules, YARA signatures, and SIEM queries. They need enough technical depth to build something that detects real behavior rather than a simplified approximation of it.
Executives and boards need decision support. They're not interested in malware hash values. They need to know: are we likely to be targeted? Are we spending our security budget on the right things?
Common Misconceptions, Debunked
CTI is not a feed. A feed of IP addresses or hashes is a data source. It only becomes intelligence after a human or a calibrated analytical process asks: what does this data tell us about adversary behavior, and what should we do differently because of it? Many organizations buy threat intelligence platforms and feeds, then wonder why their security posture hasn't improved. They've bought data, not intelligence.
CTI is not a tool. Platforms like MISP and OpenCTI are excellent force multipliers. They are not CTI programs. A CTI program is people, processes, and requirements first — tools second. Deploying a platform without defined requirements and trained analysts produces an expensive data warehouse.
CTI is not a checkbox. "We have threat intelligence" does not mean your program is functioning. The question is: is someone acting differently today because of intelligence produced yesterday? If the intelligence never reaches the people who need it in a form they can use, the program exists on paper only.
CTI does not require a nation-state budget. Small security teams can run effective CTI programs by defining narrow, focused requirements, consuming high-quality free sources (abuse.ch, CIRCL, AlienVault OTX, MITRE ATT&CK), and producing lightweight intelligence products that feed directly into existing detection workflows.
The Analyst Mindset
Technical skills matter in CTI. But the skill that separates good analysts from great ones is structured analytical thinking — the ability to hold uncertainty, challenge assumptions, and avoid the cognitive traps that produce confident wrong answers.
The most dangerous failure mode in threat intelligence is mirror imaging: assuming adversaries think and operate the way you do. Attackers have different constraints, different incentives, and a different operational calculus. An analyst who assumes a threat actor will take the most logical path from their own perspective will frequently be wrong.
The second most dangerous failure is confirmation bias: finding evidence that confirms your hypothesis and discounting evidence that doesn't. Good analysts actively try to falsify their own assessments. They look for the scenario that would prove them wrong, then ask whether the evidence is inconsistent with it.
And finally: intelligence is not certainty. A finished intelligence product should always communicate the analyst's confidence level and the evidence base behind the assessment. "We assess with high confidence that X is attributable to APT41" and "We assess with low confidence" are very different statements, even if the underlying conclusion is the same. Consumers need that information to make good decisions.
What's Next
Next week: the Pyramid of Pain in depth. We'll work through each level with hands-on examples — from hash values that rotate overnight to TTPs that remain stable across years of a threat actor's operations. Understanding the pyramid is the foundation for understanding why the rest of the series is structured the way it is.
 
CTI SERIES — SEASON 1, WEEK 2
The Threat Intelligence Pyramid
IOCs, TTPs, threat actors, campaigns — with hands-on examples at each level.


David Bianco published the Pyramid of Pain in 2013. Over a decade later, it remains the single most useful conceptual framework in threat intelligence. The reason it has aged so well is that it describes something fundamental about adversary economics, not something about a specific tool or technique that might go obsolete.
The core insight: not all indicators are equal. Some are trivially cheap for attackers to change. Others are profoundly expensive. A defensive program that optimizes for the cheap indicators spends enormous effort on things that produce minimal friction for the adversary. A program that can operate at the upper levels of the pyramid forces attackers to change the way they fundamentally operate — and that costs them time, money, and operational risk.
Let's work through each level, from the base up, with real examples at each step.
Level 1: Hash Values — The Trivia Layer
A cryptographic hash (MD5, SHA-1, SHA-256) is a fingerprint of a specific file. If you have the hash of a malicious executable, you can detect that exact file on any system. Simple, fast, automatable.
The problem: changing a hash requires changing one byte of the file. One byte. Attackers routinely repack, recompile, or lightly modify their tools to produce a different hash while maintaining identical functionality. Tools like UPX (a common packer) will produce a different hash on each run with different settings.
In 2024, when the LockBit 3.0 builder leaked, security researchers documented dozens of distinct variants being distributed within weeks — each with a unique hash, each functionally identical. Blocking the original hash did nothing against the variants.
Hashes are still worth collecting. They're useful for confirming attribution when you suspect a known malware family, for rapid initial triage of suspicious files, and for retrohunting across historical telemetry. But never treat hash coverage as security coverage.
# Three ways to hash a suspicious file
sha256sum suspicious_binary.exe
Get-FileHash suspicious_binary.exe -Algorithm SHA256
certutil -hashfile suspicious_binary.exe SHA256

Beyond standard hashes, imphash (import hash) is more resilient — it hashes the import table structure rather than the full binary, surviving basic repackers. And ssdeep generates a fuzzy hash that can identify files that are similar but not identical, useful for detecting slight variants of the same tool.
Level 2: IP Addresses and Domains — Fast-Rotating Infrastructure
A C2 IP address or a phishing domain is slightly more painful to change than a hash — but not by much. Infrastructure costs money and takes time to set up and validate, but attackers operating at any meaningful scale have automated provisioning pipelines. A threat actor can spin up a new VPS, register a new domain, update their implant configuration, and be back online within hours.
The average lifespan of a C2 domain for commodity malware is measured in days. Nation-state actors who value operational security may maintain infrastructure for months, but they do rotate when burned.
The intelligence value of an IP or domain isn't in the indicator itself — it's in the pivoting it enables. If you find a C2 IP, you can look at its historical DNS records, find other domains that resolved to it, find other IPs those domains resolved to, and start mapping an adversary's infrastructure footprint. That footprint is far more durable than any single indicator.
Practical pivot workflow starting from a suspicious IP:
# Step 1 — Passive DNS: which domains have resolved to this IP?
# Query SecurityTrails, DNSDB, or RiskIQ
 
# Step 2 — Shodan: what services are running?
# Certificate SANs often reveal co-hosted infrastructure
shodan host 198.51.100.42
 
# Step 3 — VirusTotal: which files communicated with it?
# Check Relations tab for linked samples and URLs
 
# Step 4 — Cross-reference abuse feeds
# abuse.ch, AbuseIPDB, Feodo Tracker

A single IP becomes the seed of an infrastructure map. That map outlasts the IP.
Level 3: Network and Host Artifacts
At this level, we move from pure infrastructure to behavioral signatures. Network artifacts are patterns in traffic: a specific HTTP User-Agent string, a particular URI structure, a distinctive TLS fingerprint (JARM), a packet timing pattern. Host artifacts are file paths, registry keys, mutex names, named pipes — the traces a tool leaves behind on a system it runs on.
These are harder to change because they're often baked into how a tool is built. A C2 framework's default malleable profile might use a specific User-Agent and URI structure for HTTP beaconing. Changing these requires modifying the framework configuration, recompiling, and retesting — more work than rotating an IP.
Cobalt Strike example. Default Cobalt Strike beacons are detectable via JARM fingerprinting and specific HTTP response patterns. When operators fail to customize the malleable C2 profile, their infrastructure lights up in Shodan queries:
# Find servers presenting Cobalt Strike's default HTTPS fingerprint
http.html_hash:-2014392750
 
# Find servers with the classic default certificate CN
ssl.cert.subject.cn:"Major Cobalt Strike"

The artifact (the specific HTTP response pattern) is more durable than the infrastructure indicator. Host artifacts follow the same logic. Emotet, across its many iterations, consistently created mutex objects with specific naming patterns. Malware families often drop files to predictable paths. These patterns persist across campaigns even when infrastructure changes completely.
The practical implication: when you're analyzing a sample, document every host and network artifact you observe. These become the seeds for YARA rules and Sigma detections that remain valid long after the original IOCs have rotated.
Level 4: Tools — Malware Families and Frameworks
Tools are the software an adversary uses to accomplish their objectives: Cobalt Strike, Metasploit, Mimikatz, custom loaders, specific RATs. Detecting tool usage is significantly more valuable than detecting infrastructure, because an actor's toolset changes slowly. Developing, testing, and operationalizing a new tool is expensive. Rotating an IP is free.
When you identify that an attacker is using a specific tool, you immediately know its full capability set, its typical usage patterns, and the detection opportunities it creates. If you know an actor uses Mimikatz for credential harvesting, you can deploy detections for every known Mimikatz technique across your environment — even before you've seen any activity.
The tool layer is also where malware families live. Knowing that a sample belongs to the Qakbot family tells you its persistence mechanism, its network communication protocol, its lateral movement behavior, and the threat actors known to deploy it. That's significant intelligence derived from a single attribution data point.
The limits of tool-level detection. Nation-state actors with access to large development resources build custom tools specifically to avoid being detected by signatures for known frameworks. Commodity actors operating at scale are less likely to invest in custom tooling — they'll continue using Metasploit or Cobalt Strike because the economics favor it. Detection at the tool layer is most effective against the long tail of commodity actors.
Level 5: TTPs - The Hardest Layer to Change
TTPs are how an adversary accomplishes their objectives, independent of which specific tool they use or which infrastructure they run on. They answer the "how" — not the "what."
Example: "APT41 uses spearphishing with malicious shortcut files (.lnk) to achieve initial access, followed by DLL sideloading for persistence, and uses living-off-the-land binaries for lateral movement." This TTP description remains valid even if APT41 changes every piece of infrastructure, replaces their loader with a new variant, and rotates all their hashes — because the approach is the same.
To change their TTPs, they would need to fundamentally retrain their operators, retool their operational pipeline, and rebuild their tradecraft. That's a multi-month undertaking, not a weekend rotation.
MITRE ATT&CK maps TTPs systematically. When you can attribute a technique (T1566.001: Spearphishing Attachment, T1574.002: DLL Side-Loading), you gain access to all the existing detection logic the community has built around that technique. And you can build detection that persists across campaign rotations.
Tracking a Phishing Campaign Across All Pyramid Levels
Let's make this concrete. A phishing campaign targeting HR teams with fake job application attachments. Here's how it looks at each level:
Pyramid Level	Indicator	Attacker's Cost to Evade
Hash	SHA-256 of malicious PDF	One repack — minutes
IP/Domain	hirefast-portal.com / 203.0.113.55	Register new domain — hours
Network artifact	User-Agent string, URI pattern	Modify C2 profile — hours to days
Tool	IcedID loader identified	Switch to new loader — weeks
TTP	Phishing > IcedID > Cobalt Strike > Kerberoasting	Restructure entire operation — months

The same campaign. Five layers of detection opportunity. Only the top two survive infrastructure rotation.
Prioritizing What You Share and What You Hunt
Share aggressively at the bottom of the pyramid. IOC sharing (hashes, IPs, domains) costs little to produce and provides immediate blocking value for other organizations facing the same threat. MISP was built for this. Push fresh IOCs to sharing communities, ingest what others share, automate the exchange.
Invest analytical effort in the middle layers. Network and host artifacts turn into YARA rules and Sigma detections that protect you regardless of infrastructure rotation. Every analyst hour spent building a solid YARA rule from a real sample pays dividends across future campaigns from the same family.
Hunt at the top of the pyramid. TTP-based threat hunting — looking for behaviors that match known adversary playbooks rather than specific indicators — is the most sustainable and resilient detection strategy. It requires more analytical sophistication, but it's also the hardest for attackers to defeat.
The pyramid doesn't suggest you ignore lower levels. It suggests you understand their limitations and calibrate your investment accordingly.
What's Next
Next week: OSINT 101 — your first recon workflow. We'll build out a practical toolkit using free tools (Shodan, VirusTotal, WHOIS, URLScan), walk through a real pivoting exercise starting from a suspicious domain, and cover what not to do — including the OPSEC mistakes that burn analysts.
 
CTI SERIES — SEASON 1, WEEK 3
OSINT 101 — Your First Recon Workflow
Passive vs active recon, pivoting on IPs/domains/emails with free tools.


Before you can collect intelligence, you need to understand the fundamental distinction that governs everything about how you work: passive recon versus active recon. The difference is not technical — it's legal and operational.
Passive recon means gathering information without directly interacting with the target. You're querying third-party databases, reading cached records, analyzing public information that others have already collected. The target never sees your traffic. There's no attribution risk and, in most jurisdictions, no legal exposure.
Active recon means sending traffic to the target. You're port-scanning their infrastructure, sending HTTP requests to their servers, or probing their systems directly. The target can log your activity. In many contexts, this is illegal without explicit authorization — even if you're investigating a threat actor. Some threat actors have caught researchers doing active recon on their C2 servers and responded by targeting the researchers.
2026 REALITY CHECK
This article covers passive techniques only. If you feel the urge to port-scan a C2 server you've discovered — stop. Query Shodan instead. They've already scanned it and indexed the results without attributing the scan to you.

Your Free Starter Toolkit
Shodan (shodan.io) is a search engine for internet-connected devices. Where Google indexes web pages, Shodan indexes banners — the responses that servers give when probed on specific ports. A single Shodan search can reveal what software is running on a server, what TLS certificates it presents, what HTTP headers it sends, and what port its C2 panel is listening on. Free accounts get limited queries per month; that's usually sufficient for initial investigations.
VirusTotal (virustotal.com) is the most comprehensive public malware analysis platform. Beyond scanning files, it maintains a graph of relationships between files, URLs, IPs, and domains observed in malicious contexts. Search any IP or domain and VirusTotal will show you which malware samples have communicated with it, which other IPs those samples communicated with, and when activity was observed.
WHOIS provides registration data for domains: registrant name, email, registrar, nameservers, registration and expiration dates. Privacy protection has eroded WHOIS utility for attribution — most registrants now hide behind proxy services. But nameservers and registrar data still enable pivoting, and registration dates tell you something about infrastructure age.
MXToolbox (mxtoolbox.com) is useful for checking domain blacklist status, looking up SPF/DKIM/DMARC records, and tracing MX record history. Particularly relevant when analyzing phishing infrastructure.
URLScan.io scans URLs and captures screenshots, DOM content, outbound requests, and network traffic from the page load. If you want to analyze a suspicious URL without visiting it yourself, URLScan will do it from their infrastructure and log everything. It also maintains a searchable history of past scans.
Pivoting Walkthrough — Starting From a Suspicious Domain
Realistic scenario: you're investigating a report of a phishing email. The link points to invoice-secure-portal.net. Here's the workflow.
Step 1: URLScan lookup. Search urlscan.io for the domain. Someone may have already scanned it. If so, you get a screenshot of the page, the outbound requests the page made (did it load JavaScript from another domain? Did it redirect?), and the full network profile. Thirty seconds, full landing page behavior.
Step 2: WHOIS lookup. Key things to note: registration date (registered two days ago is a classic indicator); registrar (certain registrars are disproportionately used for malicious domains); nameservers (some DNS providers are used almost exclusively for malicious infrastructure); registrant email (if visible, historically attackers reused contact emails across many domains — if this email registered ten other domains, you've just mapped the campaign's infrastructure).
Step 3: Shodan lookup. Search Shodan for the IP that resolves to your suspicious domain. What services are running? Is there an HTTP title that reveals a phishing kit or admin panel? What TLS certificates does it present? Pay particular attention to the TLS certificate's Subject Alternative Names (SANs) — additional domains covered by the same certificate. If your suspicious domain shares a certificate with five others, those five are almost certainly part of the same campaign.
Step 4: VirusTotal pivot. Look up the IP on VirusTotal, check Relations. Which domains have resolved to this IP? Which files have communicated with it? This gives you the full cluster of infrastructure associated with a single IP.
Step 5: Passive DNS history. Query SecurityTrails or DNSDB for the domain's full DNS history. What IPs has it resolved to over time? Have those IPs hosted other domains? This historical view is especially valuable because attackers often reuse IP space across campaigns even when they rotate domains.
At the end of this workflow, what started as a single suspicious domain has potentially expanded into a full infrastructure map.
Email Header Analysis and Sender Reputation Checks
Phishing emails contain significant intelligence in their headers. Most email clients hide them by default, but they're trivially accessible: in Gmail, use "Show original"; in Outlook, look under File > Properties.
The `Received:` chain. Email travels through multiple mail servers, each of which prepends a Received: header. Reading the chain from bottom to top traces the actual routing path. The first Received: header added by your mail provider contains the IP address that actually connected to deliver the email. That IP is your first pivot point.
`Return-Path:` vs `From:`. Phishing emails routinely show a legitimate-looking From: address while the Return-Path: reveals the actual sending infrastructure. If From: claims to be your CEO but Return-Path: is bounce@random-server.ru, that's your indicator.
Authentication results. The Authentication-Results: header shows whether SPF, DKIM, and DMARC checks passed. A legitimate email from paypal.com should pass all three. A spoofed email will typically fail SPF or lack DKIM signing entirely.
After you extract the sending IP, run it through MXToolbox's blacklist check, look it up on Shodan, and check its ASN. Legitimate transactional email comes from major ESPs (SendGrid, Mailgun, Amazon SES). Email claiming to be from a major corporation but originating from a residential ISP or a small VPS provider in Eastern Europe is immediately suspicious.
Reading Shodan Banners to Fingerprint Infrastructure
Shodan queries are a skill. The free tier gives you enough to work with if you're targeted in what you search.
Basic IP lookup. Paste an IP into Shodan's search bar. You'll get every port indexed for that host, with the banner captured for each. Look for: HTTP/HTTPS service responses (title, headers, body snippet); TLS certificate details (issuer, subject, SANs); SSH banner (sometimes reveals the distribution and version); custom port services (something listening on 50050 might be a Cobalt Strike team server).
Targeted searches for CTI work:
# Find servers presenting a specific HTTP title
http.title:"Office 365 Login"
 
# Find C2s via default Cobalt Strike certificate
ssl.cert.subject.cn:"Major Cobalt Strike" port:443
 
# Find servers with a specific favicon hash
http.favicon.hash:1278762726
 
# Find servers with a specific JARM fingerprint
ssl.jarm:2ad2ad16d2ad2ad22c2ad2ad2ad2ad2a

Certificate pivoting. When you find a TLS certificate on a suspicious server, copy the certificate's SHA-256 fingerprint and search: ssl.cert.fingerprint:FINGERPRINT. You'll find every other server presenting the same certificate. Attackers sometimes use the same self-signed certificate across their entire infrastructure.
TIP
Some C2 frameworks have distinctive default responses. Cobalt Strike's default HTTPS certificate once contained 'Major Cobalt Strike' as the Common Name. Many operators never customized this. Framework-specific HTTP response headers, error page formats, and port combinations all act as persistent fingerprints — more durable than any domain or IP.

Organizing Findings: A Simple CTI Template
Intelligence you can't retrieve later is intelligence you wasted. Even basic cases should have basic documentation. A minimal template that works for initial investigation notes:
INVESTIGATION: [brief description]
DATE: [when you started]
ANALYST: [you]
SOURCE EVENT: [what triggered this]
 
INDICATORS OBSERVED
-------------------
Type    | Value                       | Source   | First Seen | Notes
--------+-----------------------------+----------+------------+-------
Domain  | invoice-secure-portal.net   | Phishing | 2026-04-15 | Reg'd 2d ago
IP      | 203.0.113.55                | DNS      | 2026-04-15 | OVH VPS, Paris
IP      | 198.51.100.42               | VT pivot | 2026-04-15 | Same cert
 
PIVOT TRAIL
-----------
1. invoice-secure-portal.net -> DNS -> 203.0.113.55
2. 203.0.113.55 -> Shodan -> TLS SANs include payroll-update-docs.com
3. payroll-update-docs.com -> VT -> same IP cluster, linked 3 Qakbot samples
 
ASSESSMENT
----------
Consistent with Qakbot phishing delivery. Confidence: Medium.
 
RECOMMENDED ACTIONS
-------------------
- Block domains and IPs at perimeter
- Search email gateway for other recipients
- Hunt Qakbot execution artifacts on endpoint telemetry

Keep this in a markdown file, a Notion page, or directly in your MISP event. The format matters less than the habit. Every investigation should leave a trail.
What NOT To Do
Don't actively probe infrastructure you're investigating. Port-scanning a suspected C2 server is active recon. Beyond the legal risks, you're giving the attacker a signal that their infrastructure has been discovered. Some threat actors have honeypots on their own C2 servers specifically to detect when defenders are actively investigating.
Don't accidentally attribute in public. If you're posting about an investigation in progress, be careful about sharing enough context that someone can identify the victim organization or the specific campaign before you've completed coordination. Attribution mistakes are permanent.
Don't create accounts on criminal forums using work infrastructure. If you're going to monitor XSS, RAMP, or Telegram channels, you need to do it from infrastructure that cannot be linked to you or your organization. Your work laptop on the corporate VPN is the wrong choice.
Don't click suspicious links to investigate them. That's what URLScan and Any.run are for. Let their infrastructure visit the URL and report back.
Don't trust WHOIS data for attribution. Threat actors routinely provide false registrant information. WHOIS tells you something about infrastructure configuration and registration timing, but not about the identity of the person who registered it.
What's Next
Next week: navigating MITRE ATT&CK like an analyst. We'll move beyond treating ATT&CK as a checkbox matrix and use it the way experienced analysts do — as a thinking tool for understanding adversary behavior, mapping coverage gaps, and communicating about threats in a common language. We'll read a real threat actor profile together and map a public incident report to the matrix.
 
CTI SERIES — SEASON 1, WEEK 4
Navigating MITRE ATT&CK Like an Analyst
Map TTPs to real behavior — ATT&CK as a thinking tool, not a checklist.


MITRE ATT&CK has become the common language of offensive and defensive security. Threat intelligence reports cite ATT&CK technique IDs. Detection engineering teams build coverage matrices. Red teams structure their operations around the framework. Vendors put ATT&CK heat maps on their marketing materials.
And yet, a surprising number of people who use ATT&CK daily have never sat down and thought about what it actually is, what it's for, and what it can't do. That misunderstanding leads to the most common ATT&CK failure mode: treating it as a checklist instead of a thinking tool.
A checklist implies completeness. If you check every box, you're done. ATT&CK is not that. It's a living knowledge base of documented adversary behavior — representative, not exhaustive. Checking every ATT&CK technique would take years, would cost millions, and still wouldn't guarantee you'd detect a novel adversary technique that MITRE hasn't documented yet.
What ATT&CK actually gives you: a structured vocabulary for describing adversary behavior, a collection of existing knowledge about what attackers do at each stage of an intrusion, and a framework for identifying gaps in your detection and prevention capabilities. Used correctly, it makes you a better analyst and helps your organization spend its defensive investment where it matters most.
The Matrix — Tactics, Techniques, and Sub-Techniques
The ATT&CK Enterprise matrix is organized into 14 columns, each representing a tactic: the adversary's immediate goal at that stage of the operation. Tactics are the "why" — the objective being pursued.
Tactic	What the Adversary is Trying to Do
Reconnaissance	Gather information before the attack
Resource Development	Establish infrastructure and capabilities
Initial Access	Gain entry to the target environment
Execution	Run malicious code
Persistence	Maintain access across reboots and countermeasures
Privilege Escalation	Gain higher-level permissions
Defense Evasion	Avoid detection and security controls
Credential Access	Steal credentials
Discovery	Learn about the environment
Lateral Movement	Move through the network
Collection	Gather data of interest
Command and Control	Communicate with compromised systems
Exfiltration	Steal data out of the environment
Impact	Disrupt, degrade, or destroy systems and data

Under each tactic are techniques: the specific method used to achieve the tactic's goal. T1059 (Command and Scripting Interpreter) is a technique under Execution. Techniques often have sub-techniques that describe specific implementations: T1059.001 is PowerShell, T1059.003 is Windows Command Shell, T1059.006 is Python.
The numbering matters: knowing that a report mentions T1566.001 tells you immediately that the attacker used phishing with a malicious attachment (not a link, which would be T1566.002). This precision is the value of the common vocabulary.
Reading a Real Threat Actor Profile on ATT&CK Navigator
Go to attack.mitre.gov and search for APT41. You'll find MITRE's profile of this Chinese threat actor group, attributed to the intrusion sets known as Double Dragon, Barium, and Bronze Atlas, among others.
The profile lists techniques attributed to APT41 with citations to the source reports. This is the right way to read an ATT&CK threat actor profile: not as a complete picture of everything the group is capable of, but as a documented record of what has been publicly observed and attributed.
ATT&CK Navigator (attack.mitre.gov/navigator) lets you load threat actor profiles and visualize them as heat maps. To load APT41's techniques:
1. Open ATT&CK Navigator
2. Click 'Open Existing Layer' > 'From URL'
3. Enter the ATT&CK API URL for APT41 (available from the group's page)
 
# Or create a layer manually:
1. Open a new layer
2. Click 'Search & Multiselect'
3. Search 'APT41' > 'techniques used by this group'
4. Color the selected techniques

What you get is a visual map of APT41's documented capability set across the matrix. The immediately useful observation: where are the clusters? APT41 shows heavy activity in Execution, Defense Evasion, and Credential Access — which tells you where to focus detection investment if you're defending against this specific actor.
Now the analyst question: what's not colored? The techniques APT41 hasn't been documented using might mean they don't use them — or might mean they use them and haven't been caught. That uncertainty is part of why ATT&CK is not a checklist.
Mapping a Malware Sample to ATT&CK Techniques
Concrete exercise. You've analyzed a Qakbot sample (or read a public sandbox report). You observed the following behaviors: delivered via phishing email with malicious ZIP containing a Windows Script File; used wscript.exe to execute; injected into explorer.exe and wermgr.exe; established persistence via scheduled task; resolved C2 via DGA; communicated over encrypted HTTPS; used Mimikatz modules for credential harvesting; moved laterally via SMB with harvested credentials.
Behavior	Technique	ATT&CK ID
Phishing email with ZIP	Spearphishing Attachment	T1566.001
Windows Script File execution	Command and Scripting Interpreter: VBScript	T1059.005
Process injection	Process Injection	T1055
Scheduled task persistence	Scheduled Task/Job: Scheduled Task	T1053.005
DGA for C2	Dynamic Resolution: Domain Generation Algorithms	T1568.002
Encrypted C2 over HTTPS	Encrypted Channel: Asymmetric Cryptography	T1573.002
Mimikatz credential harvesting	OS Credential Dumping	T1003
SMB lateral movement	SMB/Windows Admin Shares	T1021.002

Now this sample isn't just a collection of IOCs — it's a documented behavioral profile that persists across every Qakbot campaign regardless of infrastructure or hash rotation. You can build Sigma detections for each of these techniques and know that they'll be relevant for the foreseeable future.
Using ATT&CK for Gap Analysis — What Are You Not Detecting?
This is where ATT&CK delivers its most practical defensive value.
The exercise: take the ATT&CK techniques used by your most relevant threat actors, then honestly evaluate which ones you have detection coverage for and which ones you don't.
Your threat intelligence analysis tells you that the threat actors most relevant to your sector commonly use: T1566.001 (Spearphishing Attachment) for initial access; T1059.001 (PowerShell) for execution; T1053.005 (Scheduled Task) for persistence; T1003.001 (LSASS Memory) for credential access; T1021.002 (SMB/Windows Admin Shares) for lateral movement.
Your detection engineering team evaluates each: do you have a Sigma rule, a SIEM alert, or an EDR policy that would detect this technique? The result is a gap map. Techniques where you have no detection coverage are the places an attacker can operate unobserved.
This is infinitely more useful than trying to build coverage for all 500+ ATT&CK techniques. It focuses investment on the techniques that your actual adversaries actually use, in the actual sequence they use them, rather than spreading effort across the entire matrix.
TIP
ATT&CK also maps mitigations. Each technique page lists recommended mitigations: M1042 (Disable or Remove Feature or Capability), M1038 (Execution Prevention), etc. The mitigation view tells you what preventive controls reduce exposure to specific techniques — useful for architecture reviews and security control selection.

ATT&CK vs MITRE D3FEND — Offense Meets Defense
ATT&CK is an offensive knowledge base — it documents what attackers do. D3FEND (d3fend.mitre.org) is its defensive counterpart — it documents what defenders can do to counter those techniques.
D3FEND maps defensive techniques (like User Session Init Config Analysis or File Content Rules) to the offensive techniques they counter. If you know an adversary uses T1059.001 (PowerShell), D3FEND can tell you which defensive techniques specifically address that — process spawn analysis, script execution monitoring — and reference specific tools and implementation approaches.
The integration between ATT&CK and D3FEND creates a complete analytical loop: ATT&CK tells you what the adversary does; D3FEND tells you what to deploy to counter it; detection engineering implements the specific detections; coverage mapping validates the gap closure.
In practice, D3FEND is still less mature than ATT&CK and its mappings aren't always as precise as practitioners would like. But for the techniques it covers well, it provides useful guidance for defenders trying to translate threat intelligence into concrete security controls.
Practical Exercise: Map a Public Incident Report to the Matrix
The best way to develop ATT&CK mapping skills is to practice on real data. CISA advisories are excellent source material — they're public, technically detailed, and include enough behavioral description to practice mapping.
Your task: read a recent CISA advisory and for every behavior described, identify: which tactic category does it fall under; which technique (and sub-technique if applicable) best describes it; are there behaviors that don't map cleanly to an existing ATT&CK technique?
That last question matters. ATT&CK is not exhaustive. If you encounter a behavior that doesn't fit neatly into any documented technique, it might be a gap in the framework itself, or a novel technique that hasn't been documented yet. Note it.
Documenting your mapping: use ATT&CK Navigator to create a layer showing the techniques from the report. Color-code by confidence: you observed it directly (high confidence) versus inferred from context (medium confidence). Export the layer as a JSON file.
# Example workflow:
# 1. Open navigator.attack.mitre.gov
# 2. Create a new Enterprise layer
# 3. For each behavior in the advisory:
#    - Find the technique in the matrix
#    - Click to select it
#    - Add a comment with the specific evidence
#    - Assign a score (1=low confidence, 3=high confidence)
# 4. Export as JSON for your team's documentation

This exercise, done regularly on fresh intelligence reporting, builds the pattern recognition that makes experienced CTI analysts able to look at a new report and immediately understand where it fits in the adversary behavior landscape.
What's Next
That completes Season 1 — Foundations of CTI. You now have the conceptual framework: the intelligence lifecycle, the Pyramid of Pain, a working OSINT methodology, and the ability to navigate ATT&CK analytically. Season 2 opens next week with building your OSINT infrastructure from scratch — VMs, VPN layering, sock puppet accounts, and analyst OPSEC. If you're going to operate in adversarial environments, you need to do it without burning yourself.

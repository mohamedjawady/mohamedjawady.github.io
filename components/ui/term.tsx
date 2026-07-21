"use client"

import React from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface TermDefinition {
	[key: string]: string
}

const glossary: TermDefinition = {
	"cti": "Cyber Threat Intelligence - analyzed, contextualized, and confidence-scored knowledge about adversaries that improves defensive decisions. The output of structured analytical processes applied to security data.",
	"passive-dns": "Passive DNS is a database of historical DNS resolution records collected from network traffic. Unlike active DNS queries, it doesn't involve querying nameservers directly and thus doesn't alert anyone that you're looking.",
	"iot": "Indicators of Compromise - observable artifacts that suggest a security compromise has occurred, such as file hashes, IP addresses, domains, or network patterns.",
	"ttp": "Tactics, Techniques, and Procedures - how attackers behave and operate. TTPs describe methods rather than specific tools, making them more persistent and harder to change than infrastructure.",
	"ttp-lower": "Tactics, Techniques, and Procedures - the methods, practices, and processes that attackers use. They describe behavior patterns rather than specific indicators.",
	"c2": "Command and Control - infrastructure used by attackers to communicate with and control compromised systems.",
	"malware": "Malicious software designed to harm, exploit, or gain unauthorized access to a computer or network.",
	"threat-actor": "An individual, group, or organization that conducts cyber attacks or other malicious activities.",
	"threat-hunting": "Proactive search through networks and systems to identify and isolate advanced threats that automated systems may have missed.",
	"infrastructure-pivoting": "The process of using one discovered indicator to find related infrastructure, such as using an IP address to find all domains that resolved to it.",
	"imphash": "Import hash - a hash of the import address table (IAT) in a Windows executable. More resilient than file hashing because it survives minor code modifications.",
	"jarm": "A method for creating fingerprints of TLS servers based on how they respond to probing. Used to identify malicious C2 servers.",
	"malleable-c2": "A feature in Cobalt Strike that allows operators to customize how their C2 beacons communicate, including User-Agent strings, URI patterns, and encryption methods.",
	"siem": "Security Information and Event Management - a system that collects, processes, and analyzes security logs and events from across an organization.",
	"mitre-att-ck": "A knowledge base of adversary tactics and techniques based on real-world observations. Used as a framework for understanding and categorizing threat behavior.",
	"t1027": "MITRE ATT&CK T1027: Obfuscated Files or Information - a defense evasion technique covering packing, encoding, or otherwise obscuring file content to evade detection (e.g. T1027.002: Software Packing).",
	"t1583": "MITRE ATT&CK T1583: Acquire Infrastructure - a resource development technique covering the purchase, lease, or rental of servers, domains, and other infrastructure used to support operations.",
	"t1071": "MITRE ATT&CK T1071: Application Layer Protocol - a command-and-control technique covering the use of standard protocols (HTTP, DNS, etc.) to blend C2 traffic with legitimate network activity (e.g. T1071.001: Web Protocols).",
	"t1547": "MITRE ATT&CK T1547: Boot or Logon Autostart Execution - a persistence technique covering registry keys, startup folders, and other mechanisms that automatically execute code when a system boots or a user logs on.",
	"t1003": "MITRE ATT&CK T1003: OS Credential Dumping - a credential access technique covering extraction of credentials from OS memory or storage (e.g. T1003.001: LSASS Memory, as used by tools like Mimikatz).",
	"t1566": "MITRE ATT&CK T1566: Phishing - an initial access technique covering delivery of malicious attachments or links to a victim, typically via email (e.g. T1566.001: Spearphishing Attachment).",
	"t1574": "MITRE ATT&CK T1574: Hijack Execution Flow - a persistence and defense evasion technique covering redirection of execution to attacker-controlled code, such as DLL sideloading (e.g. T1574.002: DLL Side-Loading).",
	"t1218": "MITRE ATT&CK T1218: System Binary Proxy Execution - a defense evasion technique covering the use of trusted, signed system binaries to execute attacker-controlled code and evade application controls.",
	"ssdeep": "A fuzzy hashing algorithm that can identify files that are similar but not identical. Useful for detecting slight variants of malware.",
	"upx": "Ultimate Packer for eXecutables - a tool that compresses executable files, changing their hash while maintaining functionality.",
	"vulnerability": "A weakness in software, hardware, or configuration that can be exploited by attackers to gain unauthorized access or cause harm.",
	"exploit": "Code or technique that takes advantage of a vulnerability to gain unauthorized access or execute arbitrary code.",
	"payload": "The code or data that is delivered to a target system, typically after successful exploitation.",
	"reconnaissance": "The gathering of information about a target system, network, or organization prior to launching an attack.",
	"lateral-movement": "The process of moving through a network from one compromised system to another to reach a final target or gain more access.",
	"persistence": "The ability of malware or an attacker to maintain access to a compromised system even after reboot or other disruption.",
	"privilege-escalation": "Gaining higher-level access or permissions on a system, typically from user-level to administrator or system-level.",
	"defense-evasion": "Techniques used by attackers to avoid detection by security controls, such as disabling antivirus or using obfuscation.",
	"exfiltration": "The unauthorized transfer of data from a compromised system to an external location controlled by the attacker.",
	"yara": "A tool and language for writing pattern-matching rules to identify malware and other suspicious content based on file signatures and behavioral patterns.",
	"sigma": "An open-source rule format for log detection that allows security teams to write detection rules once and apply them across multiple SIEM platforms.",
	"rat": "Remote Access Trojan - malware that allows an attacker to control a compromised system remotely, often used for persistence and lateral movement.",
	"mutex": "A synchronization object (mutual exclusion lock) that malware often uses to ensure only one instance runs at a time. Mutex names can become behavioral indicators.",
	"edr": "Endpoint Detection and Response - software that monitors endpoint systems for suspicious activity, collects telemetry, and can respond to threats automatically.",
	"soc": "Security Operations Center - the team responsible for monitoring systems, detecting security incidents, and responding to threats.",
	"tat": "Time to Acknowledge - the time it takes for a human to recognize and respond to an alert or security event.",
	"dwell-time": "The amount of time an attacker remains undetected within a compromised environment, typically measured in days.",
	"retrohunt": "The process of searching historical telemetry and logs for indicators or behavioral patterns to identify past compromises or activity.",
	"indicator-of-compromise": "Observable artifacts that suggest a security compromise has occurred, such as file hashes, IP addresses, domains, or network patterns.",
	"shodan": "A search engine for internet-connected devices that reveals services, software versions, and vulnerabilities by scanning IP addresses and ports.",
	"virustotal": "An online service that analyzes suspicious files and URLs against multiple antivirus engines and security tools to identify malware.",
	"shodan-cert-san": "Subject Alternative Names in TLS certificates - additional domains/IPs the certificate is valid for, often revealing co-hosted infrastructure.",
	"abuse-feeds": "Threat feeds that track known-malicious IP addresses, domains, and infrastructure reported by abuse.ch, AbuseIPDB, and similar services.",
	"cobalt-strike": "A commercial adversary simulation and post-exploitation toolkit frequently used by threat actors for command and control and lateral movement.",
	"emotet": "A sophisticated banking trojan that evolved into a botnet and loader service, used by multiple threat actors for initial access and payload delivery.",
	"lockbit": "A ransomware operation and malware family known for fast encryption speeds and aggressive extortion tactics.",
	"qakbot": "A long-lived banking trojan family used primarily for credential theft and lateral movement, often deployed by affiliate groups.",
	"metasploit": "An open-source penetration testing framework providing exploit code, payloads, and post-exploitation tools commonly used by both attackers and defenders.",
	"mimikatz": "A widely-used post-exploitation tool for extracting credentials, tokens, and secrets from Windows systems and memory.",
	"apt41": "A Chinese-linked threat actor known for operations spanning espionage and financial cybercrime, targeting diverse sectors globally.",
	"fin7": "A financially-motivated threat actor group known for targeting retail and hospitality organizations for payment card theft and fraud.",
	"scattered-spider": "A threat actor group known for leveraging social engineering, compromised credentials, and living-off-the-land techniques for initial access.",
	"living-off-the-land": "Techniques that use legitimate built-in system tools (PowerShell, WMI, cmd.exe) instead of custom malware to avoid detection.",
	"dnsdb": "A passive DNS database that maintains historical DNS resolution records, useful for infrastructure investigation and pivoting.",
	"securitytrails": "A cybersecurity intelligence platform providing passive DNS, WHOIS history, and infrastructure reconnaissance data.",
	"riskiq": "A threat intelligence and digital risk management platform offering passive DNS, WHOIS, and certificate data for infrastructure analysis.",
	"zeromq": "ZeroMQ (also written as 0MQ or ZMQ) is a high-performance asynchronous messaging library used for building distributed and concurrent applications. It provides socket-like abstractions for message passing without requiring a dedicated message broker.",
	"salt-minion": "The Salt Minion is the agent daemon that runs on managed nodes. It connects outbound to the Salt Master over ZeroMQ, receives job broadcasts, executes them locally, and returns results.",
	"salt-master": "The Salt Master is the central orchestration server. It manages authentication, distributes configuration via Pillar, broadcasts execution jobs, and maintains the Event Bus.",
	"event-bus": "The Salt Event Bus is a real-time, ZeroMQ-backed publish-subscribe system running on the Master. Every action in Salt (jobs, minion auth, state runs) fires a tagged event that can be monitored and reacted to programmatically.",
	"reactor-system": "The Salt Reactor is a subsystem that watches the Event Bus for specific event tags and triggers pre-defined responses (states, runners, or commands) automatically, enabling autonomous infrastructure remediation.",
	"salt-pillar": "Salt Pillar is a secure, Master-side data store for distributing sensitive or targeted configuration (passwords, API keys, per-environment values) to specific Minions. Each Minion only receives the Pillar data explicitly assigned to it.",
	"salt-grains": "Grains are static data about a Minion host, collected at startup. They include OS type, kernel version, IP addresses, CPU architecture, and can be extended with custom values. Grains are used for targeting and conditional logic in states.",
	"salt-state": "A Salt State (.sls file) is a declarative YAML document that describes the desired configuration of a system. Salt ensures the system matches the declared state, only making changes when necessary (idempotency).",
	"salt-runner": "Salt Runners are modules that execute on the Master itself rather than on Minions. They are used for orchestration tasks, cloud provisioning, job management, and event monitoring.",
	"salt-returner": "Salt Returners allow Minion job results to be sent directly to external datastores (Redis, MySQL, Elasticsearch, Splunk) instead of or in addition to being returned to the Master.",
	"salt-syndic": "The Salt Syndic is a proxy master that sits between Minions and a higher-level Master, enabling tiered architectures for managing very large or geographically distributed fleets.",
	"salt-proxy-minion": "A Salt Proxy Minion is a special Minion process that runs on behalf of devices that cannot run the Salt agent natively (network switches, routers, IoT devices), translating Salt commands into device-specific APIs.",
	"salt-beacon": "Salt Beacons are Minion-side monitors that watch for specific local events (file changes, service crashes, load spikes) and fire events onto the Master Event Bus, enabling real-time reactive automation.",
	"salt-ssh": "Salt SSH (salt-ssh) is an agentless transport mode that executes Salt commands over standard SSH connections. It bundles Salt modules into a thin payload, copies it to the target, runs it, and returns the output without requiring a persistent Minion daemon.",
	"infrastructure-as-code": "Infrastructure as Code (IaC) is the practice of managing and provisioning infrastructure through machine-readable definition files rather than manual processes, enabling version control, repeatability, and auditability.",
	"idempotency": "Idempotency is the property where applying an operation multiple times produces the same result as applying it once. In configuration management, an idempotent state only makes changes when the system deviates from the desired configuration.",
	"highstate": "Highstate (state.highstate or state.apply) is the Salt command that applies all states defined in the top.sls file to the targeted Minions, bringing them into compliance with their declared configuration.",
	"jinja": "Jinja is a Python-based templating engine used in Salt state files to insert dynamic values, conditionals, and loops into YAML configuration. It enables states to adapt based on Grains, Pillar data, or other runtime context.",
	"ach": "Analysis of Competing Hypotheses - a structured analytic technique developed by Richards Heuer. The analyst lists all plausible hypotheses, scores each piece of evidence against every hypothesis, and selects the hypothesis with the least inconsistent evidence rather than the most consistent.",
	"structured-analytic-techniques": "Structured Analytic Techniques (SATs) - documented methods that externalize an analyst's reasoning so it can be examined, challenged, and reproduced. They reduce the impact of cognitive bias by forcing decomposition and visualization of the problem.",
	"analytic-judgment": "An analytic judgment is the actual product of intelligence analysis: an assessment paired with an explicit confidence level, the key evidence behind it, the assumptions it rests on, and the gaps that remain.",
	"confirmation-bias": "The tendency to seek, weight, and remember evidence that supports an existing hypothesis while discounting evidence that contradicts it. One of the most damaging biases in intelligence analysis.",
	"anchoring-bias": "The tendency to rely too heavily on the first piece of information received. In analysis, an early hypothesis becomes the anchor that all later evidence is interpreted around.",
	"mirror-imaging": "Assuming that an adversary thinks, values, and decides the way you do. Adversaries operate under different constraints, incentives, and doctrine, so the most logical path from your perspective is often not theirs.",
	"mental-model": "An experience-based internal representation of how some part of the world works. Mental models let analysts process information quickly, but unexamined models quietly filter what the analyst is able to perceive.",
	"all-source": "Analysis that fuses every available collection discipline and data type on a subject rather than specializing in one source. CTI is all-source by necessity, combining malware analysis, infrastructure data, victimology, and open sources.",
	"kill-chain": "A model that breaks an intrusion into sequential phases an adversary must complete to succeed. Interrupting any phase breaks the chain. Popularized for network defense by Lockheed Martin's Intrusion Kill Chain paper (2011).",
	"diamond-model": "The Diamond Model of Intrusion Analysis structures every intrusion event around four vertices: adversary, capability, infrastructure, and victim. It states its axioms explicitly and supports pivoting and clustering across events.",
	"false-flag": "An operation deliberately crafted to be attributed to someone else, for example by planting another group's tooling artifacts, language strings, or infrastructure patterns in an intrusion.",
	"osint": "Open-Source Intelligence - intelligence collection from publicly available sources such as websites, public records, social media, and published reporting.",
	"humint": "Human Intelligence - intelligence collected through interpersonal contact, the classic domain of case officers and informants.",
	"sigint": "Signals Intelligence - intelligence derived from intercepted signals and communications.",
	"diagnosticity": "The degree to which a piece of evidence helps distinguish between competing hypotheses. Evidence consistent with every hypothesis has zero diagnosticity no matter how compelling it feels.",
	"behavioral-analytic": "A detection encoded around adversary behavior rather than specific artifacts: the chain of actions an intrusion performs, expressed so it fires on new campaigns with entirely new infrastructure. Durable where indicators expire, and it carries context in the alert itself.",
	"indicator-lifecycle": "The cycle an indicator moves through: revealed (discovered or reported), vetted through retro-hunting, deployed to detection and mitigation, fired against real activity, and analyzed, which reveals new indicators that restart the cycle.",
	"key-indicator": "An indicator that remains consistent across multiple intrusions, uniquely distinguishes one activity cluster from others, separates malicious from benign activity, and aligns to a specific phase of adversary action. The small subset of indicators worth long-term investment.",
	"alert-fatigue": "The operational failure state where alert volume exceeds what analysts can triage, so genuinely critical alerts receive the same shallow treatment as noise. Usually caused by deploying unvetted indicators as a primary detection layer.",
	"detection-engineering": "The discipline of turning knowledge about adversary behavior into tested, maintained detection logic: Sigma rules, SIEM correlations, EDR policies, and the pipelines that validate they still fire.",
	"anomaly-detection": "An environmental detection approach that models normal activity statistically and alerts on deviation. It can catch novel activity nobody encoded, but its alerts arrive without context: the model knows something is unusual, not what it is or what to do.",
	"collection-management-framework": "A Collection Management Framework (CMF) maps every data source to what it can observe, which phases of adversary activity it covers, what follow-on collection it enables, how long it retains data, and who owns access. It exists to answer one question: which intelligence requirements can this organization actually satisfy?",
	"intelligence-requirement": "A single, simply worded question about the threat or the operational environment that fills a knowledge gap and supports a specific decision. Intelligence requirements drive the entire intelligence process; work without one is a hobby.",
	"priority-intelligence-requirement": "An intelligence requirement designated critical to a mission or decision, usually time-bound and tied to a specific event such as an acquisition, a product launch, or an active incident. PIRs change as the organization's immediate concerns change.",
	"collection-gap": "A question the organization cannot answer because the data that would answer it is not collected, not retained long enough, or not accessible. Documented gaps with the requirement that exposed them attached are the strongest funding argument a CTI team has.",
	"data-source": "In MITRE ATT&CK terms, a category of information a sensor or log can provide (such as Process Creation or Network Connection Creation), broken into data components. Data sources give teams a shared vocabulary for what a given telemetry source can actually see at technique level.",
	"courses-of-action": "The set of responses a defender can take against an adversary action, organized as a matrix of kill chain phases against seven categorical actions: discover, detect, deny, disrupt, degrade, deceive, and destroy. The defensive mirror of the kill chain, from the Lockheed Martin Intelligence-Driven CND paper.",
	"intelligence-gain-loss": "The intelligence-community concept that every action against an adversary has both a gain (what you learn) and a loss (what you forgo observing, plus what the action reveals to the adversary). Blocking an indicator mitigates a threat but signals to the adversary that the resource is burned, an intelligence loss the reflex overlooks.",
	"sinkhole": "Redirecting adversary infrastructure, usually a domain, to a defender-controlled server so that malware beacons reach an observer instead of the real controller. A sinkhole can measure a botnet, identify victims, or send benign commands, all while the malware believes it reached its operator.",
	"honeypot": "A deliberately exposed system or service designed to be attacked, so defenders can observe adversary behavior in a controlled environment. In the courses-of-action sense, redirecting C2 to a honeypot is a deception action rather than a denial.",
	"passive-defense": "Defensive actions that do not interfere with the adversary and carry no strategic cost: historically searching for whether an indicator appeared before (discover) and alerting if it appears again (detect). Passive actions compose freely and should be applied to nearly every indicator.",
	"threat-model": "A documented, prioritized picture of which threats plausibly apply to a specific organization, built from its crown jewels outward to the adversaries those assets attract. A threat model is the filter that lets a team ignore the threats that are not theirs.",
	"crown-jewels": "The assets an organization most needs to protect because their loss would cause the greatest harm: proprietary data or models, sensitive customer data, and the availability of business-critical systems. In threat modeling, the crown jewels are the starting point, not the adversary.",
	"target-centric-analysis": "An approach to intelligence analysis developed by Robert M. Clark in which all participants contribute to and draw from a shared, continuously updated conceptual model of a target, rather than passing products down a linear pipeline. It reduces stovepiping and makes intelligence gaps visible.",
	"systems-analysis": "The deliberate construction of the mental models, templates, and prototypes used to reason about a system. A full systems analysis examines an entity's structure, technologies, people, and tasks, plus the internal and external forces that change it. Threat modeling is the threat-focused subset of a systems analysis.",
	"cia-triad": "Confidentiality, Integrity, and Availability: the three properties of information a defender protects and an adversary attacks. Mapping a crown jewel to the CIA property most at risk clarifies which adversaries would target it and why.",
	"tip": "Threat Intelligence Platform - a system for storing, correlating, and sharing indicators and the analysis behind them. A TIP does not produce intelligence; it operationalizes intelligence that was already produced, making it searchable and queryable by other tools via API.",
	"misp-event": "In MISP, the container object everything is built around. A report read, a sample analyzed, or an incident tracked each becomes one event, holding a group of attributes plus whatever tags and galaxy clusters classify it.",
	"misp-attribute": "In MISP, an individual piece of data attached to an event: a hash, domain, IP, URL, or explanatory text. Each attribute carries a category (how it was used, e.g. payload delivery) and a type (what it is, e.g. sha256), and identical attributes across events are automatically highlighted for correlation.",
	"sighting": "A MISP mechanism for recording that an attribute was actually observed, true positive or false positive, each time an analyst encounters it. Sightings let an indicator's reliability change over time based on real usage instead of staying frozen at whatever confidence it had on ingest.",
	"misp-galaxy": "A MISP classification layer above tags: a cluster of related values, such as named threat actors or malware families, that can itself hold attributes and notes. Galaxies are built for tracking actors, tools, and TTPs across events, where a plain tag only labels a single event.",
	"tlp": "Traffic Light Protocol - a four-color classification (RED, AMBER, GREEN, WHITE/CLEAR) that tells the recipient of shared intelligence how far they are allowed to redistribute it. TLP travels with the data itself, commonly as a tag in a TIP, so the sharing restriction survives every hop.",
	"defanging": "The practice of altering a malicious URL, domain, or IP address, for example by bracketing the dot, so that it cannot be accidentally clicked or auto-linked when pasted into notes, tickets, or chat. A basic hygiene habit for anyone handling indicators by hand.",
	"security-event": "NIST SP 800-61's term for any observable occurrence in a system or network: a login, a DNS query, a file write. Most collected data is events, with no claim of maliciousness attached.",
	"security-alert": "An event flagged as potentially unwanted or unauthorized, whether by a signature match or an anomaly rule. An alert is a claim worth an analyst's attention, not yet a confirmed compromise.",
	"security-incident": "NIST SP 800-61's term for a confirmed violation, or imminent threat of violation, of security policy that affects the confidentiality, integrity, or availability of business data. An alert becomes an incident once an analyst verifies it as a true positive.",
	"high-fidelity-alert": "An alert whose underlying logic is trusted enough that little or no additional triage is needed before acting on it, typically because it matches a well-sourced indicator of known-bad activity rather than a statistical deviation from normal.",
	"veris": "Vocabulary for Event Recording and Incident Sharing - a classification schema built around four elements (actor, action, asset, attribute) that together describe who did what to which asset and how it was affected. Maintained by Verizon and used as the collection format behind the annual Data Breach Investigations Report.",
	"nciss": "National Cyber Incident Scoring System - CISA's weighted scoring model for incident severity, built on NIST SP 800-61's categories (functional impact, information impact, recoverability, and others) and collapsed into a single 0-100 score mapped to a priority level from baseline to emergency.",
	"incident-management-system": "The system where a SOC tracks and works confirmed incidents as cases, distinct from generic help-desk ticketing by security-specific features: indicator storage integrated with a threat intelligence platform, case templates that encode playbooks, and tagging aligned to frameworks like the kill chain. TheHive is a widely used open-source example.",
	"case-playbook": "A pre-built template applied to a new case that generates the set of tasks an analyst must complete before the case can close, ensuring every incident of a given type (phishing, malware, and so on) gets the same thorough investigation regardless of who is assigned it.",
	"observable": "In an incident management system, a piece of data attached to a case during investigation: an IP, hash, domain, or username. An observable can be flagged as an indicator of compromise and pushed to a threat intelligence platform, feeding future detection.",
	"cvss": "Common Vulnerability Scoring System - an industry-standard formula that scores a vulnerability's theoretical severity from 0 to 10 based on properties like attack complexity and impact. The Base score, the version almost everyone actually uses, deliberately excludes whether the vulnerability is being exploited or how exposed a given organization actually is.",
	"epss": "Exploit Prediction Scoring System - a FIRST-maintained machine learning model that estimates the probability a given CVE will be exploited in the wild within the next 30 days, published daily as a 0-1 score with a percentile ranking, trained on real-world exploitation telemetry rather than theoretical severity.",
	"kev-catalog": "CISA's Known Exploited Vulnerabilities catalog, a list of CVEs CISA has confirmed are being actively exploited in the wild, with federal remediation deadlines attached. Unlike CVSS or EPSS, KEV membership is not a score or a prediction, it is a documented fact.",
	"kerberos": "The default authentication protocol in Active Directory, built on time-limited, cryptographically signed tickets rather than repeated password checks. A client proves its identity once to a Key Distribution Center and then presents tickets, not credentials, to every service it accesses afterward.",
	"ntlm": "NT LAN Manager, Windows' legacy challenge-response authentication protocol. Still active as a fallback whenever Kerberos cannot be used (no line of sight to a domain controller, access by IP address, workgroup machines), and the mechanism behind pass-the-hash and NTLM relay attacks because the hash itself is sufficient to authenticate.",
	"kdc": "Key Distribution Center - the Active Directory service, running on every domain controller, that issues and validates Kerberos tickets. It has two roles bundled together: the Authentication Service (AS) that issues TGTs, and the Ticket Granting Service (TGS) that issues service tickets against a valid TGT.",
	"kerberoasting": "An attack that abuses Kerberos's own design: any authenticated domain user can request a service ticket for any account with a registered Service Principal Name, and that ticket is encrypted with a key derived from the service account's password. The attacker takes the ticket offline and cracks it without ever touching the target account or triggering a lockout.",
	"evtx": "The binary XML file format Windows uses to store event logs, one file per channel (Security.evtx, System.evtx, and a large tree of Applications and Services Logs channels), typically under C:\\\\Windows\\\\System32\\\\winevt\\\\Logs. What subcategories actually get written into a channel is controlled by the Advanced Audit Policy, not just the channel's existence.",
	"ntlm-relay": "An attack where a captured NTLM authentication attempt is forwarded live to a second target instead of cracked, letting the attacker authenticate as the coerced identity against whatever the relay target accepts NTLM for. Coercion techniques like PetitPotam force a machine account to authenticate somewhere the attacker controls, and relaying that to AD CS web enrollment can turn a single coerced machine into a domain-compromising certificate.",
	"sysmon": "System Monitor, a free Sysinternals driver and service that logs far richer endpoint telemetry than native Windows auditing: full process command lines, network connections, named pipe activity, DNS queries, and raw registry changes, written to its own Microsoft-Windows-Sysmon/Operational channel and configured through an XML rule file instead of Group Policy audit settings.",
	"auditd": "The Linux Audit Framework, the closest Linux equivalent to Windows' Security event log: kernel-level hooks that intercept syscalls and file access, configured with auditctl rules (file watches or syscall rules), logged to /var/log/audit/audit.log, and queried with ausearch and aureport rather than Event Viewer.",
	"syslog-facility": "A numeric code in the syslog protocol (RFC 5424) identifying which subsystem generated a log message, such as auth/authpriv for login and privilege events, cron for scheduled jobs, or daemon for background services. Facility plus severity is what a log router like rsyslog or syslog-ng uses to decide where a message ends up, the rough Linux equivalent of a Windows event channel.",
}

export interface TermProps {
	concept: string
	children: React.ReactNode
}

export function Term({ concept, children }: TermProps) {
	const definition = glossary[concept.toLowerCase()]

	if (!definition) {
		// If no definition found, just return the children without tooltip
		console.warn(`No definition found for concept: ${concept}`)
		return <span className="font-semibold text-primary">{children}</span>
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span className="font-semibold text-primary underline decoration-dotted decoration-1 underline-offset-2 cursor-help hover:text-primary/80 transition-colors">
					{children}
				</span>
			</TooltipTrigger>
			<TooltipContent className="max-w-xs text-sm">
				{definition}
			</TooltipContent>
		</Tooltip>
	)
}

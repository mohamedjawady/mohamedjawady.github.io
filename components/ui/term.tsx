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

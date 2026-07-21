---
title: "SEC450 Blue Team Reference: SOC Analyst Interview Prep"
description: "Condensed reference notes covering the Cyber Kill Chain and MITRE ATT&CK, endpoint defense tooling, Windows/Linux logging architecture, the Windows event IDs that actually matter, network and email authentication events, Active Directory and Kerberos, executable formats, and structured alert triage and analytical technique."
source: "SANS SEC450: Blue Team Fundamentals"
type: "course"
difficulty: "intermediate"
category: "Blue Team"
author: "Mohamed Habib Jaouadi"
publishedDate: "2026-07-21"
url: "https://www.sans.org/cyber-security-courses/blue-team-fundamentals-security-operations-analysis/"
status: "completed"
tags: ["soc", "blue-team", "mitre-attack", "kill-chain", "windows-event-ids", "kerberos", "ntlm", "logging", "alert-triage", "sec450"]
visible: true
---

Condensed study notes covering a full SOC analyst reference sweep: the Cyber Kill Chain and MITRE ATT&CK, endpoint defense tooling, Windows and Linux logging architecture, the Windows event IDs worth memorizing, network/email authentication events, Active Directory and Kerberos internals, executable and script formats, and the structured analytical techniques used for alert triage.

## Key Topics Covered

- **Frameworks**: Cyber Kill Chain (7 stages) mapped to MITRE ATT&CK's 14 enterprise tactics
- **Endpoint tooling**: AV vs EDR vs HIDS, what each watches and where each is blind
- **Logging architecture**: audit policy vs event log, auditd vs syslog, system vs service logs
- **Windows event IDs**: authentication, Kerberos, persistence, account changes, process execution
- **Active Directory**: Kerberos ticket flow, Kerberoasting, Kerberos vs NTLM, NTLM attack surface
- **Analytical technique**: alert triage prioritization, ACH, structured brainstorming, cognitive bias, OPSEC

## Why This Matters

This is the fast-recall layer underneath a SOC analyst's day-to-day judgment: knowing which event ID answers which question, why an alert deserves urgency, and how to structure an investigation instead of guessing. Built for interview prep and kept as a standing reference.

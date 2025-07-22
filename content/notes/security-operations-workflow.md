---
title: "Security Operations Center (SOC) Workflow and Incident Management"
description: "Comprehensive overview of SOC operations, from event collection to incident management, including alert handling and IMS integration"
source: "NIST SP800-61, TheHive, SIEM Best Practices, SOC Operations Guide"
type: "course"
difficulty: "intermediate"
category: "Cybersecurity"
author: "Mohamed Habib Jaouadi"
publishedDate: "2025-07-22"
url: "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf"
status: "completed"
tags: ["SOC", "incident-management", "alerts", "SIEM", "security-operations", "IMS", "threat-intelligence", "workflow", "nist"]
visible: true
---

# Security Operations Center (SOC) Workflow and Incident Management

This note synthesizes the complete SOC operational workflow, from initial event collection through incident management, providing a comprehensive understanding of how security operations centers handle threats and incidents.

## Event, Alert, and Incident Definitions (NIST SP800-61)

### Core Terminology
- **Events**: Anything that happens - any observable occurrence in a system or network
- **Alerts**: An event of interest that may be unwanted or unauthorized
- **Incidents**: A violation or imminent threat of violation of computer security policies, acceptable use policies, or standard security practices (only if the alert is a true positive)

## SOC Data Flow Architecture

### Event Collection Strategy
The foundation of effective SOC operations begins with strategic event collection:

#### Collection Philosophy
- **Budget Constraints**: We cannot collect every log from every device due to financial limitations
- **Quality over Quantity**: Focus on events with security ramifications
- **Strategic Approach**: Target event IDs that highlight potential attacks

#### Collection Strategy Spectrum
1. **Input-Driven**: Collect everything since you don't know what you need
2. **Output-Driven**: Collect only what you specifically want to minimize costs
3. **Hybrid Approach** (Recommended): Collect what you think you need while continuously removing noise

### Event Log Flow Pipeline
```
Endpoint/Network Events → Logs → SIEM (Analysis + Enrichment + Rules) → Alerts → Triage/Incident Management
```

#### SIEM Processing Functions
- **Analysis**: Pattern recognition and correlation
- **Enrichment**: Integration with threat intelligence
- **Analytic Rules**: Automated detection logic

## Alert Management and Processing

### Alert Collection Options
Alerts can originate from multiple sources and require strategic routing:

#### Alert Routing Strategies
1. **Pre-SIEM Filtering**: Triage alerts before they reach the SIEM
   - **Advantage**: Custom-built triage tools
   - **Disadvantage**: Limited data scope for context

2. **SIEM-Centric Processing**: Send all alerts to SIEM first
   - **Sub-options**:
     - SIEM built-in triage system
     - External Incident Management System (IMS) with alert dashboard
   - **Advantage**: Full data enrichment capabilities

### Alert Classification Types

#### Signature-Based Alerts (Blacklist)
**Characteristics:**
- Known evil indicators (domains, C2 traffic patterns, exploit kit URLs)
- Higher likelihood of finding true threats
- Require continuous tuning to reduce false positives

**Advantages:**
- More likely to identify actual malicious activity
- Should always be investigated

**Challenges:**
- Poorly sourced threat intelligence causes false positives
- Overactive alerts lead to analyst fatigue

#### Anomaly-Based Alerts
**Characteristics:**
- Identify deviations from normal behavior
- Examples: out-of-hours logins, large file uploads, new device logins
- Anomaly ≠ malicious (but all malicious activity creates anomalies)

**Requirements:**
- Deep understanding of normal network behavior
- Well-defined baseline environment
- May require pre-triage before ticket generation

**Processing:**
- Enrich with additional context
- Correlate with other activities
- Produce higher fidelity alerts

## SOC Technology Stack

### Required SOC Solutions
1. **Alert and Incident Tracking**: Monitor all potential security incidents
2. **Threat Intelligence Collection**: Organize and access threat data
3. **Log Management**: Collect and search network/endpoint logs
4. **Correlation and Alerting**: Automated threat detection
5. **Investigation Automation**: Streamline response actions
6. **Knowledge Repository**: Centralized documentation and procedures

### Core SOC Tools

#### Incident Management System (IMS) / Security Incident Response Platform (SIRP)
**Commercial Security-Oriented Options:**
- Resilient
- Archer
- ServiceNow
- CyberCPR

**Traditional Ticketing Solutions:**
- BMC Remedy
- RT (Request Tracker)
- Redmine

**Open Source Security-Oriented:**
- TheHive
- RTIR (Request Tracker for Incident Response)
- FIR (Fast Incident Response)

#### Additional SOC Technologies
- **Threat Intelligence Platform (TIP)**: Indicator collection and intelligence management
- **SIEM**: Log collection, indexing, search, correlation, and alerting
- **SOAR**: Security Orchestration, Automation and Response
- **Knowledge Database**: Documentation, playbooks, and use cases

## Incident Management System Features

### Essential IMS Capabilities
- **Rich Documentation**: Rich text, inline pictures/tables
- **Indicator Integration**: Database integration for observables
- **Bulk Operations**: Mass close/open/edit actions
- **Hierarchical Structure**: Parent-child ticket relationships
- **API Access**: Automation and integration capabilities

### Advanced IMS Features
- **Tagging/Attack Cycle Alignment**: Map incidents to attack frameworks
- **Keyboard Navigation**: Efficient analyst workflow
- **Built-in Knowledge Base**: Integrated wiki/documentation
- **Workflow Customization**: Adaptable to organizational needs
- **Activity Wall**: Real-time collaboration features

## Alert Investigation Process

### Analyst Response Workflow
When an alert fires, analysts must:

1. **Initial Assessment**
   - Verify the alert validity
   - Consider the rule type (signature vs. anomaly)
   - Determine alert fidelity level

2. **Context Gathering**
   - Enrich with additional information
   - Correlate with other logs and activities
   - Consider the broader context of the activity

3. **Determination and Action**
   - Make a malicious/benign determination
   - If malicious: create incident and escalate
   - Document findings and actions taken

### TheHive Integration Example

#### Automatic Case Creation Workflow
1. **Event Collection**: SIEM processes events and generates alerts
2. **Alert Transfer**: Alerts automatically sent to TheHive for triage
3. **Case Population**: 
   - New case created for accepted alerts
   - Relevant fields parsed (IPs, domains, usernames, hostnames)
   - Additional context pulled from available sources
   - Tasks created from designated case templates (playbooks)

#### TheHive Case Management
- **Case Organization**: Incidents organized and assigned by case type
- **Template-Driven**: Cases follow pre-made case templates (playbooks)
- **Task Management**: Cases contain specific tasks to be completed
- **Work Documentation**: Tasks have associated work logs
- **Observable Management**: Cases can have observables (IOCs) assigned
- **Automated Enrichment**: Observables enriched by Cortex analyzers

## Key Success Factors

### Collection Strategy
- Balance between comprehensive coverage and cost management
- Continuous noise reduction and rule tuning
- Focus on high-value security events

### Alert Management
- Proper classification of signature vs. anomaly alerts
- Adequate enrichment and correlation capabilities
- Efficient triage processes to prevent analyst fatigue

### Tool Selection
- Test IMS solutions thoroughly before selection
- Ensure analyst satisfaction with primary tools
- Balance commercial vs. open-source solutions based on needs
- Prioritize automation and API access for scalability

### Process Optimization
- Implement standardized naming conventions
- Develop comprehensive playbooks and templates
- Maintain updated knowledge bases and documentation
- Regular review and optimization of workflows

## Recommended Reading and Resources

- [Sguil Network Security Monitoring](https://bammv.github.io/sguil/index.html)
- Cisco Security Capabilities Benchmark Study
- Risk-based alerting methodologies
- Exploit kit analysis techniques
- NIST SP800-61: Computer Security Incident Handling Guide

---

*This comprehensive workflow ensures systematic handling of security events from initial collection through incident resolution, providing a structured approach to SOC operations.*

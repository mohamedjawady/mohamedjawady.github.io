---
title: "Red Team Tooling Reference: Mimikatz, PowerUp, Rubeus, and the AD Attack Path"
description: "What the standard red team toolkit actually does, tool by tool: credential dumping (Mimikatz), AD enumeration and privesc (PowerUp, PowerView, BloodHound), Kerberos abuse (Rubeus), remote execution (Impacket, PsExec), and C2 frameworks, each with what it produces on the wire or on disk for detection."
source: "Public tool documentation, MITRE ATT&CK, industry practice"
type: "article"
difficulty: "intermediate"
category: "Red Team"
author: "Mohamed Habib Jaouadi"
publishedDate: "2026-07-21"
status: "completed"
tags: ["red-team", "mimikatz", "powerup", "bloodhound", "rubeus", "impacket", "active-directory", "detection-engineering"]
visible: true
---

A working reference for the tools that show up in nearly every Active Directory compromise: what each one actually does, what stage of the attack path it belongs to, and what it leaves behind that a blue team can detect. Organized by function rather than alphabetically, since the order these tools get reached for mirrors the attack path itself.

## Key Topics Covered

- **Credential access**: Mimikatz and LaZagne, what they extract and from where
- **AD enumeration and attack-path mapping**: PowerView, BloodHound/SharpHound, PowerUp
- **Kerberos abuse**: Rubeus for ticket requesting, forging, and Kerberoasting
- **Remote execution and lateral movement**: the Impacket suite, PsExec
- **C2 frameworks**: where Cobalt Strike, Sliver, and Metasploit fit relative to the tools above

## Why This Matters

Every one of these tools has a detection signature, and most blue team detections trace back to knowing exactly what a specific tool does under the hood: which process it touches, which protocol it abuses, which artifact it leaves. Recognizing the tool from its behavior is most of the job.

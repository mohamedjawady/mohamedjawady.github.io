"use client"

import type { ReactNode } from "react"
import { Shield, Network, FileSearch, KeyRound, Terminal, ListChecks, AlertTriangle, Radar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

function Section({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-2 flex items-start gap-3">
        {icon}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function RefTable({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="text-left font-semibold px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border/60 align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ConceptCard({ title, description, keyPoints, note }: { title: string; description?: string; keyPoints: string[]; note?: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
        <ul className="space-y-1.5">
          {keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {note && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs"><strong>Note:</strong> {note}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function Sec450BlueTeamReferenceNotes() {
  return (
    <div className="space-y-10">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          A fast-recall reference sweep: kill chain and ATT&amp;CK, endpoint tooling, logging architecture,
          the Windows event IDs that actually matter, AD/Kerberos, executable formats, and structured triage technique.
        </AlertDescription>
      </Alert>

      <Section icon={<Radar className="h-6 w-6 mt-1" />} title="Cyber Kill Chain & MITRE ATT&CK" subtitle="The narrative arc versus the technique catalog">
        <p className="text-sm text-muted-foreground">
          The 7-step Cyber Kill Chain (Lockheed Martin) is the narrative arc of an intrusion. MITRE ATT&amp;CK's 14 enterprise tactics
          are the detailed technique catalog underneath it. They overlap heavily.
        </p>
        <RefTable
          head={["#", "Stage", "What the attacker does", "Real example", "ATT&CK tactic(s)"]}
          rows={[
            ["1", "Reconnaissance", "Gather info before attacking (passive OSINT or active scanning)", "LinkedIn scraping, Shodan RDP scan, WHOIS", "Reconnaissance"],
            ["2", "Weaponization", "Build the payload: exploit + backdoor combined, no target contact yet", "Stealer packed into a signed fake installer; malicious DOCM with VBA macro", "Resource Development"],
            ["3", "Delivery", "Transmit the weapon to the target", "Phishing .lnk attachment, watering hole, USB drop", "Initial Access"],
            ["4", "Exploitation", "Trigger the vulnerability or user action to execute code", "User opens DOCM, CVE-2021-40444, browser zero-day", "Execution"],
            ["5", "Installation", "Establish persistence so access survives reboots", "Scheduled task (4698), Run key (4657), new service (7045)", "Persistence, Privilege Escalation"],
            ["6", "Command & Control", "Set up a comms channel back to attacker infrastructure", "HTTPS beacon behind a CDN, DNS tunneling, malleable C2 profile", "Command and Control"],
            ["7", "Actions on Objectives", "Do what they came to do", "Ransomware, exfil via cloud storage, lateral movement, credential dump", "Credential Access, Lateral Movement, Collection, Exfiltration, Impact"],
          ]}
        />
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Defender use:</strong> the Kill Chain shows where in the attack you are and where you can still stop it. Earlier is cheaper.
            If you're at stage 6 (C2), the adversary is already inside; focus on containment, not prevention.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader><CardTitle className="text-base">MITRE ATT&CK: 14 Enterprise Tactics</CardTitle></CardHeader>
          <CardContent>
            <RefTable
              head={["#", "Tactic", "Covers", "Example techniques"]}
              rows={[
                ["1", "Reconnaissance", "Info gathering before attack", "T1595 Active Scanning, T1589 Gather Victim Identity Info"],
                ["2", "Resource Development", "Build/acquire attack infrastructure", "T1583 Acquire Infrastructure, T1587 Develop Capabilities"],
                ["3", "Initial Access", "First foothold", "T1566 Phishing, T1190 Exploit Public-Facing App, T1078 Valid Accounts"],
                ["4", "Execution", "Run attacker code", "T1059 Command & Scripting Interpreter, T1204 User Execution"],
                ["5", "Persistence", "Survive reboots/logoffs", "T1053 Scheduled Task, T1543 Create Service, T1547 Registry Run Keys"],
                ["6", "Privilege Escalation", "Gain higher permissions", "T1548 Bypass UAC, T1134 Token Impersonation, T1068 Exploit for PrivEsc"],
                ["7", "Defense Evasion", "Avoid detection", "T1027 Obfuscated Files, T1055 Process Injection, T1562 Impair Defenses"],
                ["8", "Credential Access", "Steal credentials", "T1003 OS Credential Dumping, T1558 Kerberoasting, T1110 Brute Force"],
                ["9", "Discovery", "Learn the environment", "T1018 Remote System Discovery, T1087 Account Discovery"],
                ["10", "Lateral Movement", "Move to other systems", "T1021 Remote Services, T1550 Pass the Hash/Ticket"],
                ["11", "Collection", "Gather target data", "T1005 Data from Local System, T1113 Screenshot"],
                ["12", "Command & Control", "Maintain comms with implant", "T1071 App Layer Protocol, T1573 Encrypted Channel"],
                ["13", "Exfiltration", "Move data out", "T1048 Exfil over Alt Protocol, T1567 Exfil to Cloud"],
                ["14", "Impact", "Achieve end goal", "T1486 Data Encrypted for Impact, T1485 Data Destruction"],
              ]}
            />
          </CardContent>
        </Card>
        <ConceptCard
          title="SOC use of ATT&CK"
          keyPoints={[
            "Map alerts to technique IDs to understand what tactic the attacker is in",
            "Prioritize: T1078 (Valid Accounts) + T1021 (Remote Services) together suggests lateral movement in progress",
            "Use ATT&CK Navigator to visualize coverage gaps between tooling and technique",
          ]}
        />
      </Section>

      <Section icon={<Shield className="h-6 w-6 mt-1" />} title="Endpoint Defense Tools" subtitle="AV vs EDR vs HIDS">
        <RefTable
          head={["", "AV", "EDR", "HIDS"]}
          rows={[
            ["Watches", "Files on disk", "Process behavior, memory, network, files", "Files, logins, config changes"],
            ["Detection", "Signatures + heuristics", "Behavioral analysis + telemetry", "Rule-based / file integrity"],
            ["Response", "Quarantine / delete", "Kill process, isolate host, rollback", "Alert only"],
            ["Visibility", "Pre-execution (mostly)", "Pre + post-execution", "Post-execution"],
            ["Examples", "Windows Defender, ClamAV", "SentinelOne, CrowdStrike, HarfangLab", "OSSEC, Wazuh, Tripwire"],
            ["Blind spots", "Fileless malware, LOLBins", "High false-positive rate, needs tuning", "No active response, noisy"],
          ]}
        />
        <Alert><AlertDescription className="text-sm">EDR replaces AV and supplements HIDS in a modern SOC.</AlertDescription></Alert>
      </Section>

      <Section icon={<FileSearch className="h-6 w-6 mt-1" />} title="Logging Architecture" subtitle="Audit policy vs logging, Windows vs Linux">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Audit Monitor vs Logging System"
            keyPoints={[
              "Windows: Audit Policy (GPO) decides what gets recorded. Without it, events are never written.",
              "Windows: Event Log stores what audit policy captures (Security, System, Application, Sysmon channels).",
              "Linux: auditd is kernel-level, captures syscalls. Rules in /etc/audit/audit.rules, output to /var/log/audit/audit.log.",
              "Linux: syslog/rsyslog/journald is the application-level daemon (/var/log/syslog, /var/log/messages, journalctl).",
            ]}
            note="auditd = Sysmon for Linux. Both require explicit rule configuration; a default install captures almost nothing."
          />
          <ConceptCard
            title="System Logs vs Service Logs"
            keyPoints={[
              "Windows System log: driver failures, kernel, hardware, service start/stop. Key events: 7045 (service installed), 7034 (service crashed).",
              "Windows Application/Service log: app-specific events (IIS, SQL); AD events land in the Security channel.",
              "Linux system log: kernel messages, boot, hardware (/var/log/syslog, dmesg, journalctl -k).",
              "Linux service log: daemon output (/var/log/auth.log, /var/log/apache2/, journalctl -u sshd).",
            ]}
            note="System logs = the OS talking about itself (catches persistence). Service logs = apps talking about what they're doing (catches exploitation)."
          />
        </div>
      </Section>

      <Section icon={<Terminal className="h-6 w-6 mt-1" />} title="Windows Event IDs" subtitle="Authentication, Kerberos, execution, persistence, account changes">
        <Card>
          <CardHeader><CardTitle className="text-base">Authentication & Logon</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <RefTable
              head={["Event ID", "Description", "Security relevance"]}
              rows={[
                ["4624", "Successful logon", "See logon types below"],
                ["4625", "Failed logon", "Brute force detection"],
                ["4648", "Logon with explicit credentials (RunAs)", "Lateral movement, credential reuse"],
              ]}
            />
            <RefTable
              head={["Logon type", "Name", "Meaning", "SOC note"]}
              rows={[
                ["2", "Interactive", "Local keyboard logon", "Normal"],
                ["3", "Network", "SMB, file share, net use", "From unexpected source = lateral movement"],
                ["4", "Batch", "Scheduled task", ""],
                ["5", "Service", "Service account logon", ""],
                ["8", "NetworkCleartext", "Cleartext creds over network", "Always suspicious"],
                ["9", "NewCredentials", "RunAs /netonly, new remote creds", "Correlate with 4648"],
                ["10", "RemoteInteractive", "RDP", ""],
                ["11", "CachedInteractive", "Offline domain logon (cached creds)", ""],
              ]}
            />
            <Alert><AlertDescription className="text-xs">Repeated 4625 followed by a 4624 = brute force success. Type 3 NTLM from an unusual source = pass-the-hash.</AlertDescription></Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">EVTX & Log Sources</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <code>.evtx</code> is Windows' binary XML event log format, stored under <code>C:\Windows\System32\winevt\Logs\</code>.
              Query with Event Viewer, <code>wevtutil</code>, or PowerShell <code>Get-WinEvent</code>.
            </p>
            <RefTable
              head={["Channel", "Key events", "Purpose"]}
              rows={[
                ["Security", "4624/4625/4688/4698/4728/4769...", "Auth, process, AD changes: primary SOC source"],
                ["System", "7045/7034/6416", "Services, drivers, hardware"],
                ["Application", "App-specific", "SQL, IIS errors"],
                ["Microsoft-Windows-Sysmon/Operational", "1 (process), 3 (network), 7 (image load), 11 (file create)", "Deep endpoint telemetry, installed separately"],
                ["Microsoft-Windows-PowerShell/Operational", "4104 (script block)", "PowerShell execution content"],
                ["Microsoft-Windows-NTLM/Operational", "8001/8002/8003", "NTLM audit/block events"],
                ["Microsoft-Windows-TaskScheduler/Operational", "106 (task registered), 200 (task executed)", "Scheduled task activity"],
                ["Microsoft-Windows-WinRM/Operational", "6 (WSMan session)", "PowerShell remoting / lateral movement"],
              ]}
            />
            <p className="text-xs text-muted-foreground">Log forwarding: WEF (Windows Event Forwarding) → WEC (Windows Event Collector) → SIEM. Agents: Winlogbeat, NXLog, Splunk UF.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Kerberos Events</CardTitle></CardHeader>
          <CardContent>
            <RefTable
              head={["Event ID", "Description", "Security relevance"]}
              rows={[
                ["4768", "Kerberos TGT requested (AS-REQ/AS-REP)", "AS-REP roasting: 4768 with pre-auth disabled"],
                ["4769", "Kerberos service ticket requested (TGS-REQ)", "Kerberoasting: EncryptionType 0x17 (RC4) instead of 0x12 (AES256)"],
                ["4770", "Kerberos service ticket renewed", "Generally low-value; watch for anomalous renewal patterns"],
              ]}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Process & Script Execution</CardTitle></CardHeader>
            <CardContent>
              <RefTable
                head={["Event ID", "Description", "Relevance"]}
                rows={[
                  ["4688", "Process creation (+parent, cmdline if enabled)", "LOLBins, malicious child processes"],
                  ["4104", "PowerShell script block logging", "Full script content even if obfuscated"],
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Persistence Mechanisms</CardTitle></CardHeader>
            <CardContent>
              <RefTable
                head={["Event ID", "Description", "Relevance"]}
                rows={[
                  ["7045", "New service installed", "Dropper, persistence"],
                  ["7034", "Service crashed unexpectedly", "Potential exploitation"],
                  ["4698", "Scheduled task created", "Persistence"],
                  ["4657", "Registry value modified", "Run-key persistence, requires SACL"],
                  ["4663", "Object accessed (file/registry)", "Requires SACL, very noisy if not scoped"],
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Account & Group Changes</CardTitle></CardHeader>
            <CardContent>
              <RefTable
                head={["Event ID", "Description", "Relevance"]}
                rows={[
                  ["4720", "User account created", "Backdoor account creation"],
                  ["4732", "Member added to local group", "Local Administrators addition"],
                  ["4728", "Member added to global group", "Domain Admins / privileged group addition"],
                ]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Device & AV Events</CardTitle></CardHeader>
            <CardContent>
              <RefTable
                head={["Event ID", "Description", "Relevance"]}
                rows={[
                  ["6416", "New external device recognized (PnP)", "USB attacks, data exfil via removable media"],
                  ["1006", "Windows Defender quarantine action", "Malware caught"],
                  ["1116", "Windows Defender detected malware", "Detection event, before action"],
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section icon={<Network className="h-6 w-6 mt-1" />} title="Network Events & Firewall" subtitle="WFP, Emerging Threats, DNS sinkholes, email authentication">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Windows Firewall Events (WFP)"
            keyPoints={[
              "5154: WFP allowed an application to listen on a port",
              "5156: WFP permitted a connection",
              "5157: WFP blocked a connection (not enabled by default)",
            ]}
            note="Extremely noisy with no payload visibility. Use as enrichment for a known-suspicious IP, not as a primary detection source. Rely on EDR network telemetry or NGFW logs instead."
          />
          <ConceptCard
            title="ET — Emerging Threats Alert Prefix"
            description="The most widely used open-source IDS/IPS ruleset, maintained by Proofpoint, running on Suricata or Snort."
            keyPoints={[
              "ET MALWARE / ET TROJAN: known C2 or malware family traffic, high priority",
              "ET SCAN: reconnaissance / port scanning",
              "ET EXPLOIT: exploitation attempt against a vulnerability",
              "ET POLICY / ET INFO: context-dependent, often false-positive heavy",
              "Rule SIDs in 2000000-2999999 = Emerging Threats open rules",
            ]}
            note="Signature-based, like AV for network traffic. Catches known-bad patterns but misses zero-days and novel C2 profiles."
          />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">DNS Sinkholes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">A DNS server returns a controlled/false IP for malicious domains, redirecting malware traffic to a dead end instead of the real C2. The malware still tries to beacon; the attacker loses control while defenders gain visibility.</p>
            <RefTable
              head={["Type", "How deployed", "Purpose"]}
              rows={[
                ["External sinkhole", "Vendor/CERT takes over a C2 domain, resolves it to their IP", "Disrupt active campaigns at scale"],
                ["Internal sinkhole", "Org deploys internal DNS sinkhole fed by threat intel", "Detect infected hosts before they reach external C2"],
              ]}
            />
            <Alert><AlertDescription className="text-xs"><strong>Key insight:</strong> a sinkholed host is still compromised. Sinkholing stops the attacker's control but doesn't remove the malware; always treat sinkhole hits as active incidents.</AlertDescription></Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Email Authentication — SPF vs DKIM vs DMARC</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <RefTable
              head={["", "SPF", "DKIM", "DMARC"]}
              rows={[
                ["Protects against", "Envelope-sender IP spoofing", "Message tampering in transit", "From: header spoofing"],
                ["Mechanism", "IP allowlist in DNS", "Cryptographic signature on email", "Policy + alignment of SPF/DKIM to From:"],
                ["Breaks on forwarding?", "Yes (forwarder IP not in SPF)", "No (signature survives)", "Depends, DKIM pass alone can save it"],
                ["Reports?", "No", "No", "Yes (rua= aggregate, ruf= forensic)"],
              ]}
            />
            <p className="text-sm text-muted-foreground">
              DMARC passes when SPF passes and aligns with <code>From:</code>, <strong>or</strong> DKIM passes and its <code>d=</code> aligns with <code>From:</code>. Either is enough.
              A spoofed <code>From:</code> with a different SPF-authorized envelope domain fails alignment even though SPF itself passed, and <code>p=reject</code> blocks it.
            </p>
            <Alert><AlertDescription className="text-xs"><strong>Red flags:</strong> <code>p=none</code> is monitor-only with no enforcement. A DKIM fail means the email was tampered with in transit. <code>~all</code> (softfail) is a weak SPF policy many orgs still deliver on.</AlertDescription></Alert>
          </CardContent>
        </Card>
      </Section>

      <Section icon={<KeyRound className="h-6 w-6 mt-1" />} title="Active Directory & Authentication" subtitle="Kerberos internals, Kerberoasting, NTLM">
        <RefTable
          head={["Protocol", "Port", "Purpose", "SOC relevance"]}
          rows={[
            ["Kerberos", "88/tcp+udp", "Domain authentication, ticket-based", "Kerberoasting (4769), Golden Ticket, AS-REP roasting (4768)"],
            ["LDAP", "389/tcp, 636 (LDAPS)", "Directory queries", "Enumeration (BloodHound), DCSync (replication calls)"],
            ["SMB", "445/tcp", "File sharing, lateral movement", "PsExec, WMI, pass-the-hash"],
            ["RPC", "135/tcp + dynamic", "Remote procedure calls, WMI", "Lateral movement, scheduled tasks"],
            ["DNS", "53/udp+tcp", "Name resolution", "Tunneling, C2 over DNS"],
            ["RDP", "3389/tcp", "Remote desktop", "Lateral movement (4624 Type 10)"],
            ["WinRM", "5985/5986", "PowerShell remoting", "Lateral movement, post-exploitation"],
            ["NTLM", "over SMB/HTTP/etc", "Legacy challenge-response auth", "Pass-the-hash, relay, NTLMv1 downgrade"],
          ]}
        />

        <Card>
          <CardHeader><CardTitle className="text-base">How Kerberos Works</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <pre className="bg-muted/50 p-3 rounded text-xs overflow-x-auto">{`1. AS-REQ:  Client -> KDC     "I want a TGT" (pre-auth: timestamp encrypted with user's hash)
2. AS-REP:  KDC -> Client     TGT encrypted with krbtgt hash + session key encrypted with user's hash
3. TGS-REQ: Client -> KDC     "I want access to SPN X" (presents TGT)
4. TGS-REP: KDC -> Client     Service ticket encrypted with SERVICE ACCOUNT hash
5. AP-REQ:  Client -> Service Presents service ticket
6. AP-REP:  Service -> Client Mutual auth confirmation`}</pre>
            <p className="text-sm text-muted-foreground">TGT lifetime defaults to 10 hours, service tickets to 600 minutes. KDC = domain controller. krbtgt is the special account whose hash secures every TGT. The client never needs the service account's password; the KDC brokers trust.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Kerberoasting"
            keyPoints={[
              "Any authenticated domain user can request a TGS for any SPN-registered service; no special privilege needed",
              "The ticket is encrypted with the service account's NTLM hash, not the requester's",
              "Detection (4769): EncryptionType 0x17 (RC4-HMAC) instead of 0x12 (AES256); bulk requests from one account in a short window",
            ]}
            note="Mitigation: AES-only service accounts, 25+ character passwords, Managed Service Accounts (MSA/gMSA)."
          />
          <ConceptCard
            title="Kerberos vs NTLM"
            keyPoints={[
              "Kerberos: ticket-based (third-party broker), requires the DC for every new ticket, supports mutual auth and delegation",
              "NTLM: challenge-response (direct), can auth against local SAM without a DC, no mutual auth, no delegation",
              "NTLM in a fully domain-joined environment is suspicious: appears when accessing by IP, an unregistered SPN, or a Kerberos fallback",
            ]}
          />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">NTLM Vulnerabilities to Watch</CardTitle></CardHeader>
          <CardContent>
            <RefTable
              head={["Attack", "How", "Detection"]}
              rows={[
                ["Pass-the-Hash", "Capture NTLM hash from LSASS, replay it without the plaintext", "4624 Type 3 with NTLM auth from an unexpected source"],
                ["NTLM Relay", "Intercept an NTLM auth attempt (LLMNR/NBT-NS poisoning or MITM), relay it live", "Monitor LLMNR/NBT-NS traffic; enforce SMB signing"],
                ["NTLMv1 downgrade", "Force the weaker NTLMv1, crackable with rainbow tables in hours", "Alert on NTLMv1 usage; enforce NTLMv2 via GPO"],
                ["Responder / LLMNR poisoning", "Fake LLMNR/NBT-NS responses capture hashes on a bad name lookup", "Disable LLMNR/NBT-NS via GPO"],
                ["NTLM brute force", "Repeated 4625 against an NTLM-exposed service", "Account lockout policy, 4625 threshold alerting"],
                ["NTLM audit/block (8003)", "8001 = server blocked incoming, 8002 = client blocked, 8003 = audit event", "Baseline usage before enforcing a full block"],
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">SCCM / MECM</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Enterprise endpoint management: software deployment, patching, OS imaging, inventory. Site server (SQL backend), CcmExec agent on every endpoint, and a Network Access Account (NAA) domain credential stored in policy for non-domain-joined content access.</p>
            <RefTable
              head={["Abuse", "How", "Detection"]}
              rows={[
                ["NAA credential theft", "Readable without admin rights via SharpSCCM / Get-WmiObject", "Monitor WMI queries against SCCM namespaces from non-SCCM processes"],
                ["Lateral movement", "Push scripts/apps to any managed device at once", "Alert on deployments outside change windows"],
                ["Discovery", "Full inventory (IPs, OS, software, local admins) in the SCCM DB", "Monitor unexpected SQL queries against the SCCM DB"],
                ["Persistence", "Deploy malicious app/script fleet-wide", "7045 on endpoints; application deployment events"],
              ]}
            />
            <Alert><AlertDescription className="text-xs">If an attacker reaches SCCM admin, assume all managed endpoints are compromised. Treat the SCCM server as Tier 0, same as a DC.</AlertDescription></Alert>
          </CardContent>
        </Card>
      </Section>

      <Section icon={<Terminal className="h-6 w-6 mt-1" />} title="Executable & Script Formats" subtitle="What runs, how, and what to watch">
        <RefTable
          head={["Format", "Runs via", "Relevance"]}
          rows={[
            ["EXE", "Direct execution", "Most common malware delivery; check imports, sections, entropy"],
            ["DLL", "rundll32.exe or a loader process", "Injection, hijacking, side-loading; never runs standalone"],
            ["SYS (driver)", "Loaded into kernel via SCM or exploit", "Highest risk: rootkits, BYOVD. Watch Sysmon event 6 (driver load)"],
            ["PS1", "powershell.exe", "Post-exploitation staple; caught by event 4104 script block logging"],
            ["VBS", "wscript.exe / cscript.exe", "Legacy phishing/macro chains; child of WINWORD.EXE = macro execution"],
            ["LNK", "Shell / cmd.exe", "Can hide a full PowerShell one-liner in the Target field"],
            ["DOCM/XLSM", "WINWORD.EXE, VBA macros", "Office spawning cmd.exe/powershell.exe as a child (4688) is a key indicator"],
            ["ELF", "Linux loader", "Most Linux malware: miners, backdoors, botnets. Check with file, strings, readelf -a"],
            ["DEB / RPM", "dpkg / rpm, pre/postinst scripts run as root", "Supply chain risk; verify signatures before installing untrusted packages"],
          ]}
        />
        <Alert>
          <AlertDescription className="text-xs space-y-1">
            <div><strong>Execution chain shortcuts:</strong></div>
            <div>WINWORD.EXE → cmd.exe/powershell.exe = macro execution</div>
            <div>powershell.exe with -enc/-EncodedCommand = obfuscated payload</div>
            <div>rundll32.exe with an unusual DLL path/export = DLL-based execution</div>
            <div>Unsigned kernel driver load (Sysmon 6) = possible BYOVD</div>
          </AlertDescription>
        </Alert>
      </Section>

      <Section icon={<ListChecks className="h-6 w-6 mt-1" />} title="Alert Triage & Analytical Technique" subtitle="Prioritization, structured analysis, and OPSEC">
        <ConceptCard
          title="Alert Triage — Think Like an ER Doctor"
          description="You cannot investigate everything at once. Treat the most dangerous patient first, not the loudest."
          keyPoints={[
            "1. High kill-chain stage (C2 or Actions on Objectives = already inside, contain immediately)",
            "2. High-value target involved (DC, finance systems, SCCM, privileged accounts)",
            "3. Targeted/APT-style indicators (customized tools, internally-informed phishing)",
            "4. Uniqueness/long-tail (an alert firing once a month beats one firing 10,000 times a day)",
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Alert Validation Confidence"
            keyPoints={[
              "Near-definite: known malware hash, confirmed malicious domain, high-fidelity C2 protocol",
              "High: new/unknown reputation domain, unsigned unexpected binary",
              "Moderate: IP match alone (shared hosting/CDNs make this weak), whitelist violation",
              "Low: unexpected ports/protocols, ambiguous content, enrich before escalating",
            ]}
            note="Many TI vendors mark an IP malicious from one URL on shared hosting. Always check hosting context before acting on a raw IP match."
          />
          <ConceptCard
            title="Long-Tail Analysis & Community ID"
            keyPoints={[
              "Pareto: the top 20% of alert types generate 80% of volume; sort ascending to find where novel attacks hide",
              "Community ID: Base64(SHA1(src_ip+src_port+dst_ip+dst_port+protocol))",
              "Used by Zeek, Suricata, Elastic Security, Arkime to correlate one connection across multiple log sources",
            ]}
          />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Attack & Defense Mental Models</CardTitle></CardHeader>
          <CardContent>
            <RefTable
              head={["Model", "Key takeaway"]}
              rows={[
                ["Cyber Kill Chain", "Break the chain early; if at C2, focus containment not prevention"],
                ["Mandiant Attack Life Cycle", "Iterative loop: attacker cycles Discover → Privilege → Lateral Movement repeatedly"],
                ["Defense in Depth", "Prevention is ideal, detection is a must, detection without response has minimal value"],
                ["NIST CSF", "Identify → Prevent → Detect → Respond → Recover"],
                ["PICERL (IR Cycle)", "Prepare → Identify → Contain → Eradicate → Recovery → Lessons Learned (feeds back to Prepare)"],
                ["OODA Loop", "Observe → Orient → Decide → Act. Orient is the critical phase; whoever iterates faster wins."],
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2">ACH — Analysis of Competing Hypotheses <Badge variant="secondary">7 steps</Badge></CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Brainstorm mutually exclusive hypotheses</li>
              <li>List all evidence and assumptions (including absence of expected evidence)</li>
              <li>Build a matrix: hypotheses across the top, evidence down the side, mark consistent/inconsistent/N/A</li>
              <li>Remove evidence consistent with all hypotheses; it has no diagnostic value</li>
              <li>Tentative conclusion: the hypothesis with the fewest inconsistencies wins</li>
              <li>Sensitivity check: does the conclusion depend on one key assumption?</li>
              <li>Report the likelihood of all hypotheses, not just the winner</li>
            </ol>
            <Alert><AlertDescription className="text-xs">Seek to disconfirm your hypothesis, not confirm it. The hypothesis that survives elimination attempts is the most credible (Popper's falsification).</AlertDescription></Alert>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConceptCard
            title="Cognitive Biases (Heuer)"
            keyPoints={[
              "Anchoring: over-relying on the first piece of information",
              "Confirmation bias: seeking evidence that confirms your theory, the #1 analyst failure",
              "Satisficing: accepting the first good-enough answer",
              "Incrementalism: only considering hypotheses close to the current one",
              "Consensus: choosing the popular answer over the accurate one",
            ]}
          />
          <ConceptCard
            title="Analysis OPSEC"
            description="Don't let the attacker know you found them, or they'll rotate tools/domains and you start over. Mainly applies to targeted attacks."
            keyPoints={[
              "Don't submit a hash/URL to VirusTotal; use existing results or private submission",
              "Don't directly resolve an attacker domain; use passive DNS instead",
              "Don't probe C2 infrastructure directly",
              "Understand the full scope before blocking anything; blocking one C2 can tip off the rest",
            ]}
            note="If malware is 2 years old, a few more days to scope fully is low incremental risk. If just discovered, act fast."
          />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">TLP & PAP</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">TLP governs what you can <strong>share</strong>. PAP (built into MISP) governs what you can <strong>do</strong> with an indicator. Both use the same four-color scale for different questions.</p>
            <RefTable
              head={["Color", "TLP (sharing)", "PAP (permitted action)"]}
              rows={[
                ["White", "No restriction, public", "No restrictions"],
                ["Green", "Community/sector only", "Active: ping target, block traffic, honeypot interaction"],
                ["Amber", "Your org + clients who need it", "Passive cross-check: VirusTotal, monitoring honeypot"],
                ["Red", "Only those in the original exchange", "Non-detectable only: passive log analysis, no network interaction"],
              ]}
            />
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}

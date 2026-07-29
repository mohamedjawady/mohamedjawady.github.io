"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Radar, ShieldAlert } from "lucide-react"

interface SeqMessage {
  /** 0 = left actor sends this message, 1 = right actor sends it */
  from: 0 | 1
  label: string
}

interface AttackEntry {
  title: string
  steps: string[]
  description: string
  collectAt: string
  whatToCollect: string
  color: { fill: string; stroke: string }
  actors: [string, string]
  sequence: SeqMessage[]
}

const RED = { fill: "#ef4444", stroke: "#ef4444" }
const AMBER = { fill: "#f59e0b", stroke: "#f59e0b" }
const BLUE = { fill: "#0ea5e9", stroke: "#0ea5e9" }
const SLATE = { fill: "#64748b", stroke: "#64748b" }
const PURPLE = { fill: "#a855f7", stroke: "#a855f7" }
const GREEN = { fill: "#10b981", stroke: "#10b981" }

function AttackChain({ steps, color }: { steps: string[]; color: { fill: string; stroke: string } }) {
  const boxWidth = 118
  const boxHeight = 42
  const gap = 16
  const totalWidth = steps.length * boxWidth + (steps.length - 1) * gap
  const totalHeight = boxHeight + 4

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="w-full h-auto"
      style={{ maxWidth: `${totalWidth}px` }}
      role="img"
      aria-label={`Attack chain: ${steps.join(" then ")}`}
    >
      <defs>
        <marker id={`arrow-${steps.join("").length}-${color.fill}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.5" />
        </marker>
      </defs>
      {steps.map((step, i) => {
        const x = i * (boxWidth + gap)
        const isLast = i === steps.length - 1
        return (
          <g key={i}>
            <rect
              x={x}
              y={2}
              width={boxWidth}
              height={boxHeight}
              rx={6}
              fill={color.fill}
              fillOpacity={isLast ? 0.18 : 0.1}
              stroke={color.stroke}
              strokeWidth={isLast ? 1.4 : 1.1}
            />
            <foreignObject x={x + 4} y={6} width={boxWidth - 8} height={boxHeight - 8}>
              <div
                // @ts-expect-error -- xmlns is required for foreignObject content in some renderers
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontSize: "9px",
                  lineHeight: "1.15",
                  fontWeight: 600,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                  color: "currentColor",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
                className="text-foreground"
              >
                {step}
              </div>
            </foreignObject>
            {!isLast && (
              <line
                x1={x + boxWidth}
                y1={2 + boxHeight / 2}
                x2={x + boxWidth + gap}
                y2={2 + boxHeight / 2}
                stroke="currentColor"
                strokeOpacity="0.5"
                strokeWidth="1.2"
                className="text-muted-foreground"
                markerEnd={`url(#arrow-${steps.join("").length}-${color.fill})`}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

function SequenceDiagram({
  actors,
  sequence,
  color,
}: {
  actors: [string, string]
  sequence: SeqMessage[]
  color: { fill: string; stroke: string }
}) {
  const width = 300
  const laneX: [number, number] = [56, width - 56]
  const headerH = 34
  const rowH = 30
  const height = headerH + sequence.length * rowH + 10
  const uid = `${actors.join("").replace(/\s+/g, "")}-${color.fill}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      style={{ maxWidth: `${width}px` }}
      role="img"
      aria-label={`Sequence: ${actors[0]} and ${actors[1]}, ${sequence
        .map((m) => `${actors[m.from]} sends ${m.label}`)
        .join(", then ")}`}
    >
      <defs>
        <marker id={`seq-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.6" />
        </marker>
      </defs>

      {[0, 1].map((i) => (
        <g key={i}>
          <rect
            x={laneX[i] - 48}
            y={2}
            width={96}
            height={22}
            rx={5}
            fill={color.fill}
            fillOpacity={0.14}
            stroke={color.stroke}
            strokeWidth={1.1}
          />
          <foreignObject x={laneX[i] - 46} y={2} width={92} height={22}>
            <div
              // @ts-expect-error -- xmlns is required for foreignObject content in some renderers
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontSize: "8px",
                lineHeight: "1.1",
                fontWeight: 700,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "currentColor",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
              className="text-foreground"
            >
              {actors[i]}
            </div>
          </foreignObject>
          <line
            x1={laneX[i]}
            y1={26}
            x2={laneX[i]}
            y2={height - 4}
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="2 3"
            className="text-muted-foreground"
          />
        </g>
      ))}

      {sequence.map((m, i) => {
        const y = headerH + i * rowH + rowH / 2
        const [x1, x2] = m.from === 0 ? [laneX[0], laneX[1]] : [laneX[1], laneX[0]]
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.6"
              strokeWidth="1.1"
              className="text-muted-foreground"
              markerEnd={`url(#seq-${uid})`}
            />
            <foreignObject x={Math.min(laneX[0], laneX[1]) + 4} y={y - 16} width={Math.abs(laneX[1] - laneX[0]) - 8} height={14}>
              <div
                // @ts-expect-error -- xmlns is required for foreignObject content in some renderers
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontSize: "7.5px",
                  lineHeight: "1.1",
                  textAlign: "center",
                  color: "currentColor",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
                className="text-muted-foreground"
              >
                {m.label}
              </div>
            </foreignObject>
          </g>
        )
      })}
    </svg>
  )
}

function AttackCard({ entry }: { entry: AttackEntry }) {
  return (
    <Card className="h-full" style={{ borderTopWidth: 3, borderTopColor: entry.color.stroke }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{entry.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
        <div className="overflow-x-auto py-1">
          <AttackChain steps={entry.steps} color={entry.color} />
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Sequence
          </div>
          <div className="overflow-x-auto py-1">
            <SequenceDiagram actors={entry.actors} sequence={entry.sequence} color={entry.color} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded p-2">
            <div className="flex items-center gap-1 font-semibold mb-1">
              <MapPin className="w-3 h-3" />
              Collect at
            </div>
            <div className="text-muted-foreground">{entry.collectAt}</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="flex items-center gap-1 font-semibold mb-1">
              <Radar className="w-3 h-3" />
              What to collect
            </div>
            <div className="text-muted-foreground">{entry.whatToCollect}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ENUMERATION: AttackEntry[] = [
  {
    title: "Users, Groups & Nested Membership",
    steps: ["Bind with any credential", "Read users/groups", "Resolve nested membership"],
    description: "Default read access to Authenticated Users hands over every user attribute and group, including the nesting a non-recursive query misses entirely.",
    collectAt: "Domain controller (network sensor)",
    whatToCollect: "No native event by default; MDI LDAP query volume baseline; a honeytoken privileged group as a tripwire",
    color: SLATE,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "LDAP bind (any valid credential)" },
      { from: 1, label: "Users, groups, nested membership" },
    ],
  },
  {
    title: "OU & Delegated ACL Enumeration",
    steps: ["List OUs", "Read each OU's ACL", "Map delegation"],
    description: "Every delegated ACE on every OU is readable by default; dsacls or Get-DomainObjectAcl turns that into a list of who can do what, where.",
    collectAt: "Domain controller (network sensor)",
    whatToCollect: "No native read auditing; MDI LDAP volume baseline; a honeytoken OU/object as a tripwire",
    color: SLATE,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "LDAP query: OU tree" },
      { from: 1, label: "OU list" },
      { from: 0, label: "dsacls / Get-DomainObjectAcl" },
      { from: 1, label: "Delegated ACEs per OU" },
    ],
  },
  {
    title: "GPO -> Local Admin Enumeration",
    steps: ["Read every GPO", "Parse Restricted Groups / GPP", "Map to OUs and computers"],
    description: "Correlating GPOs against Restricted Groups and GPP Groups.xml reveals every machine a chosen user is local admin on, without touching one of them.",
    collectAt: "Domain controller (network sensor)",
    whatToCollect: "No native read auditing; MDI LDAP volume baseline; GPP cpassword is a one-time leftover artifact, not an event",
    color: SLATE,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "Read every GPO + OU links" },
      { from: 1, label: "GptTmpl.inf / Groups.xml" },
    ],
  },
  {
    title: "Trust Enumeration",
    steps: ["nltest / Get-ADTrust", "Map transitivity"],
    description: "Direction, transitivity, and SID filtering status of every trust, the map Part 6's escalation techniques are walked against.",
    collectAt: "Domain controller (network sensor)",
    whatToCollect: "MDI reconnaissance alerts; unusual SRV/DNS query volume from a single host",
    color: SLATE,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "nltest / Get-ADTrust" },
      { from: 1, label: "Trust list, direction, transitivity" },
    ],
  },
]

const PRIVESC: AttackEntry[] = [
  {
    title: "Kerberoasting",
    steps: ["Request SPN ticket", "Crack offline"],
    description: "Any authenticated user can request a service ticket for any account with an SPN and crack it offline, no interaction with the target.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4769, RC4 burst across many SPNs from one account; MDI",
    color: AMBER,
    actors: ["Attacker", "KDC"],
    sequence: [
      { from: 0, label: "TGS-REQ for SPN account" },
      { from: 1, label: "TGS (RC4/AES)" },
    ],
  },
  {
    title: "Targeted Kerberoasting",
    steps: ["Write SPN", "Roast ticket", "Delete SPN"],
    description: "Write access over a non-SPN account adds a throwaway SPN, roasts it, then removes it again.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136, servicePrincipalName written and deleted within seconds",
    color: AMBER,
    actors: ["Attacker", "DC / KDC"],
    sequence: [
      { from: 0, label: "Write SPN on target (LDAP)" },
      { from: 0, label: "TGS-REQ" },
      { from: 1, label: "TGS" },
      { from: 0, label: "Delete SPN" },
    ],
  },
  {
    title: "AS-REP Roasting",
    steps: ["AS-REQ, no preauth", "Crack offline"],
    description: "Accounts with Kerberos pre-authentication disabled hand back a crackable AS-REP to anyone who asks by username.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4768, no preceding preauth, often RC4; MDI",
    color: AMBER,
    actors: ["Attacker", "KDC"],
    sequence: [
      { from: 0, label: "AS-REQ, no preauth, valid username" },
      { from: 1, label: "AS-REP (crackable, no proof needed)" },
    ],
  },
  {
    title: "Unconstrained Delegation Abuse",
    steps: ["Coerce/await auth", "Extract cached TGT", "Act as victim"],
    description: "A server trusted for unconstrained delegation caches the full TGT of anyone who authenticates to it.",
    collectAt: "Domain controller + endpoint",
    whatToCollect: "Event 4738/5136 (TRUSTED_FOR_DELEGATION set); MDI coercion alerts",
    color: RED,
    actors: ["Attacker", "Delegation Server"],
    sequence: [
      { from: 0, label: "Compromises the server" },
      { from: 1, label: "Hands over cached TGT (from earlier victim auth)" },
    ],
  },
  {
    title: "RBCD Abuse",
    steps: ["Control a computer", "Set RBCD attribute", "S4U2Self / S4U2Proxy"],
    description: "Write access to one computer object's delegation attribute lets an attacker impersonate a chosen user against it.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136 on msDS-AllowedToActOnBehalfOfOtherIdentity; event 4741 burst",
    color: PURPLE,
    actors: ["Attacker", "KDC"],
    sequence: [
      { from: 0, label: "Sets RBCD attribute on controlled computer" },
      { from: 0, label: "S4U2Self + S4U2Proxy" },
      { from: 1, label: "Service ticket as impersonated user" },
    ],
  },
  {
    title: "Shadow Credentials",
    steps: ["Write KeyCredentialLink", "PKINIT auth"],
    description: "Writing an attacker key into msDS-KeyCredentialLink yields a TGT without ever knowing the account's password.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136 on msDS-KeyCredentialLink; event 4768 with certificate-based preauth",
    color: PURPLE,
    actors: ["Attacker", "KDC"],
    sequence: [
      { from: 0, label: "Writes key to msDS-KeyCredentialLink" },
      { from: 0, label: "PKINIT AS-REQ with that key" },
      { from: 1, label: "TGT, no password needed" },
    ],
  },
  {
    title: "AD CS ESC1",
    steps: ["Vulnerable template", "Request cert, SAN = target", "PKINIT"],
    description: "A template that lets the requester set the SAN and grants broad enrollment rights hands out a TGT for anyone.",
    collectAt: "Certificate authority + domain controller",
    whatToCollect: "CA events 4886/4887; proactive certipy find -vulnerable",
    color: AMBER,
    actors: ["Attacker", "CA / KDC"],
    sequence: [
      { from: 0, label: "Requests cert, SAN = target UPN" },
      { from: 1, label: "Issues cert exactly as requested" },
      { from: 0, label: "PKINIT AS-REQ with the cert" },
      { from: 1, label: "TGT as the target" },
    ],
  },
  {
    title: "DCSync -> Golden Ticket",
    steps: ["DCSync krbtgt", "Forge ticket", "Auth as anyone"],
    description: "Replicating Directory Changes rights let an attacker pull krbtgt's hash and forge a TGT for any identity, offline.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4662 with replication GUIDs from a non-DC source; MDI DCSync alert",
    color: RED,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "DRSGetNCChanges, as if a DC" },
      { from: 1, label: "krbtgt hash" },
      { from: 0, label: "(offline) forges Golden Ticket" },
    ],
  },
]

const LATERAL_MOVEMENT: AttackEntry[] = [
  {
    title: "PowerShell Remoting Pivot",
    steps: ["WinRM session", "2nd hop (double-hop)"],
    description: "PowerShell Remoting is the default lateral movement rail; the double-hop problem is the same delegation gap RBCD abuses.",
    collectAt: "Endpoint",
    whatToCollect: "wsmprovhost.exe parent process; events 4103/4104; event 4624",
    color: BLUE,
    actors: ["Attacker", "Server A"],
    sequence: [
      { from: 0, label: "WinRM session (5985/5986)" },
      { from: 1, label: "Interactive session" },
      { from: 0, label: "Attempts 2nd hop to Server B" },
      { from: 1, label: "Blocked by default (double-hop)" },
    ],
  },
  {
    title: "LSASS Extraction",
    steps: ["Open lsass.exe", "Read credentials"],
    description: "NTLM hashes, Kerberos tickets, and sometimes plaintext live in LSASS memory for every logged-on session.",
    collectAt: "Endpoint",
    whatToCollect: "Event 4656; Sysmon event 10; ASR LSASS rule (9e6c4e1f-7d60-472f-ba1a-a39ef669e4b2)",
    color: RED,
    actors: ["Attacker", "lsass.exe"],
    sequence: [
      { from: 0, label: "OpenProcess (read access)" },
      { from: 1, label: "Process handle" },
      { from: 0, label: "ReadProcessMemory" },
      { from: 1, label: "Credential material" },
    ],
  },
  {
    title: "SAM / SECURITY Hive Dump",
    steps: ["reg save hives", "Offline parse"],
    description: "Local account hashes and LSA secrets, including the machine's DPAPI_SYSTEM secret, sit in two registry hives.",
    collectAt: "Endpoint",
    whatToCollect: "reg.exe save of SAM/SECURITY/SYSTEM in sequence; event 4657",
    color: AMBER,
    actors: ["Attacker", "Local Registry"],
    sequence: [
      { from: 0, label: "reg save SAM / SECURITY / SYSTEM" },
      { from: 1, label: "Hive files" },
      { from: 0, label: "Offline parse (secretsdump.py)" },
    ],
  },
  {
    title: "DPAPI Domain Backup Key Theft",
    steps: ["Extract domain backup key", "Decrypt any user's secrets"],
    description: "A stolen domain DPAPI backup key decrypts every domain user's Credential Manager and Vault secrets, forever.",
    collectAt: "Domain controller",
    whatToCollect: "LsaRetrievePrivateData for G$BCKUPKEY_*; DSInternals auditing guidance",
    color: RED,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "lsadump::backupkeys / DCSync TDO" },
      { from: 1, label: "Domain DPAPI private key" },
      { from: 0, label: "(offline) decrypts any user's DPAPI blobs" },
    ],
  },
  {
    title: "Over-Pass-the-Hash",
    steps: ["Hash/key from LSASS", "AS-REQ with that key", "Real TGT"],
    description: "An NTLM hash or AES key becomes a real Kerberos TGT, not just NTLM reuse.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4768 with RC4 in an AES-default environment (encryption downgrade)",
    color: PURPLE,
    actors: ["Attacker", "KDC"],
    sequence: [
      { from: 0, label: "AS-REQ using NTLM hash / AES key as the long-term key" },
      { from: 1, label: "Real TGT" },
    ],
  },
]

const PERSISTENCE: AttackEntry[] = [
  {
    title: "Silver Ticket",
    steps: ["Forge TGS w/ service hash", "Present directly"],
    description: "Forged entirely from one service account's hash, presented straight to the service; the KDC is never contacted.",
    collectAt: "Domain controller",
    whatToCollect: "Absence of 4768/4769 for the access; ValidateKdcPacSignature enforcement",
    color: RED,
    actors: ["Attacker", "Target Service"],
    sequence: [
      { from: 0, label: "(offline) forges TGS with service hash" },
      { from: 0, label: "Presents TGS directly" },
      { from: 1, label: "Access granted, KDC never contacted" },
    ],
  },
  {
    title: "Diamond Ticket",
    steps: ["Real TGT", "Decrypt + edit w/ krbtgt", "Re-encrypt"],
    description: "Starts from a real, normally-issued TGT, so it carries correct policy values, evading Golden Ticket artifact checks.",
    collectAt: "Domain controller",
    whatToCollect: "PAC group membership inconsistent with AD (behavioral correlation, not the request)",
    color: RED,
    actors: ["Attacker", "KDC"],
    sequence: [
      { from: 0, label: "Normal AS-REQ" },
      { from: 1, label: "Real TGT" },
      { from: 0, label: "(offline) decrypts, edits, re-encrypts with krbtgt" },
    ],
  },
  {
    title: "Skeleton Key",
    steps: ["Patch LSASS on a DC", "Master password installed"],
    description: "An in-memory LSASS patch on a DC accepts one attacker-chosen password for every account, until reboot.",
    collectAt: "Domain controller (endpoint)",
    whatToCollect: "LSASS Image File Execution Options auditing; auth with a non-current password",
    color: RED,
    actors: ["Attacker", "lsass.exe (DC)"],
    sequence: [
      { from: 0, label: "Injects patch (Domain Admin + SeDebugPrivilege)" },
      { from: 1, label: "Accepts real password OR master password" },
    ],
  },
  {
    title: "DSRM Backdoor",
    steps: ["Extract/reset DSRM password", "Set logon flag = 2"],
    description: "A rarely-rotated local DC account becomes a network-reachable backdoor that survives a full domain password reset.",
    collectAt: "Domain controller (endpoint)",
    whatToCollect: "Registry write auditing on DsrmAdminLogonBehavior; event 4624 for the DSRM account",
    color: AMBER,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "Extracts/resets local DSRM password" },
      { from: 0, label: "Sets DsrmAdminLogonBehavior = 2" },
      { from: 1, label: "DSRM account now reachable over the network" },
    ],
  },
  {
    title: "Custom SSP",
    steps: ["Register malicious SSP", "Logs plaintext creds"],
    description: "A malicious Security Support Provider loaded into LSASS logs every credential that authenticates through it, in plaintext.",
    collectAt: "Endpoint",
    whatToCollect: "Event 4657 on Security Packages; Sysmon event 7 (ImageLoad)",
    color: PURPLE,
    actors: ["Attacker", "lsass.exe"],
    sequence: [
      { from: 0, label: "Registers malicious SSP DLL" },
      { from: 1, label: "Loads it at boot / live injection" },
      { from: 1, label: "Logs every credential in plaintext" },
    ],
  },
  {
    title: "AdminSDHolder ACL Abuse",
    steps: ["Add ACE to AdminSDHolder", "SDProp reapplies hourly"],
    description: "An ACE added to AdminSDHolder gets silently reapplied to every protected group, even after being removed directly.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136 with a SACL on AdminSDHolder; scheduled BloodHound ACL review",
    color: RED,
    actors: ["Attacker", "SDProp (PDC Emulator)"],
    sequence: [
      { from: 0, label: "Adds ACE to AdminSDHolder" },
      { from: 1, label: "Copies ACE onto every protected group (hourly)" },
    ],
  },
]

const TRUST_ESCALATION: AttackEntry[] = [
  {
    title: "Trust Key Theft",
    steps: ["lsadump::trust / DCSync TDO", "Forge inter-realm TGT"],
    description: "Stealing the shared trust key lets an attacker forge a referral ticket that the other side of a trust will honor.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4662 on the Trusted Domain Object from a non-DC source",
    color: RED,
    actors: ["Attacker", "Domain Controller"],
    sequence: [
      { from: 0, label: "lsadump::trust / DCSync the TDO" },
      { from: 1, label: "Inter-realm trust key" },
      { from: 0, label: "(offline) forges inter-realm TGT" },
    ],
  },
  {
    title: "Child-to-Parent (SID History)",
    steps: ["Forge Golden Ticket", "Add parent's SID to ExtraSids"],
    description: "SID filtering is off by default on intra-forest trusts, so a child domain's krbtgt hash reaches the whole forest.",
    collectAt: "Domain controller",
    whatToCollect: "Non-empty sIDHistory outside a tracked, documented migration",
    color: RED,
    actors: ["Attacker", "KDC (child domain)"],
    sequence: [
      { from: 0, label: "(offline) forges Golden Ticket + ExtraSids" },
      { from: 0, label: "Presents ticket forest-wide" },
      { from: 1, label: "Honored (SID filtering off intra-forest)" },
    ],
  },
]

const SECTIONS: { title: string; part: string; entries: AttackEntry[] }[] = [
  { title: "Enumeration", part: "Part 2", entries: ENUMERATION },
  { title: "Privilege Escalation", part: "Part 3", entries: PRIVESC },
  { title: "Lateral Movement & Credential Extraction", part: "Part 4", entries: LATERAL_MOVEMENT },
  { title: "Persistence", part: "Part 5", entries: PERSISTENCE },
  { title: "Trust & Forest Escalation", part: "Part 6", entries: TRUST_ESCALATION },
]

export function ActiveDirectoryAttackCollectionMapNotes() {
  return (
    <div className="space-y-8">
      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          A diagram-first companion to the{" "}
          <Link href="/posts/active-directory-security-part1" className="underline font-medium">
            Active Directory Series
          </Link>
          . Every card below is one technique, reduced to its shape, paired with where the collection actually has to
          happen and what specifically to collect there. Full mechanics, tooling, and reasoning live in the posts
          themselves: {" "}
          <Link href="/posts/active-directory-security-part2" className="underline">Part 2</Link>,{" "}
          <Link href="/posts/active-directory-security-part3" className="underline">Part 3</Link>,{" "}
          <Link href="/posts/active-directory-security-part4" className="underline">Part 4</Link>,{" "}
          <Link href="/posts/active-directory-security-part5" className="underline">Part 5</Link>,{" "}
          <Link href="/posts/active-directory-security-part6" className="underline">Part 6</Link>, and the
          endpoint/EDR layer rolled up in{" "}
          <Link href="/posts/active-directory-security-part7" className="underline">Part 7</Link>.
        </AlertDescription>
      </Alert>

      {SECTIONS.map((section) => (
        <div key={section.title} className="space-y-4">
          <div className="border-b border-border pb-2 flex items-center gap-2">
            <Badge variant="secondary">{section.part}</Badge>
            <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {section.entries.map((entry) => (
              <AttackCard key={entry.title} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

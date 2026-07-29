"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Radar, ShieldAlert } from "lucide-react"

interface AttackEntry {
  title: string
  steps: string[]
  description: string
  collectAt: string
  whatToCollect: string
  color: { fill: string; stroke: string }
}

const RED = { fill: "#ef4444", stroke: "#ef4444" }
const AMBER = { fill: "#f59e0b", stroke: "#f59e0b" }
const BLUE = { fill: "#0ea5e9", stroke: "#0ea5e9" }
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

const PRIVESC: AttackEntry[] = [
  {
    title: "Kerberoasting",
    steps: ["Request SPN ticket", "Crack offline"],
    description: "Any authenticated user can request a service ticket for any account with an SPN and crack it offline, no interaction with the target.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4769, RC4 burst across many SPNs from one account; MDI",
    color: AMBER,
  },
  {
    title: "Targeted Kerberoasting",
    steps: ["Write SPN", "Roast ticket", "Delete SPN"],
    description: "Write access over a non-SPN account adds a throwaway SPN, roasts it, then removes it again.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136, servicePrincipalName written and deleted within seconds",
    color: AMBER,
  },
  {
    title: "AS-REP Roasting",
    steps: ["AS-REQ, no preauth", "Crack offline"],
    description: "Accounts with Kerberos pre-authentication disabled hand back a crackable AS-REP to anyone who asks by username.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4768, no preceding preauth, often RC4; MDI",
    color: AMBER,
  },
  {
    title: "Unconstrained Delegation Abuse",
    steps: ["Coerce/await auth", "Extract cached TGT", "Act as victim"],
    description: "A server trusted for unconstrained delegation caches the full TGT of anyone who authenticates to it.",
    collectAt: "Domain controller + endpoint",
    whatToCollect: "Event 4738/5136 (TRUSTED_FOR_DELEGATION set); MDI coercion alerts",
    color: RED,
  },
  {
    title: "RBCD Abuse",
    steps: ["Control a computer", "Set RBCD attribute", "S4U2Self / S4U2Proxy"],
    description: "Write access to one computer object's delegation attribute lets an attacker impersonate a chosen user against it.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136 on msDS-AllowedToActOnBehalfOfOtherIdentity; event 4741 burst",
    color: PURPLE,
  },
  {
    title: "Shadow Credentials",
    steps: ["Write KeyCredentialLink", "PKINIT auth"],
    description: "Writing an attacker key into msDS-KeyCredentialLink yields a TGT without ever knowing the account's password.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136 on msDS-KeyCredentialLink; event 4768 with certificate-based preauth",
    color: PURPLE,
  },
  {
    title: "AD CS ESC1",
    steps: ["Vulnerable template", "Request cert, SAN = target", "PKINIT"],
    description: "A template that lets the requester set the SAN and grants broad enrollment rights hands out a TGT for anyone.",
    collectAt: "Certificate authority + domain controller",
    whatToCollect: "CA events 4886/4887; proactive certipy find -vulnerable",
    color: AMBER,
  },
  {
    title: "DCSync -> Golden Ticket",
    steps: ["DCSync krbtgt", "Forge ticket", "Auth as anyone"],
    description: "Replicating Directory Changes rights let an attacker pull krbtgt's hash and forge a TGT for any identity, offline.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4662 with replication GUIDs from a non-DC source; MDI DCSync alert",
    color: RED,
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
  },
  {
    title: "LSASS Extraction",
    steps: ["Open lsass.exe", "Read credentials"],
    description: "NTLM hashes, Kerberos tickets, and sometimes plaintext live in LSASS memory for every logged-on session.",
    collectAt: "Endpoint",
    whatToCollect: "Event 4656; Sysmon event 10; ASR LSASS rule (9e6c4e1f-7d60-472f-ba1a-a39ef669e4b2)",
    color: RED,
  },
  {
    title: "SAM / SECURITY Hive Dump",
    steps: ["reg save hives", "Offline parse"],
    description: "Local account hashes and LSA secrets, including the machine's DPAPI_SYSTEM secret, sit in two registry hives.",
    collectAt: "Endpoint",
    whatToCollect: "reg.exe save of SAM/SECURITY/SYSTEM in sequence; event 4657",
    color: AMBER,
  },
  {
    title: "DPAPI Domain Backup Key Theft",
    steps: ["Extract domain backup key", "Decrypt any user's secrets"],
    description: "A stolen domain DPAPI backup key decrypts every domain user's Credential Manager and Vault secrets, forever.",
    collectAt: "Domain controller",
    whatToCollect: "LsaRetrievePrivateData for G$BCKUPKEY_*; DSInternals auditing guidance",
    color: RED,
  },
  {
    title: "Over-Pass-the-Hash",
    steps: ["Hash/key from LSASS", "AS-REQ with that key", "Real TGT"],
    description: "An NTLM hash or AES key becomes a real Kerberos TGT, not just NTLM reuse.",
    collectAt: "Domain controller",
    whatToCollect: "Event 4768 with RC4 in an AES-default environment (encryption downgrade)",
    color: PURPLE,
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
  },
  {
    title: "Diamond Ticket",
    steps: ["Real TGT", "Decrypt + edit w/ krbtgt", "Re-encrypt"],
    description: "Starts from a real, normally-issued TGT, so it carries correct policy values, evading Golden Ticket artifact checks.",
    collectAt: "Domain controller",
    whatToCollect: "PAC group membership inconsistent with AD (behavioral correlation, not the request)",
    color: RED,
  },
  {
    title: "Skeleton Key",
    steps: ["Patch LSASS on a DC", "Master password installed"],
    description: "An in-memory LSASS patch on a DC accepts one attacker-chosen password for every account, until reboot.",
    collectAt: "Domain controller (endpoint)",
    whatToCollect: "LSASS Image File Execution Options auditing; auth with a non-current password",
    color: RED,
  },
  {
    title: "DSRM Backdoor",
    steps: ["Extract/reset DSRM password", "Set logon flag = 2"],
    description: "A rarely-rotated local DC account becomes a network-reachable backdoor that survives a full domain password reset.",
    collectAt: "Domain controller (endpoint)",
    whatToCollect: "Registry write auditing on DsrmAdminLogonBehavior; event 4624 for the DSRM account",
    color: AMBER,
  },
  {
    title: "Custom SSP",
    steps: ["Register malicious SSP", "Logs plaintext creds"],
    description: "A malicious Security Support Provider loaded into LSASS logs every credential that authenticates through it, in plaintext.",
    collectAt: "Endpoint",
    whatToCollect: "Event 4657 on Security Packages; Sysmon event 7 (ImageLoad)",
    color: PURPLE,
  },
  {
    title: "AdminSDHolder ACL Abuse",
    steps: ["Add ACE to AdminSDHolder", "SDProp reapplies hourly"],
    description: "An ACE added to AdminSDHolder gets silently reapplied to every protected group, even after being removed directly.",
    collectAt: "Domain controller",
    whatToCollect: "Event 5136 with a SACL on AdminSDHolder; scheduled BloodHound ACL review",
    color: RED,
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
  },
  {
    title: "Child-to-Parent (SID History)",
    steps: ["Forge Golden Ticket", "Add parent's SID to ExtraSids"],
    description: "SID filtering is off by default on intra-forest trusts, so a child domain's krbtgt hash reaches the whole forest.",
    collectAt: "Domain controller",
    whatToCollect: "Non-empty sIDHistory outside a tracked, documented migration",
    color: RED,
  },
]

const SECTIONS: { title: string; part: string; entries: AttackEntry[] }[] = [
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

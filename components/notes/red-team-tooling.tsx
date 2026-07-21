"use client"

import type { ReactNode } from "react"
import { KeyRound, Network, Terminal, Radar, AlertTriangle } from "lucide-react"
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

function ToolCard({ name, tagline, what, artifact }: { name: string; tagline: string; what: string; artifact: string }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="font-mono">{name}</span>
          <Badge variant="outline" className="text-xs">{tagline}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{what}</p>
        <Alert>
          <AlertDescription className="text-xs"><strong>Detection artifact:</strong> {artifact}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export function RedTeamToolingNotes() {
  return (
    <div className="space-y-10">
      <Alert>
        <Radar className="h-4 w-4" />
        <AlertDescription>
          Organized by function, in roughly the order an operator reaches for them: credential access, AD enumeration,
          Kerberos abuse, lateral movement, and the C2 frameworks that tie it together. Each tool includes what it
          actually leaves behind for detection.
        </AlertDescription>
      </Alert>

      <Section icon={<KeyRound className="h-6 w-6 mt-1" />} title="Credential Access" subtitle="Getting material out of memory or storage">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard
            name="Mimikatz"
            tagline="LSASS credential extraction"
            what="Reads LSASS process memory to extract plaintext passwords (if WDigest is enabled), NTLM hashes, and Kerberos tickets for every logged-on session. sekurlsa::logonpasswords is the classic module; lsadump::dcsync pulls password data straight from a domain controller via the replication protocol without ever touching NTDS.dit."
            artifact="Sysmon event 10 (ProcessAccess) with a source process requesting memory-read handles to lsass.exe; DCSync usage shows as unusual Directory Replication Service traffic from a non-DC source."
          />
          <ToolCard
            name="LaZagne"
            tagline="Stored credential recovery"
            what="Recovers credentials saved by applications and the OS rather than in-memory session material: browsers, mail clients, Wi-Fi profiles, password managers, and various database and admin tool config files."
            artifact="File access to well-known credential storage locations (browser profile SQLite DBs, WLAN profile XML) by a process with no legitimate reason to read them."
          />
        </div>
      </Section>

      <Section icon={<Network className="h-6 w-6 mt-1" />} title="AD Enumeration & Attack-Path Mapping" subtitle="Finding the path to Domain Admin before touching it">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard
            name="PowerView"
            tagline="AD enumeration"
            what="A PowerShell library for querying Active Directory over LDAP: users, groups, computers, trusts, ACLs, and GPOs. Used to answer 'who can do what to whom' before making any move that could trigger an alert."
            artifact="High-volume LDAP queries against unusual attributes (ACL/nTSecurityDescriptor reads) from a workstation that isn't a management or admin host; event 4104 if run through PowerShell with script block logging enabled."
          />
          <ToolCard
            name="BloodHound / SharpHound"
            tagline="Attack path graph"
            what="SharpHound collects AD relationships (group memberships, sessions, ACLs, delegation rights); BloodHound renders them as a graph and computes the shortest path from a compromised account to Domain Admin, exactly the analysis a defender should be running against their own domain first."
            artifact="A burst of LDAP and SMB/RPC session enumeration (NetSessionEnum, NetWkstaUserEnum) against many hosts in a short window from a single account."
          />
          <ToolCard
            name="PowerUp"
            tagline="Local privesc enumeration"
            what="Enumerates common Windows local privilege escalation vectors: unquoted service paths, weak service permissions, AlwaysInstallElevated, modifiable scheduled tasks. Part of the PowerSploit collection."
            artifact="Enumeration of service binary paths and permissions (sc.exe queries, registry reads under HKLM\\SYSTEM\\CurrentControlSet\\Services) from a non-administrative context, plus 4104 if invoked as a script block."
          />
          <ToolCard
            name="Impacket (enumeration tools)"
            tagline="Protocol-level recon"
            what="Python library and CLI tools (GetADUsers.py, GetNPUsers.py for AS-REP roasting) for AD enumeration over raw protocol implementations, useful from non-Windows attack hosts where PowerShell isn't an option."
            artifact="4768 requests with pre-authentication disabled flags visible in the request, for AS-REP roasting specifically; otherwise looks like normal LDAP/Kerberos traffic from an unexpected source IP."
          />
        </div>
      </Section>

      <Section icon={<KeyRound className="h-6 w-6 mt-1" />} title="Kerberos Abuse" subtitle="Rubeus, the Swiss Army knife for tickets">
        <Card>
          <CardHeader><CardTitle className="text-base font-mono">Rubeus</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A C# toolkit purpose-built for Kerberos ticket abuse: requesting and cracking service tickets (Kerberoasting), requesting
              tickets for accounts without pre-auth (AS-REP roasting), forging Golden and Silver tickets from a stolen krbtgt or service
              account hash, and ticket harvesting/renewal for persistence.
            </p>
            <RefTable
              head={["Rubeus mode", "What it does", "Maps to event"]}
              rows={[
                ["kerberoast", "Requests TGS tickets for every SPN-registered account, dumps them for offline cracking", "4769, watch for encryption type 0x17 and bulk requests"],
                ["asreproast", "Requests AS-REP for accounts with Kerberos pre-authentication disabled", "4768 with pre-auth type absent"],
                ["golden / silver", "Forges tickets offline using a stolen krbtgt or service account hash", "No DC event at all for a Golden Ticket; that's the point"],
                ["renew / harvest", "Collects and renews TGTs over time for persistent access", "4770 renewal patterns outside normal session lifetimes"],
              ]}
            />
          </CardContent>
        </Card>
      </Section>

      <Section icon={<Terminal className="h-6 w-6 mt-1" />} title="Remote Execution & Lateral Movement" subtitle="Turning access into access somewhere else">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard
            name="PsExec (Sysinternals)"
            tagline="SMB + service-based remote exec"
            what="Copies a binary to the target's ADMIN$ share and creates a temporary Windows service to run it, a legitimate sysadmin tool that is also the textbook lateral-movement pattern."
            artifact="Event 7045 (new service installed) with a randomly-named service and a binary path in ADMIN$/Temp, immediately followed by the service starting and stopping."
          />
          <ToolCard
            name="Impacket: psexec.py / wmiexec.py / smbexec.py"
            tagline="Python reimplementations"
            what="Reimplement PsExec-style and WMI-based remote execution from Linux attack infrastructure, useful because they don't require the Windows Sysinternals binary and are easy to modify to evade specific signatures."
            artifact="wmiexec.py: WMI process creation (event 4688 for WmiPrvSE.exe spawning cmd.exe) with no matching interactive logon. psexec.py: same 7045 signature as native PsExec."
          />
          <ToolCard
            name="Impacket: secretsdump.py"
            tagline="Remote credential dump"
            what="Remotely dumps SAM, LSA secrets, and cached domain credentials from a target, or performs a full DCSync against a domain controller to pull NTDS.dit contents over the wire."
            artifact="Directory Replication Service traffic to a DC from a host that isn't another DC; locally, remote registry access to SAM/SECURITY hives."
          />
          <ToolCard
            name="CrackMapExec / NetExec"
            tagline="Swiss-army AD lateral movement"
            what="Automates credential validation, command execution, and enumeration across many hosts at once using SMB, WinRM, or WMI, commonly used to spray a captured credential across an entire subnet quickly."
            artifact="A single account authenticating (4624 Type 3) against a large number of hosts in a short window, often followed by identical process creation events on each."
          />
        </div>
      </Section>

      <Section icon={<Radar className="h-6 w-6 mt-1" />} title="C2 Frameworks" subtitle="Where the tools above get orchestrated from">
        <p className="text-sm text-muted-foreground">
          Everything above is typically launched and coordinated through a command-and-control framework rather than run by hand.
          This blog's post on modern C2 frameworks covers this layer in depth; the short version by category:
        </p>
        <RefTable
          head={["Framework", "Category", "Notable trait"]}
          rows={[
            ["Cobalt Strike", "Commercial, red team standard", "Malleable C2 profiles let traffic mimic legitimate protocols; the most cracked/leaked framework, also widely abused by real threat actors"],
            ["Sliver", "Open source", "Cross-platform Go implants, increasingly popular as a Cobalt Strike alternative in both red team and real-world intrusions"],
            ["Metasploit / Meterpreter", "Open source, general exploitation", "Broader exploitation framework with C2 capability bolted on; noisier and more heavily signatured than the two above"],
            ["Empire / Starkiller", "Open source, PowerShell/Python", "Historically PowerShell-heavy, which made it a strong match for the LOLBin/script-based detection surface"],
          ]}
        />
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            None of these tools are inherently red-team-only. The same binaries and behaviors show up verbatim in real intrusions,
            which is exactly why detecting the behavior (LSASS access, DCSync traffic, malleable C2 beaconing patterns) beats
            detecting a specific tool's default indicators, since those get changed first.
          </AlertDescription>
        </Alert>
      </Section>
    </div>
  )
}

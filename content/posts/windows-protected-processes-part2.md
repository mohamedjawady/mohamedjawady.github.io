---
title: "Windows Protected Processes Series: Part 2"
description: "Advanced inspection techniques with Process Hacker, WinDbg kernel debugging, LSASS credential protection, BYOVD attacks, detection strategies, and system hardening for Windows protected processes."
date: "2025-11-22"
author: "Mohamed Habib Jaouadi"
tags: ["windows-protected-processes-series", "process-hacker", "windbg", "kernel-debugging", "lsass", "mimikatz", "byovd", "security-monitoring"]
banner: "/banners/posts/windows-protected-processes-inspection.png"
bannerAlt: "Windows Protected Processes Part 2 - Advanced Inspection and Security"
visibility: "public"
series: "Windows Protected Processes Series"
seriesOrder: 2
---

> **⚠️ Educational Purpose:** This content is for educational and authorized security research only. Process inspection and debugging should only be performed on systems you own or have explicit permission to analyze.

## Introduction

In Part 1, we explored the fundamentals of Windows protected processes, understanding why Process Explorer faces limitations when inspecting critical system processes like CSRSS, and examining the kernel-level protection mechanisms that transcend traditional administrative privileges.

Part 2 continues with advanced inspection techniques that can bypass some of these restrictions. We'll examine Process Hacker's kernel driver capabilities, WinDbg kernel debugging for complete system visibility, and the special case of LSASS and credential theft. We'll also cover real-world attack scenarios, Bring Your Own Vulnerable Driver (BYOVD) attacks, detection mechanisms, and comprehensive system hardening strategies.

## Process Hacker: Advanced Inspection Capabilities

Process Hacker is a powerful open-source alternative to Process Explorer with enhanced capabilities for inspecting protected processes. Originally developed as a community effort to create a more capable process viewer, Process Hacker has evolved into the tool of choice for security researchers and advanced users who need deeper system insight than Process Explorer provides.

### Why Process Hacker Succeeds Where Process Explorer Fails

The key to Process Hacker's enhanced capabilities lies in its kernel driver (`KProcessHacker.sys`), which operates in kernel mode at Ring 0. This architectural difference is fundamental to understanding why Process Hacker can access information that Process Explorer cannot retrieve.

Operating at the same privilege level as the Windows kernel itself, the KProcessHacker driver can bypass user-mode security restrictions that normally block administrative tools. The driver queries kernel structures directly, accessing process information without going through the restricted Win32 APIs that respect PPL boundaries. This direct kernel access allows it to read protected process memory and query information that would normally be denied to user-mode applications.

**Important Limitations and Caveats:**

While kernel drivers operate at Ring 0, they don't bypass all protections. Modern Windows includes several defensive mechanisms:

- **Driver Signature Enforcement (DSE)** - On 64-bit Windows with Secure Boot enabled, only drivers signed with Extended Validation (EV) certificates can load. Process Hacker's KProcessHacker driver is not EV-signed for Secure Boot, requiring either Secure Boot to be disabled or test signing mode enabled (`bcdedit /set testsigning on`), both of which significantly weaken system security.

- **PatchGuard (Kernel Patch Protection)** - Monitors critical kernel structures and triggers bug checks if unauthorized modifications are detected. Drivers that attempt to disable PPL protection or modify kernel security structures risk triggering PatchGuard.

- **HVCI (Hypervisor-protected Code Integrity)** - On systems with VBS/HVCI enabled, the hypervisor enforces code integrity, making it extremely difficult for drivers to execute arbitrary code or modify protected memory regions.

- **Antimalware/EDR Detection** - Kernel drivers with memory access capabilities are commonly flagged by security software as potentially malicious. Process Hacker's driver may trigger alerts or be blocked by endpoint protection.

The driver provides enhanced token manipulation capabilities, allowing Process Hacker to view security tokens more thoroughly than standard tools. However, actually modifying protection levels or critical security structures carries significant risk of system instability or detection. Research has shown that while PPL provides strong protection, it's not unbreakable as kernel-mode attacks via vulnerable drivers (BYOVD) or kernel exploits can potentially disable or bypass PPL, though such attacks are increasingly difficult and detectable on modern systems.

### Using Process Hacker

```powershell
# Download Process Hacker from official repository
# Run as Administrator
ProcessHacker.exe
```

When you enable the kernel driver in Process Hacker through Options → Enable Kernel-mode driver, it loads `KProcessHacker.sys` into kernel space. This gives the application access to protected process information that would otherwise be inaccessible. You can then view complete process memory contents, including data that protected processes keep hidden from user-mode tools. Access to handle information from protected processes becomes available, showing you exactly what resources these critical processes are using. Thread inspection becomes fully functional, allowing you to view stack traces and examine the execution state of protected process threads. Memory dumping operations succeed, enabling you to capture process memory for offline analysis. Token information and integrity levels become visible, revealing the complete security context.

### Important Considerations

While Process Hacker can inspect protected processes, this capability comes with significant caveats that users must understand.

**Driver Signing Requirements:**

Modern Windows (10/11 and Server 2016+) requires **Extended Validation (EV) code-signed** kernel-mode drivers for systems with Secure Boot enabled. The original KProcessHacker driver is **not EV-signed for Secure Boot** and therefore cannot load on a properly secured system unless:

- **Secure Boot is disabled** in UEFI/BIOS settings, or
- **Test signing mode is enabled** (`bcdedit /set testsigning on`)

Enabling test signing mode invalidates Secure Boot protections and allows unsigned or test-signed drivers to load, which represents a significant decrease in OS integrity enforcement. While test signing doesn't eliminate all security features, it creates a substantial weakness in the boot chain and driver loading policies.

**EDR and Security Software:**

Security software commonly flags or blocks kernel drivers:

- **Detection and Alerts** - Most EDR solutions flag kernel drivers with memory access capabilities as potentially malicious
- **Policy-Based Blocking** - Some EDRs prevent loading any non-approved drivers, even if properly signed, via kernel callbacks (ObRegisterCallbacks, PsSetLoadImageNotifyRoutine) or internal driver allowlisting policies
- **Exception Management** - Creating exceptions for Process Hacker's driver may create blind spots in security monitoring

**System Stability Risks:**

Kernel-mode operations can cause system instability if misused. Unlike user-mode crashes that terminate a single application, kernel-mode crashes trigger a system-wide bug check (BSOD). Additionally:

- **PatchGuard limitations** - Even with a kernel driver loaded, PatchGuard monitors critical kernel structures and will trigger bug checks if unauthorized modifications are detected
- **PPL enforcement** - While kernel drivers can technically read protected process memory, attempting to modify protection levels or disable PPL risks PatchGuard violations
- **Code Integrity** - On systems with HVCI enabled, the hypervisor enforces additional constraints that limit what kernel drivers can accomplish

## Deep Inspection with WinDbg and Kernel Debugging

For the deepest level of process inspection, kernel debugging with WinDbg provides unparalleled access to system internals. WinDbg is Microsoft's official debugger, designed for kernel-mode debugging and low-level system analysis. When configured for kernel debugging, WinDbg connects to a target system and operates with complete visibility into kernel structures, including all protected processes.

### The !process Command

The `!process` command in WinDbg allows you to inspect process structures directly in the kernel debugger. This command queries the kernel's internal process structures (EPROCESS blocks) that contain all the information Windows maintains about running processes.

**Note:** The actual WinDbg output will be shown in screenshots throughout this section rather than text output.

### Advanced Process Inspection Commands

Beyond the basic `!process` command, WinDbg provides extensive capabilities for deep process analysis through its kernel debugging extensions:

```text
# Display detailed process information
kd> !process <process_address> 7

# Display all processes
kd> !process 0 0

# Display process with specific PID
kd> !process <address> 0

# Display process token information
kd> !token <token_address>

# Display process protection level
kd> dt nt!_EPROCESS <address> Protection
```

The `!process` command with flag 7 displays the most detailed view, including all threads, loaded modules, and handle information. Using address 0 with flag 0 lists all processes in the system, providing an overview of everything running. The `!token` command examines security tokens in detail, showing privileges, groups, and integrity levels. The `dt` (display type) command shows the raw EPROCESS structure, including the Protection field that contains the PPL information.

### Kernel Debugging Setup

Kernel debugging requires a two-machine setup where the debugger runs on one system and the target system being debugged runs on another. This separation is necessary because kernel debugging freezes the entire target system when breakpoints are hit or when you're examining system state. Virtual machines work excellently for this purpose, as you can configure the VM to expose a debugging interface.

Setting up kernel debugging on the target machine requires enabling debug mode through the Boot Configuration Data (BCD):

```powershell
bcdedit /debug on
bcdedit /dbgsettings serial debugport:1 baudrate:115200
```

For virtual machine debugging, you'll typically configure a named pipe or network connection instead of serial. VMware and Hyper-V both support kernel debugging through their virtual hardware. Once configured, WinDbg connects to the target and provides complete kernel-level access.

The debugger must be configured with symbol paths for Windows symbols, which allow WinDbg to resolve function names, structure layouts, and variable names. Microsoft provides public symbols through their symbol server:

```text
.sympath srv*c:\symbols*https://msdl.microsoft.com/download/symbols
.reload
```

Kernel debugging provides unrestricted access because the debugger operates at kernel level, effectively becoming part of the operating system itself. This bypasses all user-mode protections and even most kernel-mode security checks because the debugger has frozen the system and can examine memory directly. From this perspective, even the most protected processes are completely visible.

**Important Note:** When kernel debugging is enabled, PatchGuard (Kernel Patch Protection) is automatically disabled or neutralized, allowing the debugger to inspect and modify kernel structures without triggering bug checks. This is why kernel debugging provides more freedom than loading a kernel driver on a running system, where PatchGuard remains active and will detect unauthorized kernel modifications.

## Real-World Scenarios

### Scenario 1: Incident Response - Blocked Memory Dump

During an incident response engagement, you identify suspicious network connections originating from what appears to be `svchost.exe`. Standard memory forensics tools fail when attempting to dump the process memory for analysis. Process Explorer shows "Access Denied" when trying to create a memory dump, even though you're running as Administrator.

This scenario reveals an important consideration: if a process is showing protection that seems unusual for its type, this could indicate either legitimate system hardening or potentially a rootkit masquerading as a protected process. Sophisticated malware has been known to manipulate process protection levels through kernel exploits to shield itself from analysis. The solution requires either kernel-mode memory acquisition tools or live kernel debugging to capture the suspicious process memory.

### Scenario 2: Malware Analysis - Protection Level Checks

Modern malware increasingly includes protection level checks before attempting credential theft. Sophisticated samples will query the LSASS process protection status before deciding which technique to employ:

```c
// Malware pseudo-code for adaptive credential theft
if (IsLsassProtected()) {
    // PPL is enabled - need kernel exploit or BYOVD
    AttemptKernelExploit();
    if (KernelAccessAcquired) {
        DumpLsassFromKernelMode();
    } else {
        // Fall back to alternative credential sources
        ExtractFromSAM();
        HarvestBrowserCredentials();
    }
} else {
    // Easy mode - direct memory access
    RunMimikatz();
}
```

This adaptive behavior means that simply enabling LSASS PPL can force attackers to reveal themselves through more detectable techniques like driver loading or SAM database access.

### Scenario 3: EDR Evasion Through Process Injection

Red teams often need to inject into processes to evade EDR detection. When attempting to inject into `winlogon.exe` or other protected processes for token theft or credential access, the injection fails with `STATUS_ACCESS_DENIED`. This forces red teams to either target unprotected processes (which may be more heavily monitored) or invest in kernel-level access capabilities.

The protection mechanisms effectively create a "hard target" list that defenders can monitor more lightly, knowing that successful access to these processes requires sophisticated capabilities that generate other detectable artifacts like driver loads or kernel exploits.

## LSASS and Mimikatz: The Exception

Local Security Authority Subsystem Service (`lsass.exe`) represents one of the most targeted processes in Windows environments. As the process responsible for managing security policy, user authentication, and credential storage, LSASS contains the plaintext and hashed credentials that tools like Mimikatz seek to extract. Despite being a critical security process, Mimikatz can often successfully access LSASS memory and dump credentials, which seems contradictory to everything we've discussed about protected processes.

### LSASS Protection Evolution

The history of LSASS protection reveals how Microsoft has gradually hardened this critical component in response to credential theft attacks. In **Windows 7 and 8.0**, LSASS ran as a standard SYSTEM process without any PPL protection. During this era, Mimikatz could trivially access LSASS memory and extract credentials, making post-exploitation credential harvesting almost automatic for attackers.

With **Windows 8.1** in 2013, Microsoft introduced both Credential Guard and PPL protection for LSASS. Credential Guard uses virtualization-based security to isolate credentials in a separate secure environment. When Credential Guard is enabled, sensitive credential material is stored in a virtualization-based security (VBS) protected process called **LSAIso.exe** (LSA Isolated), which runs in a separate Virtual Trust Level (VTL) that even kernel-mode code cannot access without compromising the hypervisor itself. Meanwhile, PPL marks the standard LSASS process as protected, preventing normal processes from accessing it. However, there's a critical caveat: **these protections are not enabled by default** on most systems. Organizations must explicitly configure them through registry settings or Group Policy.

```powershell
# Check if LSASS is running as PPL
Get-Process lsass | Select-Object -Property ProcessName, Protection

# Enable LSASS PPL protection (requires registry edit + reboot)
# HKLM\SYSTEM\CurrentControlSet\Control\Lsa
# RunAsPPL = dword:1
```

**Important Note on Secure Boot:** On systems with Secure Boot enabled, the `RunAsPPL` setting may be stored in UEFI firmware variables, making it significantly more difficult to disable even with administrator access to the registry. This UEFI-backed protection prevents attackers from simply changing the registry value to disable PPL, adding an additional layer of defense.

**Compatibility Considerations:** Enabling LSASS PPL can cause compatibility issues with some third-party authentication providers, password filters, or security tools that attempt to load custom modules into the LSASS process. Only properly signed modules with appropriate certificates are allowed in a PPL-protected LSASS. Organizations should test LSASS PPL in their environment before broad deployment to identify any compatibility problems.

### Why Mimikatz Works

Mimikatz succeeds against unprotected LSASS because of how Windows security boundaries work by default. Most Windows systems, especially those upgraded from older versions or deployed without hardened security baselines, don't enable LSASS PPL protection. This leaves LSASS running as a standard SYSTEM process that can be accessed by other SYSTEM-level processes or users with appropriate privileges.

When Mimikatz runs with SYSTEM privileges (often achieved through tools like PsExec or by exploiting vulnerabilities), it has sufficient access to open handles to the unprotected LSASS process. The SeDebugPrivilege, which administrators and SYSTEM possess, explicitly allows reading memory from processes at the same or lower privilege levels. Mimikatz exploits this by using known memory patterns and structures to locate credential material within LSASS's address space, parsing the data structures that store password hashes, Kerberos tickets, and sometimes even plaintext credentials.

### When Mimikatz Fails

When LSASS runs as PPL (Protected Process Light), Mimikatz encounters the same kernel-enforced barriers we've discussed throughout this article:

```text
mimikatz # privilege::debug
Privilege '20' OK

mimikatz # sekurlsa::logonpasswords
ERROR kuhl_m_sekurlsa_acquireLSA ; Handle on memory (0x00000005)
```

Error code `0x00000005` corresponds to `ACCESS_DENIED`. Despite successfully acquiring SeDebugPrivilege (shown by "Privilege '20' OK"), the kernel refuses to grant a handle with memory-read permissions to the protected LSASS process. This demonstrates that PPL protection operates at a level below traditional Windows privileges; the kernel's process manager evaluates the protection level comparison before checking administrative privileges.

### Bypassing LSASS Protection

While PPL significantly raises the bar for credential theft, determined attackers have several options for bypassing these protections, though each requires substantially more sophistication than running Mimikatz. Loading kernel drivers remains the most direct approach, where attackers either exploit vulnerabilities to load unsigned drivers or abuse legitimate signed drivers through Bring Your Own Vulnerable Driver (BYOVD) attacks. This technique requires kernel-level code execution, which is significantly harder to achieve than user-mode exploitation.

### Bring Your Own Vulnerable Driver (BYOVD) Attacks

BYOVD attacks have become increasingly prevalent in ransomware and advanced persistent threat campaigns. The technique exploits legitimately signed drivers that contain vulnerabilities, allowing attackers to execute arbitrary code in kernel mode without needing a zero-day exploit. Once attackers achieve ring 0 (kernel mode) execution through a vulnerable driver, they can disable or circumvent protections like PPL, directly read protected process memory, or manipulate kernel security structures.

Common vulnerable drivers abused in the wild include:

**RTCore64.sys** (MSI Afterburner) - Contains a critical vulnerability (**CVE-2019-16098**) that allows arbitrary memory read/write primitives, enabling direct physical memory access. Security researchers at Sophos documented multiple ransomware families including RobbinHood and **BlackByte** exploiting this driver to terminate security software, disable PPL protections, and access protected processes like LSASS.

**DBUtil_2_3.sys** (Dell BIOS utility) - Provides memory read/write capabilities and IOCTL misuse vulnerabilities that attackers leverage to disable PPL, bypass security callbacks, and access LSASS. Exploited by advanced persistent threat actors including **Lazarus Group** and the CUBA ransomware group to escalate privileges and evade detection.

**gdrv.sys** (Gigabyte driver) - Offers memory mapping capabilities allowing kernel-mode code execution. Widely abused across multiple attack campaigns due to its prevalence on gaming systems and motherboard utilities.

Academic security research has identified hundreds of legitimately signed drivers with memory corruption vulnerabilities, IOCTL handling flaws, or insufficient input validation that remain exploitable for BYOVD attacks, creating a persistent challenge for defenders.

**Defensive Mitigations:**

Microsoft maintains a **Vulnerable Driver Blocklist** that Windows uses to prevent loading of known vulnerable drivers. This blocklist is updated through Windows security updates and is enforced more strongly when **HVCI (Hypervisor-protected Code Integrity)** is enabled. With HVCI active, the hypervisor validates driver integrity before loading, making it significantly harder for attackers to load blocklisted drivers even with administrative privileges.

However, blocklist effectiveness depends on systems receiving regular Windows updates, and many organizations lag behind in applying these updates. According to **CISA (Cybersecurity and Infrastructure Security Agency)** guidance, defenders should implement multiple layers of protection:

- **Monitor driver load events** - Kernel-mode drivers being loaded that are not part of a trusted baseline represent a critical detection opportunity. Sysmon Event ID 6 and Windows Event ID 7045 provide visibility into driver installations.
- **Enable HVCI** - Hypervisor-protected Code Integrity significantly strengthens blocklist enforcement and prevents many driver-based attacks
- **Maintain driver allowlists** - Organizations should maintain inventories of legitimate drivers in their environment and alert on any deviations
- **Keep systems updated** - Regular Windows updates ensure the vulnerable driver blocklist includes the latest known malicious drivers
- **Implement EDR with driver monitoring** - Modern EDR solutions can detect and block suspicious driver load attempts in real-time

Credential Guard bypass techniques target vulnerabilities in virtualization-based security itself, attempting to compromise the hypervisor or exploit weaknesses in how Credential Guard communicates with LSASS. These attacks are complex and often require multiple chained vulnerabilities. Alternative credential extraction targets include the Security Account Manager (SAM) database, NTDS.dit on domain controllers, credential managers, and cached domain credentials, each requiring different attack techniques but potentially yielding valuable credentials without touching protected LSASS.

Bootkit and UEFI malware represent the most sophisticated bypass, compromising the system before Windows even loads its protection mechanisms. By operating at the firmware level, these attacks can disable or circumvent PPL before LSASS starts. However, developing and deploying such malware requires significant resources and expertise, typically placing it in the realm of nation-state actors rather than common criminals.

## Comparison of Inspection Tools

| Tool | Access Level | Protected Processes | Kernel Driver | Live Debugging |
|------|--------------|---------------------|---------------|----------------|
| Process Explorer | User Mode | Limited | No | No |
| Process Hacker | Kernel Mode | Full* | Yes | No |
| WinDbg (Local) | User Mode | Limited | No | Yes |
| WinDbg (Kernel) | Kernel Mode | Full | N/A | Yes |
| Task Manager | User Mode | Very Limited | No | No |

\*Requires kernel driver to be loaded and signed

## Security Implications

Understanding protected processes has profound implications for how we approach system security, both from defensive and offensive perspectives. The existence of these protections fundamentally changes the attack surface and the techniques required for successful system compromise.

### For Defenders

Defensive security teams must actively enable and validate protected process configurations rather than assuming they're in place. Ensuring LSASS PPL and Credential Guard are enabled across enterprise systems should be a baseline security requirement, verified through automated configuration management and regular audits. These protections don't enable themselves, and many organizations run vulnerable configurations simply because they haven't explicitly hardened their systems.

Monitoring kernel driver loads represents a critical detection opportunity because bypassing PPL almost always requires kernel-mode access. Security teams should implement alerting on driver load events, especially for drivers that aren't part of the standard system image or signed by well-known vendors. Investigating unsigned drivers or those signed with suspicious certificates can reveal advanced attacks in progress. Process access auditing can detect reconnaissance activities where attackers probe for protection levels before launching attacks, and application whitelisting controls what processes can execute in the first place, reducing the attack surface available to adversaries.

### For Attackers (Red Teams)

Red teams conducting authorized assessments must understand protection levels before planning their attacks. Modern penetration testing requires reconnaissance of which processes are protected, as this determines what techniques will work and what will trigger detections. Checking protection levels early in an engagement prevents wasted effort on techniques that are doomed to fail against hardened systems.

Identifying alternative credential storage locations becomes essential when LSASS is protected. Red teams should understand how to extract credentials from registry hives, memory of less-protected processes, network authentication traffic, and cached data structures. Kernel exploits may be necessary to bypass modern protections in fully hardened environments, though this significantly increases the sophistication required and the risk of system instability. Bring Your Own Vulnerable Driver (BYOVD) attacks leverage legitimate signed drivers with vulnerabilities, allowing kernel-level access without requiring zero-day exploits.

### For Security Researchers

Researchers analyzing protected processes must establish proper isolated environments to avoid accidentally triggering security alerts or violating usage agreements. Using dedicated VMs with snapshots allows safe experimentation without risking production systems. Test signing mode enables loading custom drivers for research purposes, though it weakens overall system security and should only be used in isolated research environments.

Kernel debugging setups provide the deepest level of analysis for understanding protection mechanisms and potential vulnerabilities. Researchers should invest time in properly configuring kernel debugging environments with symbol support, as this enables detailed investigation of how protection mechanisms work at the code level. Responsible disclosure of vulnerabilities discovered in protection mechanisms ensures that Microsoft and the security community can address issues before they're exploited maliciously.

## Detection and Monitoring

Detecting attempts to access or bypass protected processes provides early warning of sophisticated attacks. Modern security monitoring should include specific detection rules for protected process tampering.

### Key Event IDs to Monitor

**Windows Security Event Log:**
- **Event ID 4656**: Handle to an object was requested - Monitor for handle requests to LSASS or other protected processes (shows the request attempt)
- **Event ID 4663**: An attempt was made to access an object - Tracks actual access operations, but requires SACL (System Access Control List) to be configured on the target object
- **Event ID 4672**: Special privileges assigned to new logon - Detects when SeDebugPrivilege and other sensitive privileges are assigned at logon
- **Event ID 4673**: A privileged service was called - Monitors use of privileged API/service calls (not specific to SeDebugPrivilege)

**System Event Log:**
- **Event ID 7045**: A service was installed in the system - New driver installations that could indicate BYOVD attacks
- **Sysmon Event ID 6**: Driver loaded - Use Sysmon for reliable driver load telemetry (not Windows Event ID 219, which indicates driver load failures)

### Sysmon Configuration

Sysmon provides detailed telemetry for protected process monitoring. Key events to configure:

```xml
<Sysmon schemaversion="4.90">
  <EventFiltering>
    <!-- Driver Load Detection (Event ID 6) -->
    <!-- Exclude Microsoft-signed drivers, capture everything else -->
    <DriverLoad onmatch="exclude">
      <Signature condition="is">Microsoft Windows</Signature>
      <Signature condition="is">Microsoft Corporation</Signature>
    </DriverLoad>
    
    <!-- Drivers from suspicious paths -->
    <DriverLoad onmatch="include">
      <ImageLoaded condition="begin with">C:\Users</ImageLoaded>
      <ImageLoaded condition="begin with">C:\Temp</ImageLoaded>
      <ImageLoaded condition="begin with">C:\ProgramData</ImageLoaded>
      <ImageLoaded condition="contains">\AppData\</ImageLoaded>
    </DriverLoad>
    
    <!-- Process Access to LSASS (Event ID 10) -->
    <ProcessAccess onmatch="include">
      <TargetImage condition="end with">lsass.exe</TargetImage>
      <!-- PROCESS_VM_READ (0x0010) -->
      <GrantedAccess condition="contains">10</GrantedAccess>
      <!-- PROCESS_VM_WRITE (0x0020) -->
      <GrantedAccess condition="contains">20</GrantedAccess>
      <!-- PROCESS_VM_OPERATION (0x0008) -->
      <GrantedAccess condition="contains">08</GrantedAccess>
    </ProcessAccess>
    
    <!-- Process Access to other critical protected processes -->
    <ProcessAccess onmatch="include">
      <TargetImage condition="end with">winlogon.exe</TargetImage>
      <TargetImage condition="end with">lsaiso.exe</TargetImage>
      <GrantedAccess condition="contains">10</GrantedAccess>
      <GrantedAccess condition="contains">20</GrantedAccess>
    </ProcessAccess>
  </EventFiltering>
</Sysmon>
```

**Note on LSASS monitoring:** LSASS is frequently accessed by legitimate processes. Filter on suspicious source processes or correlate with other indicators. Monitoring csrss.exe access generates excessive noise and is not recommended unless you have a specific use case.

### EDR Telemetry Indicators

Modern EDR solutions should alert on:

**Suspicious Process Handle Operations** - Repeated failed attempts to open handles to protected processes, especially with `PROCESS_VM_READ` or `PROCESS_VM_WRITE` access rights.

**Unusual Driver Load Patterns** - Drivers loaded from user-writable directories, drivers not part of the standard system image, or drivers with unusual signing certificates.

**Protection Level Modification Attempts** - Though rare and requiring kernel access, attempts to modify the protection level of running processes indicate advanced attack techniques.

**SeDebugPrivilege Escalation** - Processes acquiring debug privileges that don't typically need them, especially when followed by process access attempts.

### PowerShell Monitoring Script

```powershell
# Audit all running processes for their protection levels
function Get-ProcessProtectionStatus {
    Get-Process | Select-Object Name, Id, @{
        Name='Protection'
        Expression={
            try {
                $_.Protection
            } catch {
                "Unable to query"
            }
        }
    } | Where-Object {$_.Protection -ne "None" -and $_.Protection -ne "Unable to query"} |
    Sort-Object Protection | 
    Format-Table -AutoSize
}

# Monitor for new driver loads
function Watch-DriverLoads {
    $query = @"
    <QueryList>
      <Query Id="0" Path="System">
        <Select Path="System">*[System[Provider[@Name='Service Control Manager'] and (EventID=7045)]]
        </Select>
      </Query>
    </QueryList>
"@
    
    Register-WmiEvent -Query "SELECT * FROM __InstanceCreationEvent WITHIN 5 WHERE TargetInstance ISA 'Win32_SystemDriver'" -Action {
        $driver = $Event.SourceEventArgs.NewEvent.TargetInstance
        Write-Host "New driver loaded: $($driver.Name) from $($driver.PathName)" -ForegroundColor Yellow
    }
}

# Check LSASS protection status across domain
function Test-LsassProtection {
    param([string[]]$ComputerName)
    
    Invoke-Command -ComputerName $ComputerName -ScriptBlock {
        $protection = Get-Process lsass | Select-Object -ExpandProperty Protection
        $regValue = Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "RunAsPPL" -ErrorAction SilentlyContinue
        
        [PSCustomObject]@{
            Computer = $env:COMPUTERNAME
            ProcessProtection = $protection
            RegistryEnabled = $regValue.RunAsPPL -eq 1
            Vulnerable = ($protection -eq "None" -or $null -eq $protection)
        }
    } | Format-Table -AutoSize
}
```

## Practical Exercises

### Exercise 1: Compare Tool Capabilities

This exercise helps you understand the practical differences between user-mode and kernel-mode inspection tools. Start by running Process Explorer as Administrator and attempting to view detailed information about `csrss.exe` and `lsass.exe`. Document which information you can successfully retrieve and which operations are denied with access errors. Pay particular attention to memory views, handle information, and thread details.

Next, install Process Hacker from its official repository and enable the kernel driver through the options menu. **Important:** The KProcessHacker driver may not load on systems with Secure Boot enabled or strict driver signature enforcement unless you disable Secure Boot or enable test signing mode (`bcdedit /set testsigning on`). Both options reduce system security and may trigger alerts in enterprise environments with EDR deployed. Only proceed on isolated test systems where security policy violations are acceptable. Attempt the same inspections you tried with Process Explorer. Compare the level of detail you can now access, noting specifically what the kernel driver enables that was previously blocked. This hands-on comparison demonstrates the fundamental difference between user-mode and kernel-mode access to protected processes, while also illustrating the real-world constraints that driver signature enforcement imposes.

### Exercise 2: Check LSASS Protection Status

Understanding whether LSASS is running with PPL protection is essential for assessing your system's security posture. Use PowerShell to query the LSASS process and examine its protection level. The Protection property will reveal whether PPL is active or if LSASS is running unprotected.

```powershell
# Check current LSASS protection status
Get-Process lsass | Select-Object Name, Id, Path, @{
    Name='Protection'
    Expression={$_.Protection}
}

# Check registry setting
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa" -Name "RunAsPPL" -ErrorAction SilentlyContinue

# Query protection level programmatically via WMI
Get-CimInstance -ClassName Win32_Process -Filter "Name='lsass.exe'" | 
    Select-Object ProcessId, @{Name='ProtectionLevel';Expression={
        (Get-Process -Id $_.ProcessId).Protection
    }}
```

If the registry value `RunAsPPL` is absent or set to 0, LSASS **may** be vulnerable to credential theft tools like Mimikatz, though absence of the registry setting doesn't guarantee LSASS is unprotected; some systems use firmware/UEFI variables or Group Policy to enable PPL. Compare the protection status across different Windows versions and deployment methods if you have access to multiple test systems. **Important:** Protection status varies significantly based on OS version (Windows 10 vs 11), installation method (clean install vs upgrade), hardware capabilities (TPM 2.0, UEFI), licensing (Enterprise vs Pro), and organizational security policies. Don't assume PPL is enabled just because the system is running Windows 10 or 11—explicit verification is essential.

### Exercise 3: Kernel Debugging Setup

Setting up a kernel debugging environment provides the most complete view of protected processes available. **Prerequisites:** You need two separate machines or VMs; one as the debug target and one as the debugger host. The target system must support your chosen debug transport (serial/COM port, network debugging, USB, or 1394). Both systems need compatible Windows versions and WinDbg installed on the debugger machine.

Begin by creating a Windows VM that will serve as your debug target. Configure a second VM or use your host system as the debugger machine with WinDbg installed. Connect the two systems using the appropriate debug transport—serial over named pipe for VMware, or network debugging for Hyper-V and physical machines.

On the target VM, enable kernel debugging through bcdedit and configure the debug settings to match your transport method:

```powershell
# For network debugging (Hyper-V, physical machines)
bcdedit /debug on
bcdedit /dbgsettings net hostip:<debugger_ip> port:50000

# For serial debugging (VMware with named pipe)
bcdedit /debug on
bcdedit /dbgsettings serial debugport:1 baudrate:115200
```

**Critical Warning:** When kernel debugging is active, the target system will **freeze completely** whenever WinDbg hits a breakpoint or when you manually break into the debugger. The entire OS halts, no UI updates, no network traffic, no disk I/O. This is normal behavior for kernel debugging but can be confusing if you're not expecting it. Additionally, kernel debugging disables PatchGuard, weakens security protections, and may cause performance degradation. Never enable kernel debugging on production systems.

Reboot the target and connect from WinDbg on the debugger machine. Once connected, configure symbol paths to Microsoft's symbol server so WinDbg can resolve Windows functions and structures:

```text
.sympath srv*c:\symbols*https://msdl.microsoft.com/download/symbols
.reload
```

Symbol downloads can take significant time on first connection (several minutes to hours depending on your internet connection), so be patient. Use the `!process` command to inspect protected processes like `csrss.exe` and `lsass.exe`, comparing the kernel-level view with what user-mode tools showed you. This exercise demonstrates the ultimate level of system visibility that kernel debugging provides, while also revealing why it's reserved for advanced analysis scenarios rather than everyday troubleshooting.

## Best Practices for Process Inspection

When conducting process inspection and analysis, selecting the appropriate tool for your access level and objectives is fundamental. Process Explorer works excellently for general process management and basic analysis tasks that don't require bypassing protection mechanisms. For deeper inspection of protected processes, Process Hacker with its kernel driver provides enhanced capabilities while remaining more accessible than full kernel debugging though be aware that its kernel driver may not load on systems with Secure Boot enabled or strict driver signature enforcement, and its use may trigger security alerts in enterprise environments with EDR deployed. WinDbg kernel debugging should be reserved for the most detailed analysis where you need complete visibility into kernel structures and protected process internals.

Understanding each tool's limitations prevents frustration and helps you choose the right approach for your investigation. Process Explorer's inability to access certain protected process details isn't a bug, it's the Windows security model working as designed. Recognizing when you need kernel-mode access helps you escalate to appropriate tools rather than attempting impossible operations with inadequate tools.

Documentation becomes increasingly important as you work with complex system internals. Detailed notes about process protection levels, handle access patterns, and tool capabilities create a knowledge base for future investigations. Screenshotting error messages, protection status indicators, and successful inspection results provides visual documentation that's easier to reference than trying to remember specific behaviors.

Respecting protection mechanisms and authorization boundaries is both a legal and ethical requirement. Bypassing protected process restrictions without proper authorization can violate computer fraud laws, even on systems you own if those systems are subject to regulatory requirements. Organizational policies, penetration testing rules of engagement, and responsible disclosure guidelines all provide frameworks for when and how to conduct protected process analysis.

Staying updated on protection mechanism evolution ensures your understanding remains current. Microsoft continually refines PPL, Credential Guard, and related protections with each Windows version and major update. New signer types, changes to the protection hierarchy, and additional kernel enforcement mechanisms can change what's possible with existing tools. Following Windows Internals researchers, security blogs, and Microsoft documentation helps you maintain accurate knowledge of the current protection landscape.

## System Hardening Checklist

For defenders implementing protected process security across their environment:

### Critical Protections
- [ ] **Enable LSASS PPL** - Set `HKLM\SYSTEM\CurrentControlSet\Control\Lsa\RunAsPPL` to `1` (requires compatible hardware and OS; test for compatibility with third-party authentication providers before enterprise deployment)
- [ ] **Enable Credential Guard** - Configure via Group Policy or UEFI settings on compatible hardware (Windows 11 22H2+ with VBS-capable hardware may enable by default on fresh installs)
- [ ] **Enable Hypervisor-Protected Code Integrity (HVCI)** - Prevents unsigned code execution in kernel (enabled by default on Windows 11 fresh installs with compatible hardware)
- [ ] **Configure Vulnerable Driver Blocklist** - Ensure Windows updates include latest driver blocks and HVCI is enabled for stronger enforcement
- [ ] **Enable Memory Integrity** - Additional VBS protection layer (default on Windows 11 fresh installs)

### Monitoring and Detection
- [ ] **Deploy Sysmon** - Configure with protected process and driver load monitoring rules
- [ ] **Configure Security Event Collection** - Forward Event IDs 4656, 4663, 4673 to SIEM
- [ ] **Enable Process Access Auditing** - Track handle requests to sensitive processes
- [ ] **Monitor Driver Loads** - Alert on drivers from non-standard locations
- [ ] **Implement EDR** - Deploy endpoint detection with kernel visibility

### Policy Enforcement
- [ ] **Configure Driver Signature Enforcement** - Prevent unsigned driver loading
- [ ] **Enable Secure Boot** - Prevent bootkit attacks on compatible hardware
- [ ] **Disable Test Signing Mode** - Ensure production systems reject test-signed drivers
- [ ] **Application Control** - Implement Windows Defender Application Control (WDAC)
- [ ] **Least Privilege** - Limit accounts with SeDebugPrivilege

### Validation and Testing
- [ ] **Audit Current Protection Levels** - Verify which processes are actually protected
- [ ] **Test Credential Theft Tools** - Validate Mimikatz fails against LSASS
- [ ] **Review Driver Inventory** - Document all legitimate drivers in environment
- [ ] **Penetration Test** - Include protected process bypass in scope
- [ ] **Regular Compliance Checks** - Automated scanning for protection configuration

## Windows 11 and Modern Security Defaults

Windows 11 represents a significant shift in default security postures, with Microsoft making virtualization-based security features enabled by default **on fresh installations with compatible hardware**. The actual protection status varies significantly based on installation method, hardware capabilities, licensing, and organizational policies.

**Virtualization-Based Security (VBS)** runs by default on **new Windows 11 clean installations** on systems with compatible hardware (TPM 2.0, UEFI with Secure Boot, virtualization extensions). This creates a hypervisor-isolated environment for security-critical operations. This fundamentally changes the threat model because even kernel-mode code cannot access VBS-protected memory without exploiting the hypervisor itself. **Critical caveat:** Upgrades from Windows 10 to Windows 11 do **not** automatically enable VBS; organizations must explicitly enable it post-upgrade.

**Memory Integrity (HVCI)** is enabled by default **on clean installs of Windows 11** with compatible hardware, preventing unsigned or improperly signed code from executing in kernel mode. Microsoft documentation states: "Memory integrity is turned on by default on clean installs of Windows 11." This directly counters BYOVD attacks by blocking vulnerable drivers from loading, even if attackers have administrative privileges. The impact on legacy driver compatibility means some older software may require compatibility testing. **Upgrades from Windows 10 may not enable HVCI automatically**, requiring manual configuration validation.

**Credential Guard** availability depends on multiple factors. According to Microsoft, "All devices running Windows 11, version 22H2 or later will have Credential Guard enabled by default...if they meet the hardware, licensing, and software requirements." The requirements include VBS-capable hardware, Windows 11 Enterprise or Education editions (not Pro), TPM 2.0, and UEFI with Secure Boot. Even when these conditions are met, organizations should validate that Credential Guard is actually active rather than assuming it's enabled. When active, Credential Guard moves credential storage into a VBS-protected virtual trust level (VTL) that even kernel code cannot access.

**Secured-core PC** requirements in enterprise environments mandate these protections remain enabled and tamper-resistant. Systems certified as Secured-core PCs include additional firmware protections that prevent disabling security features even with physical access. These represent the highest security tier but are typically deployed only in high-security environments.

**Real-world protection status varies significantly:** Windows 11 systems deployed via **fresh installation** on modern hardware (2020+) with TPM 2.0 and Enterprise/Education licensing will have the strongest default protections. Systems **upgraded from Windows 10**, using **Pro licensing**, or running on **older hardware** will likely require explicit configuration to achieve the same protection levels. Organizations should audit their Windows 11 deployments to verify actual protection status rather than assuming defaults are in place, using the PowerShell scripts provided in the Detection and Monitoring section to validate VBS, HVCI, Credential Guard, and LSASS PPL status across their environment.

## Conclusion

Windows protected processes represent a critical security boundary that even administrators cannot easily cross. While tools like Process Explorer provide excellent visibility into most processes, protected processes require specialized approaches, either kernel drivers like those used by Process Hacker, or full kernel debugging with WinDbg. This architectural decision by Microsoft fundamentally changed the Windows security model, moving certain protections below the traditional privilege hierarchy where even administrative access cannot override them.

Understanding these protections proves essential across multiple security roles. Security researchers analyzing malware behavior need to understand when and why their analysis tools fail against protected processes, and what techniques malware might use to bypass these protections. System administrators troubleshooting system issues must recognize the difference between legitimate access restrictions and actual problems, avoiding wasted time attempting operations that the kernel will never allow. Red teams assessing organizational security posture require knowledge of protection levels to plan realistic attacks and understand what techniques modern defenses can detect or prevent. Blue teams implementing and validating security controls must verify that protections are actually enabled rather than assuming they're active by default.

The evolution from completely unprotected processes in early Windows versions to the sophisticated PPL and Credential Guard implementations in modern Windows demonstrates Microsoft's ongoing commitment to raising the security bar. Each enhancement forces attackers to invest in more sophisticated techniques, moving from simple user-mode memory reading to kernel exploits, signed driver abuse, and even firmware-level compromises. This arms race continues as defenders harden systems and attackers develop new bypass techniques, making the continuous study of protected processes relevant for anyone involved in Windows security.

As we've seen throughout this series, the combination of proper configuration, monitoring, and understanding of these mechanisms provides a robust defense-in-depth strategy against credential theft and system compromise.

## References and Further Reading

- [Windows Internals, Part 1 (7th Edition)](https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals) - Pavel Yosifovich, Mark Russinovich, David Solomon, Alex Ionescu
- [Sysinternals Process Explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer) - Official documentation
- [Process Hacker](https://processhacker.sourceforge.io/) - Open-source advanced process viewer
- [Protected Processes Part 1: Pass-the-Hash Mitigations in Windows 8.1](https://www.alex-ionescu.com/?p=97) - Alex Ionescu
- [Credential Guard Documentation](https://docs.microsoft.com/en-us/windows/security/identity-protection/credential-guard/) - Microsoft
- [WinDbg Documentation](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/) - Microsoft

---

*Remember: These techniques should only be used for authorized security research, legitimate penetration testing, or educational purposes. Unauthorized access to computer systems is illegal.*

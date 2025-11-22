---
title: "Windows Protected Processes Series: Part 1"
description: "Part 1 of the Windows Protected Processes series. Learn about protected processes, Process Explorer limitations, and why even administrators can't access critical system processes like CSRSS and LSASS."
date: "2025-11-22"
author: "Mohamed Habib Jaouadi"
tags: ["windows-protected-processes-series", "windows-internals", "process-inspection", "sysinternals", "security-research", "protected-processes"]
banner: "/banners/posts/windows-protected-processes-inspection.png"
bannerAlt: "Windows Protected Processes - Security Analysis and Inspection Tools"
visibility: "public"
series: "Windows Protected Processes Series"
seriesOrder: 1
---

> **⚠️ Educational Purpose:** This content is for educational and authorized security research only. Process inspection and debugging should only be performed on systems you own or have explicit permission to analyze.

## Introduction

Windows operating systems implement various security mechanisms to protect critical processes from tampering and inspection. Understanding these protections and the tools available to work with them is essential for security researchers, malware analysts, and system administrators. 

This series explores process inspection tools, protected processes, and the techniques used to analyze even the most restricted system components. In Part 1, we'll cover the fundamentals of process inspection with Process Explorer, understand the protected process model, and examine why even administrators face restrictions when inspecting critical system processes.

## Process Explorer: The Standard Tool

Process Explorer from Sysinternals is one of the most powerful and widely-used tools for inspecting running processes on Windows systems. Originally created by Mark Russinovich before Microsoft's acquisition of Sysinternals in 2006, it has become the de facto standard for process inspection in the Windows ecosystem. The tool provides comprehensive visibility into process hierarchies, showing parent-child relationships in a tree structure that makes it easy to trace how processes spawn and interact with each other.

Beyond simple process listings, Process Explorer reveals the internal workings of each process by displaying loaded DLL dependencies and modules, providing detailed handle information for files, registry keys, and threads, showing real-time memory usage and performance metrics, tracking network connections and TCP/IP endpoints, and exposing security context and token information that reveals the privileges each process operates with.

### Basic Usage

Process Explorer displays processes in a tree structure, showing the relationship between parent and child processes. You can view detailed information by double-clicking any process, which opens a comprehensive properties dialog showing everything from command-line arguments to environment variables.

```powershell
# Download Process Explorer from Sysinternals
# Don't forget to run as Administrator to have access to full functionality
procexp.exe
```

When running with administrative privileges, Process Explorer can access most processes and display comprehensive information about their state, memory usage, and internal operations. However, even Administrator privileges have limitations when encountering certain protected processes, revealing a fundamental security boundary that Windows enforces at the kernel level.

## The Protected Process Model

Windows implements a protected process mechanism to safeguard critical system processes from tampering, even by administrators. This protection mechanism has evolved significantly since its introduction, with Microsoft continually refining the security model to address emerging threats.

### Historical Evolution

The protected process model was first introduced in **Windows Vista (released January 2007)** as part of the Premium Content Protection requirements for digital rights management (DRM). This initial implementation, known as Protected Process (PP), was designed specifically to prevent unauthorized access to processes handling premium media content like HD-DVD and Blu-ray playback. The protection prevented even administrators from reading process memory or injecting code into these DRM-protected processes.

A significant architectural change came with **Windows 8.1 (released October 2013)**, which introduced Protected Process Light (PPL) as a distinct protection level. Unlike the original PP designed solely for DRM scenarios, PPL provided a more flexible protection mechanism that extended to critical system services. This allowed Microsoft to protect essential operating system components like LSASS, antimalware services, and other security-critical processes without requiring the strict DRM-level protections of full PP. This was a crucial development that enabled hardening credential storage and authentication processes against the increasingly common credential theft attacks.

With **Windows 10 and later versions**, Microsoft expanded the PPL model with multiple protection signers and refined access rules, creating a sophisticated hierarchy that balances security requirements with operational functionality. This evolution reflected the changing threat landscape, where sophisticated attackers increasingly targeted system processes to steal credentials, maintain persistence, and evade detection.

### Why Protected Processes Exist

Protected processes serve several critical security purposes that address real-world attack patterns. The anti-tampering protection prevents malware from injecting malicious code into critical system processes, a technique that advanced threats commonly use to hide their presence and elevate their privileges. By blocking code injection, memory manipulation, and unauthorized debugging at the user-mode level, protected processes significantly raise the bar for attackers, though it's important to note that PPL is not a silver bullet as kernel-mode attacks via vulnerable drivers or exploits can still potentially bypass these protections.

Digital rights management requirements drove the initial implementation for media content protection, but the security benefits extended far beyond DRM when PPL was introduced. System integrity assurances help ensure that core operating system components remain unmodified during runtime, making it substantially harder for rootkits and sophisticated malware to compromise fundamental Windows services through conventional user-mode techniques. Perhaps most critically for modern security, credential protection safeguards authentication processes and secrets stored in memory, directly addressing the epidemic of credential theft that tools like Mimikatz made trivially easy against unprotected LSASS processes.

### Protection Levels and Signers

Windows defines a sophisticated hierarchy of protection levels that determines what operations can be performed on protected processes. Understanding this hierarchy is essential for security researchers and defenders because it dictates the access boundaries that user-mode code must respect. While kernel-mode code with sufficient privileges can technically bypass some protections, mechanisms like Driver Signature Enforcement and HVCI make this increasingly difficult.

**Protection Types:**

The `PS_PROTECTED_TYPE` enumeration defines three protection levels: **PsProtectedTypeNone (0)** represents standard unprotected processes that operate with traditional Windows security boundaries. **PsProtectedTypeProtectedLight (1)** provides lighter protection suitable for critical system services and antimalware solutions, balancing security with operational flexibility. **PsProtectedTypeProtected (2)** offers the strongest protection, originally designed for DRM scenarios but used for the most critical system components.

**Protection Signers Hierarchy:**

The signer hierarchy creates a chain of trust where processes with higher-level signers can access processes protected by lower-level signers, but not vice versa. Access enforcement is implemented through the kernel's `RtlTestProtectedAccess` function, which compares the protection type and signer of both the requesting and target processes. A process can only open another protected process if its signer level is greater than or equal to the target's signer level.

From lowest to highest signer level:
- **PsProtectedSignerAuthenticode (1)** - Standard Authenticode-signed processes
- **PsProtectedSignerCodeGen (2)** - Code generation processes
- **PsProtectedSignerAntimalware (3)** - Registered antimalware vendors with special Extended Key Usage (EKU) certificates from Microsoft
- **PsProtectedSignerLsa (4)** - Local Security Authority processes (lsass.exe) when PPL is enabled
- **PsProtectedSignerWindows (5)** - Standard Windows system processes
- **PsProtectedSignerWinTcb (6)** - Windows Trusted Computing Base components
- **PsProtectedSignerWinSystem (7)** - Windows system services (highest protection level)

The `PS_PROTECTION` structure also includes an Audit bit that determines whether failed access attempts generate audit events, providing visibility into unauthorized access attempts against protected processes.

```c
// Protection levels from Windows kernel structures
// Inspect in WinDbg with: dt nt!_PS_PROTECTED_TYPE
typedef enum _PS_PROTECTED_TYPE {
    PsProtectedTypeNone = 0,
    PsProtectedTypeProtectedLight = 1,
    PsProtectedTypeProtected = 2,
    PsProtectedTypeMax = 3
} PS_PROTECTED_TYPE;

// Inspect in WinDbg with: dt nt!_PS_PROTECTED_SIGNER
typedef enum _PS_PROTECTED_SIGNER {
    PsProtectedSignerNone = 0,
    PsProtectedSignerAuthenticode = 1,
    PsProtectedSignerCodeGen = 2,
    PsProtectedSignerAntimalware = 3,
    PsProtectedSignerLsa = 4,
    PsProtectedSignerWindows = 5,
    PsProtectedSignerWinTcb = 6,
    PsProtectedSignerWinSystem = 7,
    PsProtectedSignerApp = 8,
    PsProtectedSignerMax = 9
} PS_PROTECTED_SIGNER;

// PS_PROTECTION structure combines Type, Audit flag, and Signer
// Inspect in WinDbg with: dt nt!_PS_PROTECTION
typedef struct _PS_PROTECTION {
    union {
        UCHAR Level;
        struct {
            UCHAR Type : 3;      // PS_PROTECTED_TYPE
            UCHAR Audit : 1;     // Audit flag for access attempts
            UCHAR Signer : 4;    // PS_PROTECTED_SIGNER
        };
    };
} PS_PROTECTION;
```

You can inspect these structures directly in WinDbg during kernel debugging:

```text
kd> dt nt!_PS_PROTECTED_TYPE
   PsProtectedTypeNone = 0n0
   PsProtectedTypeProtectedLight = 0n1
   PsProtectedTypeProtected = 0n2
   PsProtectedTypeMax = 0n3

kd> dt nt!_PS_PROTECTED_SIGNER
   PsProtectedSignerNone = 0n0
   PsProtectedSignerAuthenticode = 0n1
   PsProtectedSignerCodeGen = 0n2
   PsProtectedSignerAntimalware = 0n3
   PsProtectedSignerLsa = 0n4
   PsProtectedSignerWindows = 0n5
   PsProtectedSignerWinTcb = 0n6
   PsProtectedSignerWinSystem = 0n7
   PsProtectedSignerApp = 0n8
   PsProtectedSignerMax = 0n9

kd> dt nt!_PS_PROTECTION
   +0x000 Level            : UChar
   +0x000 Type             : Pos 0, 3 Bits
   +0x000 Audit            : Pos 3, 1 Bit
   +0x000 Signer           : Pos 4, 4 Bits
```

The combination of protection type and signer determines the effective protection level. For example, a process protected as `PsProtectedTypeProtectedLight` with signer `PsProtectedSignerLsa` would be LSASS running with PPL enabled. According to the access rules enforced by `RtlTestProtectedAccess`, this process can be accessed by processes with Antimalware signer (3) or higher (Lsa=4, Windows=5, WinTcb=6, WinSystem=7), but not by standard Authenticode-signed processes (1) or CodeGen processes (2).

### Common Protected Processes in Windows

Understanding which processes typically run with protection helps you recognize what's normal in your environment and what might indicate tampering or misconfiguration.

| Process | Default Protection | Signer | Primary Function | Criticality |
|---------|-------------------|--------|------------------|-------------|
| `smss.exe` | Varies* | Windows/WinTcb | Session Manager Subsystem | Critical - First user-mode process |
| `csrss.exe` | PPL | Windows | Client Server Runtime | Critical - Console and process management |
| `wininit.exe` | PPL | Windows | Windows Initialization | Critical - Starts system services |
| `services.exe` | PPL | WinTcb | Service Control Manager | Critical - Manages all services |
| `lsass.exe` | PPL** | Lsa | Local Security Authority | Critical - Credential storage |
| `winlogon.exe` | PPL | Windows | Windows Logon Manager | Critical - User authentication |
| `MsMpEng.exe` | PPL | Antimalware | Windows Defender | High - Antimalware protection |
| `SgrmBroker.exe` | PPL | Windows | System Guard Runtime Monitor | High - Virtualization-based security |

**Important Notes:**

\* `smss.exe` protection varies by Windows version and configuration. Public documentation on its exact protection level is limited, and it may not always run as full PP.

\*\* LSASS PPL protection must be **explicitly enabled** through the `RunAsPPL` registry setting (`HKLM\SYSTEM\CurrentControlSet\Control\Lsa\RunAsPPL = 1`) or Credential Guard. **By default on most systems, LSASS runs unprotected**, leaving credentials vulnerable to tools like Mimikatz. Windows 11 with VBS may enable this by default on some configurations.

\*\*\* Process protection levels can be verified using: `Get-Process <name> | Select-Object Name, Protection` in PowerShell, or by querying `PROCESS_PROTECTION_LEVEL_INFORMATION` via `NtQueryInformationProcess`, or by inspecting the `PS_PROTECTION` field in the `EPROCESS` structure via kernel debugging.

\*\*\*\* Important distinction: A PPL process can access another PPL process only if its signer level is greater than or equal to the target's signer. However, a PPL process **cannot** obtain full access to a full Protected Process (PP), regardless of signer level. PP provides stronger isolation than PPL.

\*\*\*\*\* **GUI/Interactive Window Constraint:** Processes with graphical user interfaces or interactive windows generally cannot use PPL protection due to kernel constraints around window management and user input. PPL is typically reserved for background services and system processes without UI components.

## Case Study: CSRSS.exe

The Client Server Runtime Subsystem (`csrss.exe`) serves as an excellent example of a protected process in action. CSRSS is absolutely critical to Windows operation, dating back to the earliest versions of Windows NT. It manages Win32 console windows and handles the infrastructure that allows command-line programs to run. Beyond console management, CSRSS oversees process and thread creation and deletion, maintaining the kernel-mode structures that track running processes. It even retains some legacy responsibilities for 16-bit virtual DOS machine support and coordinates system shutdown procedures.

The criticality of CSRSS cannot be overstated. The Windows kernel marks CSRSS as a critical process (via `RtlSetProcessIsCritical`), which means if csrss.exe terminates for any reason, whether through a crash, termination attempt or exploit, the kernel immediately triggers a bug check (STOP error/blue screen) because the operating system cannot function without it. This critical process marking, combined with PPL protection, makes CSRSS an attractive target for attackers who want to hide malicious code or manipulate system behavior, which is precisely why Microsoft protects it with multiple defensive layers.

### Limitations of Process Explorer with CSRSS

Even when running Process Explorer with Administrator privileges, you'll encounter significant limitations when attempting to inspect `csrss.exe`. The tool cannot retrieve full process information beyond basic details like process ID and creation time. Attempts to read process memory contents fail with access denied errors. Handle information remains restricted, preventing you from seeing what files, registry keys, or other objects CSRSS has open. DLL injection operations fail completely, making it impossible to use injection-based analysis techniques. Even basic operations like viewing complete thread information or suspending threads for analysis are blocked by the kernel.

```text
Error: Access is denied
Unable to query process information for csrss.exe (PID: 632)
```

This protection exists because `csrss.exe` is marked as a Protected Process Light (PPL) with Windows signer-level protection. The operating system kernel enforces these restrictions at a fundamental level during handle creation. When a non-protected or lower-privileged process attempts to open a handle to CSRSS, the kernel's `ObOpenObjectByPointer` and related functions check the `PS_PROTECTION` fields of both processes. If the protection comparison fails, the kernel denies access rights including:

- `PROCESS_VM_READ` (0x0010) - Reading process memory
- `PROCESS_VM_WRITE` (0x0020) - Writing to process memory
- `PROCESS_VM_OPERATION` (0x0008) - Memory operations like VirtualProtectEx
- `PROCESS_CREATE_THREAD` (0x0002) - Creating remote threads
- `PROCESS_DUP_HANDLE` (0x0040) - Duplicating handles
- `PROCESS_SUSPEND_RESUME` (0x0800) - Suspending/resuming threads

Typically, only `PROCESS_QUERY_LIMITED_INFORMATION` (0x1000) is granted, allowing minimal information retrieval while blocking all manipulation attempts.

### Why Even Administrators Are Blocked

Windows uses a security model where protection levels are enforced at the kernel level, creating a hierarchy that transcends traditional privilege boundaries. Understanding this architecture helps explain why administrator accounts cannot bypass protected process restrictions.

<WindowsProtectionHierarchy />

The kernel refuses to grant full access handles to protected processes based on their protection level, regardless of the caller's user privileges. This is a fundamental security boundary that operates below the traditional user/administrator privilege model. When you request a handle to a protected process via `OpenProcess` or similar APIs, the kernel's process manager performs protection-level comparison before privilege checks.

The kernel executes roughly this logic:

```c
// Simplified kernel protection check (actual implementation in ntoskrnl.exe)
if (TargetProcess->Protection.Level != 0) {
    if (!RtlTestProtectedAccess(CallerProcess->Protection, 
                                 TargetProcess->Protection)) {
        // Deny dangerous access rights regardless of privileges
        DesiredAccess &= PROCESS_QUERY_LIMITED_INFORMATION;
    }
}
```

The `RtlTestProtectedAccess` function compares both the protection type (None/PPL/PP) and signer level. Even if the calling process runs as SYSTEM with SeDebugPrivilege, if its `PS_PROTECTION` structure shows insufficient protection, the kernel strips dangerous access rights from the handle. This means being Administrator or even SYSTEM isn't enough as you need to be running as a protected process with a signer level greater than or equal to the target's signer level. Additionally, **PPL processes cannot obtain full access to PP (Protected Process) targets**, regardless of signer level, as PP represents a higher protection tier.

## Protected Processes: Technical Deep Dive

### Protection Mechanisms

Protected processes implement multiple layers of security that work together to create a comprehensive defense against tampering and unauthorized access. Understanding these mechanisms reveals why protected processes are so resistant to traditional analysis and manipulation techniques.

#### 1. Handle Access Restrictions

The kernel restricts handle operations based on protection levels through a comparison mechanism that evaluates both the target process's protection and the requesting process's protection. When a process attempts to open a handle to another process, the kernel's process manager examines the protection level of both processes.

```c
// Highly simplified kernel logic for handle access
// Actual implementation evaluates multiple fields: protection type, signer level,
// requested access rights, and various flags through RtlTestProtectedAccess
if (TargetProcess->Protection.Level != 0) {
    if (!RtlTestProtectedAccess(CallerProcess->Protection, 
                                 TargetProcess->Protection)) {
        if (DesiredAccess includes PROCESS_VM_READ ||
            DesiredAccess includes PROCESS_VM_WRITE ||
            DesiredAccess includes PROCESS_CREATE_THREAD) {
            return STATUS_ACCESS_DENIED;
        }
    }
}
```

This check occurs before any user-mode code receives a handle, making it impossible for user-mode tools to bypass. The kernel examines the requested access rights, looking specifically for dangerous operations like reading memory (`PROCESS_VM_READ`), writing memory (`PROCESS_VM_WRITE`), creating threads (`PROCESS_CREATE_THREAD`), and several other operations that could be used for code injection or process manipulation. If the requesting process doesn't have a high enough protection level, these operations are denied regardless of administrative privileges.

Even basic query operations may be restricted, often only `PROCESS_QUERY_LIMITED_INFORMATION` is allowed for lower-privileged processes attempting to access protected processes. This limited access right permits only minimal information retrieval such as process ID and exit status, while blocking access to more sensitive details like memory contents, handles, or full token information.

#### 2. Code Signing Requirements and Code Integrity

Protected processes can only load binaries that meet strict code signing requirements enforced through Windows Code Integrity (CI). This prevents attackers from injecting unsigned or incorrectly-signed DLLs into protected processes, even if they manage to bypass other protections.

**Code Integrity Enforcement:**

When a protected process attempts to load a DLL, the kernel's Code Integrity subsystem verifies the signature before allowing the load operation. The verification checks include:

- **Signature validation** - The DLL must be properly signed with a valid digital signature
- **Signer level verification** - The signer must meet or exceed the protection requirements of the target process
- **Certificate chain validation** - The entire certificate chain must be trusted and valid
- **Hash verification** - The file's hash must match the signed digest to prevent tampering

**Signing Requirements by Protection Level:**

Microsoft signatures are required for system PPL processes with Windows, WinTcb, and WinSystem signers, ensuring that only Microsoft-signed code can run in the most critical system components. Antimalware signatures use special Extended Key Usage (EKU) certificates issued to registered antimalware vendors through Microsoft's security partner program (formerly MAPP). These vendors must meet specific security requirements and maintain their certification status to retain their signing privileges. Store signatures cover Windows Store applications, allowing them to run with appropriate protection for the app model while preventing tampering.

If a process attempts to load a DLL that doesn't have the appropriate signature for its protection level, the load operation fails with `STATUS_INVALID_IMAGE_HASH` or similar error codes. This creates a complete trusted execution environment where only properly signed code meeting the protection requirements can execute within the process's address space. On systems with HVCI (Hypervisor-protected Code Integrity) enabled, these checks are further reinforced by the hypervisor, making bypass attempts even more difficult.

#### 3. Thread and Memory Protections

Protected processes enforce comprehensive restrictions on thread and memory operations that prevent the most common attack techniques. External thread injection using APIs like `CreateRemoteThread` is completely blocked, preventing attackers from executing arbitrary code in the target process's context. Memory manipulation through `WriteProcessMemory` and related APIs fails with access denied, stopping attempts to patch code or modify data structures. Debugging operations that would allow attaching debuggers to inspect or manipulate the process are denied unless the debugger itself runs with sufficient protection. DLL signature verification ensures that only signed DLLs meeting the process's protection requirements can be loaded, creating an end-to-end trust chain.

These protections combine to create a hardened execution environment where even kernel-mode code must respect protection boundaries. While kernel drivers can technically access protected process memory, Windows Driver Signature Enforcement and HVCI (Hypervisor-protected Code Integrity) in modern Windows versions make it increasingly difficult to load malicious drivers that could exploit this access.

## What's Next

In Part 2 of this series, we'll explore advanced inspection tools and techniques that can bypass some of these restrictions. We'll examine Process Hacker's kernel driver capabilities, WinDbg kernel debugging for complete system visibility, and the special case of LSASS and credential theft tools like Mimikatz. We'll also cover real-world attack scenarios, detection mechanisms, and system hardening strategies to protect against protected process bypass techniques.

## References and Further Reading

- [Windows Internals, Part 1 (7th Edition)](https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals) - Pavel Yosifovich, Mark Russinovich, David Solomon, Alex Ionescu
- [Sysinternals Process Explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer) - Official documentation
- [Protected Processes Part 1: Pass-the-Hash Mitigations in Windows 8.1](https://www.alex-ionescu.com/?p=97) - Alex Ionescu

---

*Remember: These techniques should only be used for authorized security research, legitimate penetration testing, or educational purposes. Unauthorized access to computer systems is illegal.*

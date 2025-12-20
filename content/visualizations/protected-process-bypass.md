---
title: "Protected Process Bypass (DKOM)"
description: "Interactive simulation of a Direct Kernel Object Manipulation (DKOM) attack against Windows Protected Processes (PPL). Steps through loading a driver, locating the EPROCESS structure, and patching the protection bit."
date: "2025-12-20"
author: "0xHabib"
tags: ["windows-internals", "kernel", "rootkit", "red-teaming"]
component: "ProtectedProcessBypass"
visibility: "public"
relatedPost: "windows-protected-processes-part3"
---

This visualization demonstrates the specific kernel memory manipulation required to strip "Protected Process Light" (PPL) protection from a target process like LSASS.

### Attack Phases
1.  **Driver Load**: Gaining Ring 0 execution is the prerequisite.
2.  **Object Lookup**: Using `PsLookupProcessByProcessId` to find the target's kernel object (`EPROCESS`).
3.  **Patching**: Overwriting the `PS_PROTECTION` byte at a specific offset (e.g., `0x87a`).
4.  **Access Check**: Once patched, `ObOpenObjectByPointer` no longer returns `STATUS_ACCESS_DENIED`.

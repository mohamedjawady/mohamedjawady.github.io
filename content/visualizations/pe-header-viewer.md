---
title: "PE Header Explorer"
description: "Interactive viewer for the Portable Executable (PE) file format structures. Explore the DOS Header, NT Headers, and Optional Header fields used by the Windows Loader."
date: "2025-12-20"
author: "0xHabib"
tags: ["malware-analysis", "pe-format", "reverse-engineering"]
component: "PEHeaderViewer"
visibility: "public"
relatedPost: "library-loading-techniques"
---

The Portable Executable (PE) format is the standard for executables, object code, and DLLs in Windows. This tool visualizes the critical headers managed by the Windows Loader.

### Key Structures
*   **DOS Header**: Legacy header starting with `MZ`. Contains `e_lfanew` pointing to NT Headers.
*   **NT Headers**: Contains the PE Signature (`PE\0\0`), File Header (machine type, sections), and Optional Header.
*   **Optional Header**: The most critical data for the loader, including the Entry Point, Image Base, and Data Directories (Exports, Imports, Relocations).

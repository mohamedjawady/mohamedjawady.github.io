---
title: "Export Table Walker"
description: "Visualizing the manual resolution of API addresses. Demonstrates how malware parses the Export Directory, walks the AddressOfNames, and retrieves function addresses without using GetProcAddress."
date: "2025-12-20"
author: "0xHabib"
tags: ["malware-analysis", "pe-format", "api-hashing"]
component: "ExportTableWalker"
visibility: "public"
relatedPost: "library-loading-techniques"
---

To evade hooks on `GetProcAddress`, malware often manually parses the Export Directory of system DLLs (like `kernel32.dll`). This visualization shows the logical flow of this process.

### The Algorithm
1.  **Locate Export Directory**: Found via the `DataDirectory[0]` in the Optional Header.
2.  **Walk Names**: Iterate through `AddressOfNames` to match the target function string.
3.  **Get Ordinal**: Use the index from the name match to read from `AddressOfNameOrdinals`.
4.  **Get Address**: Use the ordinal to index into `AddressOfFunctions`.

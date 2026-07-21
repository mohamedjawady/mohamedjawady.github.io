---
title: "Security Tooling Reference: AV, EDR, XDR, NDR, IDS, IPS, SIEM"
description: "What each major security tool category actually watches, how it detects, what it can do about it, and real product examples for AV, EDR, XDR, NDR, IDS, IPS, and SIEM, plus how they fit together in a modern SOC stack."
source: "Vendor documentation, SANS SEC450, industry practice"
type: "article"
difficulty: "intermediate"
category: "Blue Team"
author: "Mohamed Habib Jaouadi"
publishedDate: "2026-07-21"
status: "completed"
tags: ["edr", "xdr", "ndr", "siem", "ids", "ips", "antivirus", "soc", "tooling", "blue-team"]
visible: true
---

A category-by-category reference for the acronym soup of security tooling: what AV, EDR, XDR, NDR, IDS, IPS, and SIEM each actually watch, how they detect, what they can do in response, and real products in each category. Includes how they fit together as layers rather than substitutes for one another.

## Key Topics Covered

- **Endpoint layer**: Antivirus vs EDR vs XDR, and what each one is blind to
- **Network layer**: IDS vs IPS placement, and where NDR fills the gap neither covers
- **Aggregation layer**: what a SIEM actually does that individual tools can't
- **Real examples**: named products in each category, not just definitions
- **How they compose**: why a modern SOC stack needs more than one of these, and in what order

## Why This Matters

Interviews and vendor conversations both assume fluency in this vocabulary, and the categories blur together in marketing material on purpose. Knowing precisely what each layer sees, misses, and can act on is what lets you reason about coverage gaps instead of just recognizing logos.

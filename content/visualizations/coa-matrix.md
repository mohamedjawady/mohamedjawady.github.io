---
title: "Courses of Action Matrix"
description: "Interactive Courses of Action matrix: seven kill chain phases against the seven Ds of defensive action, with per-cell examples and an intelligence gain/loss panel showing why deny is rarely the best response to a C2 domain."
date: "2026-07-10"
author: "Mohamed Habib Jaouadi"
tags: ["cti", "threat-intelligence", "courses-of-action", "incident-response", "kill-chain", "detection-engineering"]
component: "CoAMatrix"
visibility: "public"
relatedPost: "courses-of-action-gain-loss"
---

The Courses of Action matrix is the defender's mirror of the kill chain. Where the kill chain lists the phases an adversary must complete, the CoA matrix lists what a defender can do at each phase, across seven categorical actions: discover, detect, deny, disrupt, degrade, deceive, and destroy. It comes from the Lockheed Martin Intelligence-Driven Computer Network Defense paper.

The two blue columns are passive: run both on nearly every indicator, because they carry no strategic cost. The five remaining columns are mitigating and mutually exclusive: you choose exactly one, because denying an event forecloses deceiving the adversary through it. Click any column header to see its role, and for the mitigating actions, the intelligence gain and loss on a worked example, a command-and-control domain discovered on a single infected host. The comparison is the whole point: deny is the reflex and usually the weakest intelligence trade, while deceive, when the capability exists, protects you and teaches you at the same time.

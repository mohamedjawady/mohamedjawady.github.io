---
title: "The Four Types of Threat Detection"
description: "Interactive 2x2 of threat detection approaches: configuration analysis, anomaly modeling, indicators, and threat behaviors. Click each quadrant for strengths, failure modes, example technologies, and the context-versus-coverage tradeoff."
date: "2026-07-09"
author: "Mohamed Habib Jaouadi"
tags: ["cti", "threat-intelligence", "detection-engineering", "behavioral-analytics", "soc", "threat-hunting"]
component: "DetectionTypesQuadrant"
visibility: "public"
relatedPost: "indicators-to-behavioral-analytics"
---

Every threat detection technology on the market fits into one of four quadrants along two axes: whether it draws its knowledge from your environment or from the adversary, and whether it targets known or unknown activity. Environmental approaches (configuration analysis, anomaly modeling) can see things nobody encoded but cannot explain what they see. Threat-based approaches (indicators, threat behaviors) explain exactly what fired but only catch what an analyst encoded.

The quadrant below maps the four types with their strengths, failure modes, and representative technologies. The framing comes from Sergio Caltagirone's work at Dragos; the practical conclusion is that a mature program layers all four while investing its scarce analyst hours in the top-right quadrant, threat behaviors, where detections survive infrastructure rotation and carry their own context.

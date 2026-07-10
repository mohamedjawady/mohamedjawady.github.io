---
title: "Collection Coverage Matrix"
description: "Interactive Collection Management Framework matrix: eight typical telemetry sources scored against the kill chain, with per-source data types, follow-on collection, blind spots, and a time control that shows sources dropping out as retention windows expire."
date: "2026-07-10"
author: "Mohamed Habib Jaouadi"
tags: ["cti", "threat-intelligence", "collection-management", "visibility", "soc", "detection-engineering"]
component: "CollectionCoverageMatrix"
visibility: "public"
relatedPost: "collection-management-framework"
---

A Collection Management Framework maps every data source to what it can see, for how long, and what follow-on collection it enables. The matrix below models eight typical sources in a mid-size environment against the phases of adversary activity. Green cells mean the source observes that phase well, amber means partially, and gray means blind.

The control at the top is the part most coverage discussions skip: move the incident back in time and watch sources fall out of the investigation as their retention windows expire. A source that covers the right phase answers nothing if the data was rotated out before the question arrived. Notice also that the weaponization column stays blind for every internal source; some phases are structurally invisible from inside your own network, which is precisely the gap external reporting exists to fill.

# Article Plan — You Can't Answer That: Collection Management and the Questions Your Data Can Actually Support

Standalone post (not in the CTI Foundations series). Cross-link Part 1 (requirements/lifecycle),
the behavioral analytics post (what CTI hands detection engineering), and Analytic Judgment
(field-of-view bias) as related reading; re-teach none of them.

> Source material scope: FOR578 (2021) pp. 96-145, specifically planning and direction, generating
> intelligence requirements, PIRs, and the Collection Management Framework (internal + external
> examples). Deck is a **topic map only**; the public primary source is Robert M. Lee's CMF
> whitepaper plus JP 2-0 collection management doctrine. **All examples redesigned**: not the
> deck's malware-feed external CMF, not its four-source internal table with 30/60/23/60 retention,
> not its "behaviors from 3 months ago vs 2 months of logs" or "executives want attribution"
> examples. Original failure story, original source list, original retention numbers.

## Title

**"You Can't Answer That: Collection Management and the Questions Your Data Can Actually Support"**

## Frontmatter Draft

```yaml
title: "You Can't Answer That: Collection Management and the Questions Your Data Can Actually Support"
description: "Every intelligence requirement is a question, and your collection decides whether it is answerable before any analysis begins. How to build a Collection Management Framework, find the retention gaps that kill investigations, and turn unanswerable questions into funded collection requirements."
date: "<publish date>"
author: "Mohamed Habib Jaouadi"
tags: ["threat-intelligence", "collection-management", "cti-program", "visibility", "detection-engineering", "soc"]
banner: "/banners/posts/<new banner>"
bannerAlt: "Mapping data sources to the questions they can answer"
visibility: "public"
```

File: `content/posts/collection-management-framework.mdx`

## Style Checklist

- Focus blockquote + TL;DR; prescriptive prose; no em dashes; minimal bullets; tables where planned.
- `<Term>` on first use; new glossary entries below.
- Visuals planned from the start: 3 inline SVGs + 1 interactive component + 3 tables + 2 CollapsibleCode.
- Documented public case study (Storm-0558) reconstructed from CISA/Microsoft record.
- Hands-on exercise, annotated references (curl-verified before publishing), standalone conclusion.
- ~350-400 lines MDX.

## Outline

1. **TL;DR + framing.** Every intelligence requirement is a question. Whether the question is
   answerable was decided months before it was asked, by what you collect and how long you keep it.
   Most teams discover their gaps in the middle of an investigation, which is the most expensive
   possible moment. A Collection Management Framework is the discipline of knowing what you can
   answer before anyone asks.

2. **The unanswerable requirement (original failure story).** Scenario built fresh: the company
   acquires a smaller firm; the CISO's question is whether the acquired network was already
   compromised in the six months before the merger of the two networks. Walk the collapse: the
   acquired company ran no EDR, its firewall logs rotate at 30 days, its VPN appliance keeps 21
   days, the cloud tenant had audit logging on the default tier, and your own telemetry only sees
   the acquired network from integration day forward. The honest answer to the CISO is "we can
   cover 30 of the 180 days you asked about, from one vantage point." Nobody did anything wrong
   during the investigation. The investigation was lost before it started.
   **Inline SVG 1 (the killer visual): retention windows vs the requirement window.** Horizontal
   timeline, requirement span day -180 to day 0 drawn as a bracket; below it, per-source bars
   (EDR: none, firewall: 30d, VPN: 21d, cloud audit: 90d partial, own telemetry: since day -14);
   the uncovered stretch shaded red.

3. **What a CMF actually is.** A Collection Management Framework is a map from each data source to
   what it can see and for how long: source, data type, which phases of adversary activity it
   observes, what follow-on collection it enables, retention, and who owns access. Explicitly not
   an asset inventory and not a list of SIEM indices; it is organized around answerability. Origin
   in classic collection management doctrine (JP 2-0) and brought to CTI by Robert M. Lee's public
   whitepaper. Key line from the tradition, restated in our own words: an analyst who does not
   understand their collection on a technical level cannot know which requirements are satisfiable
   against it.

4. **Building the internal CMF (centerpiece).** Worked table for a realistic mid-size org, original
   sources and numbers: email gateway, EDR, Windows event forwarding, DNS resolver logs, web proxy,
   netflow, IdP/SSO logs, cloud audit logs. Columns: data type, kill chain phases visible,
   follow-on collection enabled, retention, owner. Prose on what the exercise surfaces in practice:
   the netflow nobody realized rotates in two weeks, the DNS logs that exist but nobody on the
   intel team can query, the cloud audit logging enabled on the production tenant only, the EDR
   that covers workstations but not the server estate. The CMF's first deliverable is always an
   uncomfortable map of what you assumed you had.
   **Interactive component: `<CollectionCoverageMatrix />`** — grid of sources (rows) by kill chain
   phases (columns); cells colored by visibility (sees it / partial / blind); clicking a source row
   opens a panel with data type, retention, follow-on collection, and typical blind spots; a
   retention toggle or slider dims sources whose window has expired for a hypothetical "incident
   N days ago," making the time dimension tangible. Companion file
   `content/visualizations/collection-coverage-matrix.md`.

5. **The external CMF.** Feeds, vendor reporting, and sharing communities are collection too, and
   they deserve the same columns plus two more: what the provider's own field of view is (their
   customer base and sensor placement decide what they can see, per the field-of-view bias argument
   in the Analytic Judgment post) and what they add over sources already held. Reuse the USENIX
   2020 Bouwman citation: two market-leading vendors overlapped in the low single digits for the
   same actors, so external collection should be chosen for complementary fields of view, not
   volume. Small table: three hypothetical external sources scored on "what question does this
   actually let us answer that nothing else does."

6. **The gate: requirements meet the CMF.** The operational payoff. Every incoming intelligence
   requirement gets triaged against the CMF into three outcomes: answerable now (route to analysis),
   answerable with follow-on collection (route to collection first, with a time estimate), or
   unanswerable (becomes a collection gap with the requirement attached). The third outcome is the
   valuable one: "we need more logging" never gets funded, but "we could not answer the board's
   acquisition question, and closing that gap costs X" does. PIRs in one paragraph: time-bound,
   tied to a specific decision, and the first things to check against the CMF because their
   deadlines are real.
   **Inline SVG 2: the gate flow.** Requirement box → CMF diamond → three branches (analyze /
   collect first / gap register), with the gap register feeding a "funded collection" arrow that
   loops back into the CMF.

7. **Documented case: Storm-0558 (2023).** The collection-decides-answerability argument at
   national scale. When the actor tracked as Storm-0558 forged tokens and read Exchange Online
   mailboxes of US government agencies, the specific log needed to determine exposure (MailItemsAccessed
   in the audit stream) sat behind a premium licensing tier. Organizations without that tier faced
   the CISO question "were we affected" with literally no data capable of answering it; the agency
   that detected the campaign could do so only because it had the premium logging. The aftermath
   made the point for us: CISA and Microsoft announced expanded free logging in September 2023.
   One organization's CMF row read "answerable" and produced the detection of a nation-state
   campaign; everyone else's read "unanswerable" at any price below an E5 license. Reconstructed
   from the public CISA advisory and Microsoft's announcements.

8. **Modernizing the columns: ATT&CK data sources and DeTT&CT.** The kill chain columns are right
   for narrative and executive communication; for engineering granularity, map sources to MITRE
   ATT&CK data sources and data components (Process Creation, Network Connection Creation, Cloud
   Service Enumeration...), which give a shared vocabulary for "what can this source see" at
   technique level. DeTT&CT (open source, Rabobank) operationalizes exactly this: score data source
   quality and coverage against ATT&CK, render heatmaps in Navigator. One paragraph each; the CMF
   is the thinking, these are the tooling.

9. **Keeping it alive.** A CMF is a living document with named review triggers: new security tool,
   merger or acquisition, cloud migration, retention policy change, and every unanswerable
   requirement. The gap register format: gap, requirement that exposed it, cost to close, owner,
   date. A CMF that was accurate eighteen months ago is a liability wearing a badge of diligence.
   **CollapsibleCode 1:** CMF starter template (markdown table skeleton with column definitions).
   **CollapsibleCode 2:** collection gap register entry template.

10. **Hands-On Exercise.** Take the last three questions your team was actually asked (or derive
    three from your threat model if you are starting fresh). For each, list which sources would
    contain the answer, check the retention against the time window the question implies, and
    classify it answerable, partially answerable, or unanswerable. For the worst one, write the
    one-paragraph funded collection request: the question that could not be answered, the decision
    it supported, the gap, and the cost to close it. That paragraph is the most persuasive budget
    document a CTI team can produce.

11. **Conclusion.** Analysis gets the glory, but collection decides what analysis is possible.
    The teams that look competent under pressure are not smarter; they knew what they could answer
    before they were asked, and they had already sent the bill for the rest. Related reading:
    CTI Foundations Part 1 (requirements), From Indicators to Behavioral Analytics (what the
    answers should become), Analytic Judgment (field-of-view bias).

## Visuals Summary

- SVG 1: requirement window vs per-source retention bars, uncovered span in red (section 2)
- SVG 2: requirement → CMF gate → analyze / collect-first / gap register flow with funding loop (section 6)
- SVG 3 (optional, add if section 4 runs text-heavy): anatomy of one CMF row as a labeled diagram
- Interactive: `<CollectionCoverageMatrix />` with per-source detail panels and a retention/time dimension
- Tables: internal CMF centerpiece; external source scoring; (small) review triggers or outcomes table
- CollapsibleCode: CMF starter template; gap register entry template

Theme rules as established: currentColor + accent palette (sky, amber, emerald, violet, red),
no blank lines inside JSX blocks, captions under every figure.

## New Glossary Terms for term.tsx

collection-management-framework, intelligence-requirement, priority-intelligence-requirement,
collection-gap, data-source (ATT&CK sense). Reuse existing: kill-chain, edr, siem, soc,
indicator-lifecycle, cti.

## References (curl-verify every URL at draft time, per standing lesson)

1. Robert M. Lee, "Collection Management Frameworks: Beyond Asset Inventories for ICS" (Dragos
   whitepaper). Try https://www.dragos.com/wp-content/uploads/CMF_For_ICS.pdf; expect link rot,
   fall back to Wayback snapshot.
2. JP 2-0, Joint Intelligence (bits.de mirror, verified working last post) — collection management
   doctrine origin.
3. MITRE ATT&CK Data Sources. https://attack.mitre.org/datasources/
4. DeTT&CT. https://github.com/rabobank-cdc/DeTTECT
5. Bouwman et al., USENIX Security 2020 (verified) — feed overlap, external CMF section.
6. CISA advisory / joint guidance on the Storm-0558 Exchange Online intrusion (July 2023). Find
   canonical URL at draft time (cisa.gov advisory AA23-193A or the MAR; verify).
7. Microsoft, "Expanding cloud logging to give customers deeper security visibility" (July 2023
   announcement of free logging expansion). Verify MSRC/blog URL.
8. Sherman Kent Center / FAS, "A Compendium of Analytic Tradecraft Notes" or the SIP document
   https://irp.fas.org/cia/product/UnclasSIP.pdf — only if it verifies; drop otherwise.
9. CTI Foundations Part 1 and prior posts as internal cross-links, not references.

## Writing Cautions

- The acquisition failure story, the internal CMF table (sources, retention numbers, owners), and
  the external source scoring are all original inventions clearly framed as illustrative.
- Storm-0558 details strictly from the public record: token forgery, OWA/Exchange Online access,
  the MailItemsAccessed/E5 licensing issue, the September 2023 logging expansion. Do not
  overclaim operational details beyond CISA/Microsoft statements.
- Do not re-teach the intelligence lifecycle, requirements writing (Part 1 owns both), or
  field-of-view bias (Analytic Judgment owns it); one-sentence cross-links each.
- Verify every reference URL with the curl sweep before writing the references section.

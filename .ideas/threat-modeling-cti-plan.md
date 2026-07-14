# Article Plan — What Should We Actually Worry About? Threat Modeling for CTI

Standalone post (not in the CTI Foundations series). Cross-link: "You Can't Answer That"
(collection), CTI Foundations Part 1 (requirements), Analytic Judgment (mirror imaging / attribution
caution); re-teach none.

> Source material scope: FOR578 (2021) pp. 118-128, Systems Analysis, Threat Modeling, Target-Centric
> Intelligence Analysis, building a threat model, adding adversaries, pivoting on information and
> adversaries, going granular. Deck is a **topic map only**; public primary sources are Robert M.
> Clark's *Intelligence Analysis: A Target-Centric Approach*, Leavitt's organizational-systems
> diamond, MITRE Crown Jewels Analysis / Center for Threat-Informed Defense, MITRE ATT&CK Groups,
> and the Diamond Model paper (activity groups). **All examples redesigned**: no Edison
> International / SpaderTech / Money Bin, no Poison-Ivy-means-China example verbatim (reframe with an
> original commodity-RAT attribution caution). Original fictional org throughout.

## Title

**"What Should We Actually Worry About? Threat Modeling for CTI"**

## Frontmatter Draft

```yaml
title: "What Should We Actually Worry About? Threat Modeling for CTI"
description: "Not every threat is your threat. A CTI threat model starts from your crown jewels, works out to the adversaries who want them, and pivots both ways until you know what to defend and what to ignore. Target-centric analysis, worked end to end."
date: "<publish date>"
author: "Mohamed Habib Jaouadi"
tags: ["threat-intelligence", "threat-modeling", "cti-program", "risk", "target-centric-analysis", "mitre-att&ck"]
banner: "/banners/posts/threat-modeling-cti.jpg"
bannerAlt: "A target-centric threat model: crown jewels at the center, adversaries radiating out"
visibility: "public"
```

File: `content/posts/threat-modeling-cti.mdx`

## Style Checklist

- Focus blockquote + TL;DR; prescriptive prose; no em dashes; minimal bullets; tables where planned.
- `<Term>` on first use; new glossary entries below.
- Visuals planned from the start: 3 inline SVGs + 1 interactive + tables.
- Documented anchor: reframe the commodity-RAT attribution caution with an original, plausible
  example (no invented incident presented as real; keep it clearly illustrative).
- Hands-on exercise, annotated references (curl-verified), standalone conclusion.
- ~350-400 lines MDX.

## Outline

1. **TL;DR + framing.** There is threat intelligence available on nearly every threat that exists,
   and ingesting all of it is impossible and pointless. A threat model is the filter: it tells you
   which threats are plausibly yours, so you can spend finite attention on those and consciously
   ignore the rest. Most teams skip this and drown in relevance-free reporting.

2. **Universal threats vs your threats.** Two buckets. Universal threats (commodity malware,
   indiscriminate phishing, mass scanning) hit anyone on the internet and are handled by baseline
   hygiene. Targeted threats select you for a reason. A threat model exists to separate the second
   from the first, because treating everything as targeted is how a team burns out chasing
   reporting that was never about them. Sun Tzu's "know yourself and know the enemy" as the frame,
   restated: you cannot know which enemy matters until you know what you have that is worth taking.

3. **Threat modeling is applied systems analysis.** A system is an orderly grouping of
   interdependent components with a goal; a systems analysis deliberately builds the mental models
   you will reason with. Leavitt's classic organizational systems have four interacting components
   (structure, tasks, people, technology) plus forces of change (internal like reorgs, external
   like new law, tech shifts, social pressure). A full systems analysis is expensive; a threat
   model is the threat-focused subset of it. Distinguish CTI threat modeling from appsec/STRIDE
   threat modeling in one sentence: STRIDE models a system's vulnerabilities, CTI models the
   adversaries who would exploit them and why.
   **Inline SVG 1:** Leavitt's four-component system with "forces of change" around it, and the
   threat-focused slice highlighted as "what threat modeling keeps."

4. **Start from the crown jewels, not the adversary.** The counterintuitive core: you are the
   first target in your own threat model. Before naming a single actor, inventory what you have
   that someone would want, mapped to the CIA triad. Introduce the original worked org here:
   **Northwind Analytics, a mid-size climate-data SaaS company.** Three crown jewels:
   proprietary forecasting models (integrity + confidentiality: the product's edge),
   customer datasets including PII and commercial data (confidentiality), and platform availability
   (availability: the product itself). The point: each crown jewel attracts a different adversary
   for a different reason, which is why asset-first beats actor-first.

5. **Add the adversaries the crown jewels attract.** Now map who wants each jewel and why, using
   activity-group / archetype thinking rather than attribution (link Diamond Model activity groups).
   Table mapping the three Northwind crown jewels to adversary archetypes and motivations:
   models -> competitor / state economic espionage; datasets -> financially motivated criminals and
   access brokers; availability -> ransomware and extortion crews, plus hacktivists on a relevant
   news cycle; and the always-present insider across all three. Emphasize: adversaries align to
   industry verticals, information types, or trigger events, and you do not need attribution to use
   this, only the category and motivation.
   **Interactive component: `<ThreatModelExplorer />`.** Target-centric map: Northwind at the
   center, clickable in two modes. "Pivot on assets" shows the three crown jewels; clicking one
   reveals its CIA property and the adversaries it attracts with why. "Pivot on adversaries" shows
   the archetypes; clicking one reveals their likely tools, operational dependencies, and trigger
   events. Companion file `content/visualizations/threat-model-explorer.md`.

6. **Target-centric analysis: the model is the meeting place.** Robert Clark's target-centric
   approach as the method under all this: instead of a linear producer-to-consumer intelligence
   cycle that stovepipes, everyone contributes to and draws from a shared conceptual model of the
   target, updated continuously as new information and new gaps appear. Reframe the intelligence
   cycle contrast: linear pipeline vs shared central model with many contributors. Every gap the
   model exposes becomes a collection requirement (link the CMF post).
   **Inline SVG 2:** linear cycle (stovepiped, one-directional loop) beside the target-centric
   shared-model hub (many contributors around one evolving target model).

7. **Pivot both ways.** The model grows by pivoting off two things. Pivot off the information:
   Northwind's "customer datasets" node deepens into which datasets, where they live, which subset
   an actor would actually want, and what a leak would cost. Pivot off the adversaries: the
   "economic espionage" node deepens into their tooling, their operational dependencies, and the
   trigger events that would point them at you (you announce a new model, win a marquee contract,
   publish research). Each new node is itself a new target with its own gaps. This is where the
   model stops being a diagram and becomes a research program.

8. **Go as granular as the requirement demands.** The model should go only as deep as a decision
   needs. System -> subsystem -> software version. Stop at actor-and-motivation if that satisfies
   the requirement; push down to specific software versions when the requirement is feeding
   vulnerability prioritization (a critical CVE on an internet-facing subsystem that a
   crown-jewel-relevant actor is known to exploit jumps the queue). Granularity is a dial set by
   the question, not a completeness contest.
   **Inline SVG 3:** the granularity ladder (System -> Subsystem -> Software version) with a side
   arrow showing "feeds vulnerability prioritization" at the bottom rung.

9. **Threat modeling is art, and it decays.** Two honest cautions. It is art, not science: you are
   assessing likely targeting, and the adversary has a vote, so the model is a prior, not a
   prophecy. And it decays: threats shift, your business shifts (a new product, an acquisition, a
   new market), so the model needs scheduled revisiting. Fold in the attribution caution with an
   original example: seeing a commodity RAT that public reporting has tied to one named actor does
   not mean that actor is targeting you, because commodity tooling is shared across many crews.
   Treating that as targeting is mirror imaging and anchoring (link Analytic Judgment).

10. **Build it with people outside security.** The target-centric method's stovepipe-reduction
    principle applied: your security team will miss assets that other functions consider obvious.
    Sit with finance, legal, product, and operations to enumerate crown jewels, because the
    manufacturing recipe, the unreleased pricing model, or the one irreplaceable database admin are
    assets your infosec lens does not naturally surface. Diversity of contributors is a collection
    control for the model itself (light link to Analytic Judgment's team-diversity point).

11. **Hands-On Exercise.** For your own org (or Northwind if you want a sandbox), list three crown
    jewels mapped to the CIA triad. For each, name the adversary archetype most likely to want it
    and the motivation, without reaching for attribution. Pick the highest-value jewel and pivot
    once off the adversary: name their likely tooling, one operational dependency, and one trigger
    event that would raise your risk. Finally, write the one intelligence requirement this threat
    model just generated, and the one collection gap it exposed.

12. **Conclusion.** A threat model is how a CTI program earns the right to ignore things. It starts
    from what you have, not from what is trending, and it turns the impossible task of "watch all
    threats" into the tractable one of "watch the handful that your crown jewels actually attract."
    Related reading: the collection management post (what the model's gaps become), CTI Foundations
    Part 1 (the requirements it generates), Analytic Judgment (the biases it must survive).

## Visuals Summary

- SVG 1: Leavitt four-component system + forces of change, threat slice highlighted (section 3)
- SVG 2: linear intelligence cycle vs target-centric shared-model hub (section 6)
- SVG 3: granularity ladder System -> Subsystem -> Software version feeding vuln prioritization (section 8)
- Interactive: `<ThreatModelExplorer />` two-mode target-centric map (section 5)
- Tables: universal vs targeted threats; crown-jewel-to-adversary mapping
- (No CollapsibleCode strictly required; add a short threat-model worksheet template if space allows)

Theme rules as established: currentColor + accent palette (sky, amber, emerald, violet, red),
no blank lines inside JSX blocks, captions under every figure, Fragment keys in mapped rows.

## New Glossary Terms for term.tsx

threat-model, crown-jewels, target-centric-analysis, systems-analysis, activity-group (exists?),
cia-triad. Reuse existing: intelligence-requirement, collection-gap, mirror-imaging, diamond-model,
mitre-att-ck, collection-management-framework.

## References (curl-verified this session)

1. Robert M. Clark, *Intelligence Analysis: A Target-Centric Approach* (SAGE/CQ Press). 200.
   https://us.sagepub.com/en-us/nam/intelligence-analysis/book262437
2. MITRE ATT&CK Groups. 200. https://attack.mitre.org/groups/
3. Caltagirone, Pendergast, Betz, *The Diamond Model of Intrusion Analysis* (DTIC). 200.
   https://apps.dtic.mil/sti/pdfs/ADA586960.pdf  (activity groups, adversary-as-archetype)
4. MITRE Center for Threat-Informed Defense. 200. https://ctid.mitre.org/  (Crown Jewels Analysis /
   threat-informed defense; the mitre.org CJA page 403s to bots but is fine in-browser, so cite CTID)
5. Harold J. Leavitt (systems components: structure, task, people, technology). 200.
   https://en.wikipedia.org/wiki/Harold_Leavitt
6. Cross-links, not references: "You Can't Answer That" (CMF), CTI Foundations Part 1, Analytic Judgment.

## Writing Cautions

- Northwind Analytics and its crown jewels, adversary archetypes, tools, dependencies, and triggers
  are original inventions, clearly framed as illustrative; no invented incident presented as real.
- Reframe the deck's Poison-Ivy-China attribution caution as an original commodity-RAT example and
  connect it explicitly to mirror imaging / anchoring (Analytic Judgment owns the bias treatment).
- Do not re-teach collection management (CMF post owns it), requirements writing (Part 1), or the
  bias catalog (Analytic Judgment); one-sentence cross-links each.
- Keep the STRIDE/appsec contrast to a single clarifying sentence; this is a CTI post, not an
  appsec one.
- Verify every reference URL is still live at publish; all five checked 200 this session.

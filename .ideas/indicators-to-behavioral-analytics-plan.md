# Article Plan — From Indicators to Behavioral Analytics: What CTI Should Actually Hand Detection Engineering

Standalone post (not in the CTI Foundations series). Self-contained; cross-link the Pyramid of Pain
post as related reading but do not re-teach it.

> Source material scope: FOR578 (2021) pp. 46-95, specifically the indicator life cycle, key
> indicators, indicator fatigue and use cases, the four types of threat detection, and the
> indicators-to-behavioral-analytics transposition. The deck is a **topic map only**. Every concept
> maps to a public primary source (the Lockheed Martin intel-driven defense paper contains the
> indicator life cycle; the Dragos whitepaper contains the four detection types; Cloppert's SANS
> blog series covers key indicators). **All examples must differ from the deck's**: no 51.11.247.89,
> no 5.15.25.30 VPN example (redesign the transposition scenario from scratch), no snowball
> metaphor phrasing, no cheese-password key indicator examples.

## Title

**"From Indicators to Behavioral Analytics: What CTI Should Actually Hand Detection Engineering"**

## Frontmatter Draft

```yaml
title: "From Indicators to Behavioral Analytics: What CTI Should Actually Hand Detection Engineering"
description: "Why indicator feeds make a weak handoff, what indicators are actually for, and how to transpose the artifacts of one intrusion into behavioral analytics that survive the next one. The contract between CTI and detection engineering, spelled out."
date: "<publish date>"
author: "Mohamed Habib Jaouadi"
tags: ["threat-intelligence", "detection-engineering", "behavioral-analytics", "indicators", "sigma", "threat-hunting"]
banner: "/banners/posts/<new banner>"
bannerAlt: "Transforming intrusion indicators into durable behavioral detections"
visibility: "public"
```

File: `content/posts/indicators-to-behavioral-analytics.mdx`

## Style Checklist

- Focus blockquote + TL;DR opener; prescriptive voice; no em dashes; minimal bullets, prose and tables.
- `<Term concept="...">` on first use; add missing glossary entries.
- Generous inline SVGs from the start (lesson from last post): plan them in, not as an afterthought.
- One interactive component, one or two CollapsibleCode templates, documented public case studies only.
- Hands-on exercise, annotated references, standalone conclusion with related-reading pointer.
- ~350-400 lines MDX.

## Outline

1. **TL;DR + framing.** The standard handoff between CTI and detection engineering is a CSV of
   indicators, and it is the weakest product CTI can ship. Indicators are atomic elements of past
   intrusions, not detections for future ones. This post covers what indicators are actually for,
   the life cycle that makes them compound in value or in noise, and the transposition step that
   turns one incident's artifacts into detection logic that survives infrastructure rotation.

2. **What an indicator actually is.** The equation: data plus context equals indicator, and the
   corollary that indicator minus context equals data. An IP address is not an indicator; an IP
   address described as active C2 for a specific loader observed on a specific date is. Original
   example chain (not the deck's): a lure domain, its role, its campaign linkage. Consequence for
   feeds: a feed that ships bare observables is a data feed being sold as intelligence.
   **Inline SVG 1:** the indicator equation as a visual: [data] + [context] = [indicator], with a
   second row showing the subtraction.

3. **The indicator life cycle.** From the Lockheed Martin intelligence-driven defense lineage:
   an indicator is revealed (discovered by us, or reported to us, and the difference in reliability
   and context between those two origins), then vetted and matured (retro-hunt and discovery first,
   never straight to blocking: query historical telemetry before you deploy anything that pages a
   human), then utilized (it fires against real activity), and then analysis of what it fired on
   reveals more indicators. Indicators beget indicators; the loop is the whole point.
   The compounding property cuts both ways: good vetting compounds signal, and unvetted feed
   ingestion compounds noise, because a false positive that enters the loop generates downstream
   false positives that are progressively harder to trace back and purge. Automating mass feed
   ingestion under management pressure is risk avoidance dressed as risk management. Cite the
   USENIX 2020 study (Bouwman et al.) finding minimal overlap between commercial TI vendors
   covering the same actors, as evidence that no feed is the ground truth its marketing implies.
   **Inline SVG 2:** the life cycle as a state diagram: revealed → vetted → deployed → fired →
   analyzed → (new indicators loop back to revealed), with a red branch showing an unvetted
   indicator entering deployment directly and generating noise.

4. **Indicator life span.** No general statement of the form "domains are better than hashes"
   survives contact with a real adversary, because the adversary alone sets the rotation clock:
   one group rotates C2 per intrusion, another has reused the same delivery infrastructure for
   years. The only durable heuristic is that indicators closer to the adversary's habits decay
   slower than indicators closer to their infrastructure. Practical retirement policy: keep
   detections until they cause problems (false positives or real compute constraints), because
   dormant indicators cost nothing and adversaries reuse old infrastructure precisely because
   defenders age it out. Cross-link Pyramid of Pain here in one sentence.

5. **What indicators are actually for.** Three legitimate uses and one abuse, as a table plus prose.
   Legitimate: scoping and sweeps (indicators you extracted from your own incident, swept across
   your own environment, to answer "did we clean up and were there more hosts"); knowledge-gap
   filling (someone else's indicators used to check whether their intrusion touched you, and to
   fill kill chain phases you had no visibility into); enrichment and pivoting (an indicator as a
   research seed, not an alert). The abuse: indicators as the primary real-time detection layer,
   which produces the 10,000-critical-alerts queue where nothing is critical. Alert fatigue is not
   an analyst stamina problem, it is an architecture decision made upstream.

6. **Key indicators: when an atom is worth promoting.** Four criteria, all required: consistent
   across multiple intrusions, uniquely distinguishing one activity cluster from others,
   distinguishing malicious from benign, and aligned to a specific phase of adversary activity.
   Original examples (invented fresh, plausible, clearly illustrative): a reused TLS certificate
   subject across otherwise-rotated C2; a distinctive typo in a scheduled task description; a
   consistent staging directory naming pattern. The point: a key indicator can be an observable
   whose meaning is unknown, as long as it discriminates reliably.

7. **The four types of threat detection.** The 2x2: environmental approaches (configuration
   analysis, anomaly/statistical modeling) versus threat-based approaches (indicators, threat
   behaviors). Environmental methods catch unknowns but deliver alerts without context: the model
   says "this is weird," never "this is credential theft, contain the host." Threat-based methods
   only catch what you encoded, but fire with context attached. Neither column is sufficient;
   the failure mode is buying one quadrant and believing you bought coverage. Source: the public
   Dragos whitepaper on the four types of threat detection.
   **Interactive component:** `<DetectionTypesQuadrant />`: a 2x2 grid (knowns/unknowns x
   environment/threat), click each quadrant for strengths, failure modes, example technologies,
   and the context-versus-coverage tradeoff. Companion file
   `content/visualizations/detection-types-quadrant.md`.

8. **The transposition: from three indicators to one analytic (the payoff section).**
   Original worked scenario, redesigned from scratch: an incident where the adversary delivered an
   ISO attachment, the user mounted it and ran the LNK inside, which invoked a living-off-the-land
   binary to sideload a DLL that beaconed out. The incident yields indicators: the ISO hash, the
   lure domain, the C2 IP, the DLL export name. Each is real, each is already stale. The
   transposition asks what behavior connected them: archive-mounted file spawning a script host or
   LOLBin, followed within minutes by an outbound connection from a process that has no business
   making one. That analytic contains zero indicators from the incident and catches the next
   campaign wave with entirely new infrastructure.
   What makes a good behavioral analytic: transposable (not bound to any single atom), scalable,
   carries context in its own name and metadata (the alert says what is happening and what to do),
   and maps to ATT&CK so coverage is trackable.
   **Inline SVG 3:** three indicator boxes (hash, domain, IP: each stamped "expired") collapsing
   via an arrow into one analytic box that persists across three campaign-wave columns.
   **Documented case for the payoff:** the 3CX supply chain compromise (March 2023). Trojanized
   installers were validly signed with clean reputations; there were no known-bad hashes to feed
   anything. The compromise surfaced because behavioral detections flagged 3CXDesktopApp doing
   things a softphone has no business doing. Indicator-based detection had structurally nothing to
   offer on day zero; behavior-based detection is what fired. Sourced to the public CrowdStrike and
   Mandiant reporting.
   **CollapsibleCode:** a Sigma-style rule expressing the worked analytic, with FP filter section
   and ATT&CK tags, following the house pattern from the Pyramid post.

9. **The handoff contract.** What a CTI-to-detection-engineering deliverable should actually
   contain, as a short spec: the behavior described in one sentence, the ATT&CK mapping, why this
   behavior and not its indicators (durability argument), expected false positive sources and
   pre-thought filters, test criteria (how detection engineering validates the rule fired correctly),
   and the indicators attached as a scoping appendix rather than as the product.
   **CollapsibleCode:** "Detection Requirement Handoff" markdown template.

10. **Where to start tomorrow.** Deliberately practical close: MITRE CAR, the SigmaHQ rules
    repository, and the EQL Analytics Library as existing behavioral analytic collections to adapt
    rather than write from zero; Ryan Stillions' Detection Maturity Level model as the yardstick
    for asking where your program's detections actually sit (most programs discover they live at
    DML-2/3, atomic indicators and tools, and the whole post is about climbing to DML-4/5).

11. **Hands-On Exercise.** Take one recent public incident report. Extract every indicator into a
    list, then mark each as already-rotated or likely-still-live. Identify the behavioral chain the
    indicators decorated. Write one behavioral analytic in Sigma or pseudo-Sigma, name its top two
    false positive sources, and write the one-paragraph handoff per the contract in section 9.
    Compare the durability of what you wrote against the indicator list you started with.

12. **Conclusion.** Indicators are the exhaust of past intrusions; behaviors are the engine of
    future ones. The job of CTI is not to move atoms from a feed into a SIEM, it is to understand
    an intrusion well enough to describe the adversary's behavior so precisely that detection
    engineering can encode it once and benefit from it for years. Related reading: Pyramid of Pain
    post, Analytic Judgment post.

## Visuals Summary

- SVG 1: indicator equation (data + context = indicator; indicator − context = data)
- SVG 2: indicator life cycle state diagram with red unvetted-path branch
- SVG 3: three expired indicators collapsing into one persistent analytic across campaign waves
- Interactive: `<DetectionTypesQuadrant />` 2x2 with per-quadrant detail panels
- Tables: legitimate vs abused indicator use cases; key indicator criteria; DML level summary
- CollapsibleCode: Sigma rule for the worked analytic; handoff contract template

All SVGs inline, theme-aware (currentColor + fixed accent palette: sky, amber, emerald, violet, red),
no blank lines inside JSX blocks, captions in the established style.

## New Glossary Terms for term.tsx

behavioral-analytic, indicator-lifecycle, key-indicator, alert-fatigue, retrohunt (exists),
detection-engineering, false-positive, lolbin, dll-sideloading (t1574 exists), anomaly-detection

## References (verify every URL before publishing, per the link-rot lesson)

1. Hutchins, Cloppert, Amin, *Intelligence-Driven Computer Network Defense* (Lockheed Martin) —
   the kill chain paper; also the origin of courses of action and the indicator life cycle.
   https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/documents/cyber/LM-White-Paper-Intel-Driven-Defense.pdf (tested 200 previously)
2. Michael Cloppert, "Security Intelligence: Attacking the Cyber Kill Chain" (SANS DFIR blog) —
   key indicators in their original context. Verify URL.
3. Dragos, "The Four Types of Threat Detection" whitepaper — the 2x2. Verify URL on dragos.com.
4. Bouwman et al., "A different cup of TI? The added value of commercial threat intelligence"
   (USENIX Security 2020) — minimal inter-vendor feed overlap. https://www.usenix.org/conference/usenixsecurity20/presentation/bouwman
5. Ryan Stillions, "The DML model" (2014) — detection maturity levels. http://ryanstillions.blogspot.com/2014/04/the-dml-model_21.html
6. MITRE Cyber Analytics Repository. https://car.mitre.org/
7. SigmaHQ rules repository. https://github.com/SigmaHQ/sigma
8. EQL Analytics Library (atomicblue). https://eqllib.readthedocs.io/en/latest/atomicblue.html
9. CrowdStrike, 3CX supply chain intrusion reporting (March 2023) — behavioral detection payoff. Verify URL.
10. Mandiant, 3CX / UNC4736 analysis — corroborating record. Verify URL.
11. Bianco, Pyramid of Pain — one-line cross-reference only; the blog already owns this topic.
12. Robert M. Lee, "The Sliding Scale of Cyber Security" (SANS Reading Room) — only if the sliding
    scale gets a passing mention; otherwise drop to keep scope tight.

## Writing Cautions

- The transposition scenario, key indicator examples, and all observables are original inventions;
  the 3CX case is reconstructed from the cited public record.
- Do not re-teach the Pyramid of Pain or the intelligence lifecycle; cross-link.
- The Sigma rule must be plausible and syntactically clean but clearly labeled `status: test`.
- Verify every reference URL with the same curl sweep used last time before publishing.

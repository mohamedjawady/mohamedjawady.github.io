# Article Plan — Deny Is Not Free: The Courses of Action Matrix and Intelligence Gain/Loss

Standalone post (not in the CTI Foundations series). Cross-link the behavioral analytics post
(what atoms are for), the collection management post (what you can answer), Analytic Judgment,
and the Pyramid of Pain; re-teach none of them.

> Source material scope: FOR578 (2021) pp. 178-189, the Courses of Action matrix, the seven Ds,
> passive vs mitigating actions, mutual exclusivity, and intelligence gain/loss. Deck is a **topic
> map only**; the public primary source is the Lockheed Martin Intelligence-Driven CND paper
> (which defines the original CoA matrix and the six-D version) plus general IC intelligence
> gain/loss doctrine. **All examples redesigned**: not the deck's known-malicious-email-address
> gain/loss walkthrough verbatim, not its LaBrea/Code Red degrade example, not its "block Google
> Drive" politics vignette. Build an original worked indicator and original per-cell examples.

## Title

**"Deny Is Not Free: The Courses of Action Matrix and Intelligence Gain/Loss"**

## Frontmatter Draft

```yaml
title: "Deny Is Not Free: The Courses of Action Matrix and Intelligence Gain/Loss"
description: "Blocking is a reflex, not a strategy. The Courses of Action matrix turns one bad indicator into seven possible responses, and intelligence gain/loss makes the hidden cost of each one explicit. How defenders choose the action that protects them without burning their own visibility."
date: "<publish date>"
author: "Mohamed Habib Jaouadi"
tags: ["threat-intelligence", "incident-response", "courses-of-action", "detection-engineering", "kill-chain", "soc"]
banner: "/banners/posts/<new banner>"
bannerAlt: "A defender's decision surface: kill chain phases against courses of action"
visibility: "public"
```

File: `content/posts/courses-of-action-gain-loss.mdx`

## Style Checklist

- Focus blockquote + TL;DR; prescriptive prose; no em dashes; minimal bullets; tables where planned.
- `<Term>` on first use; new glossary entries below.
- Visuals planned from the start: 3 inline SVGs + 1 interactive + tables + 2 CollapsibleCode.
- Documented public case study reconstructed from public record (Coreflood takedown or a
  sinkhole/deception case; pick the cleanest at draft time).
- Hands-on exercise, annotated references (curl-verified), standalone conclusion.
- ~350-400 lines MDX.

## Outline

1. **TL;DR + framing.** When a security team finds something bad, the reflex is to block it. Block
   is one of seven possible responses, and it is frequently the worst one, because it protects you
   once while telling the adversary exactly which of their resources is burned. The Courses of
   Action matrix lays out the full option space; intelligence gain/loss makes the cost of each
   option explicit. This post is about choosing deliberately instead of reflexively.

2. **The reflex and its hidden cost.** Open on the block reflex. A phishing sender is identified;
   the firewall rule goes in; everyone moves on. What just happened invisibly: the adversary's next
   beacon fails, they learn that sender address is dead, they rotate it in an hour, and you have
   traded a permanent detection opportunity for a few hours of relief plus a tipped-off adversary.
   Introduce the core idea: every mitigating action you take is also a signal you send. Deny is not
   free; it is paid for in intelligence and in adversary awareness.

3. **The matrix.** The CoA matrix is kill chain phases (rows) against courses of action (columns);
   cells hold the indicators or TTPs you would act on for that phase in that way. It is the
   defender's mirror of the kill chain: the kill chain is what the adversary must do, the CoA
   matrix is what you can do back at each step. Origin in the Lockheed Martin Intelligence-Driven
   CND paper (six Ds); the seven-D refinement adds Discover as a distinct passive action.
   **Inline SVG 1: the matrix as a grid**, 7 phases x 7 Ds, with a couple of cells lit to show
   how one indicator populates a row, and the passive columns visually separated from mitigating.

4. **The seven Ds.** Walk them with original one-line examples per phase, grouped by the crucial
   distinction. **Passive (always do both):** Discover (historical search, retro-hunt: has this
   happened before) and Detect (alert if it happens again). These cost nothing strategically and
   apply to nearly every indicator. **Mitigating (choose exactly one):** Deny (prevent outright,
   e.g. perimeter block), Disrupt (interfere mid-event to cause failure, e.g. IPS reset, sandboxing),
   Degrade (slow it to buy response time, e.g. tarpitting, rate limits), Deceive (make the adversary
   believe they succeeded, e.g. sinkhole/honeypot redirection), Destroy (offensive, legal only for
   the few with authority: takedown, law enforcement action). Table: D, what it does, an original
   example, and whether it is passive or mitigating.

5. **Mutual exclusivity.** The rule that makes this a decision rather than a checklist: passive
   actions compose freely, mitigating actions do not. You cannot deny and deceive the same event,
   because denying it means the adversary never reaches the point where deception would work. So
   the operating procedure is: run both passive courses for every piece of intelligence, then
   select exactly one mitigating course. The whole post hinges on how you select that one.
   **Inline SVG 2:** a small decision diagram, indicator in, both passive actions always fire, then
   a single-select gate among the five mitigating actions.

6. **Intelligence gain/loss (the payoff).** The IC concept that names the tradeoff: every action
   has an intelligence gain (what you learn) and an intelligence loss (what you forgo, plus what
   you reveal to the adversary). Work one original indicator all the way through. Scenario: you
   identify a C2 callback domain used by a loader on one infected host. Compare the mitigating
   actions as a full gain/loss table:
   - Deny (sinkhole-block the domain at DNS): gain nothing new, adversary learns the domain is
     burned and rotates, you lose the ability to watch the loader's behavior.
   - Disrupt (kill the sessions but leave detection up): partial gain, adversary may notice
     instability, you stop this instance.
   - Degrade (heavily rate-limit the C2 channel): buys responder time, risks eventual success,
     low intelligence value.
   - Deceive (redirect the domain to your own sinkhole/controlled host): highest gain, you see
     every infected host that beacons, you learn the loader's second-stage behavior, and the
     adversary believes their infrastructure is live. Loss is near zero if done quietly.
   The lesson mirrors the intro: the reflexive Deny is often the lowest-gain, highest-signal option,
   and Deceive is frequently the analytically superior choice when you have the capability.
   **Interactive component: `<CoAMatrix />`** — the kill chain x seven-D grid with example actions
   per cell; clicking a mitigating cell opens a gain/loss panel for the worked C2-domain indicator
   under that action, with gain, loss, and adversary-awareness spelled out; passive columns styled
   distinctly and always "on." Companion file `content/visualizations/coa-matrix.md`.

7. **Documented case: the value of watching instead of blocking.** Reconstruct a public sinkhole /
   coordinated-takedown case from the record where deception/observation beat immediate blocking:
   the Conficker sinkhole and Working Group, or Kelihos/Coreflood law-enforcement sinkholes, where
   redirecting infrastructure to controlled hosts produced victim visibility and scale estimates
   that a quiet block never could have. Pick the cleanest sourced example at draft time. Frame it
   in gain/loss terms: blocking would have protected one network; sinkholing measured and
   ultimately dismantled a botnet.

8. **The matrix as an investment map.** The second, underused life of the CoA matrix. Empty cells
   are capability gaps: an action you cannot take for a phase because you lack the tooling, the
   access, or the authority. When the theoretically optimal mitigating action is repeatedly
   impossible ("we could sinkhole that domain, but nobody will approve internal DNS changes"),
   document it every time, because a pattern of blocked optimal actions is the evidence that funds
   the fix. Two axes for prioritizing gap closure: value of the action and cost to enable it.
   High-value/low-cost gaps are immediate wins; high-value/high-cost gaps are R&D and budget
   priorities. Table or the third SVG.
   **Inline SVG 3 (optional): value/cost quadrant** for capability gaps, with example actions placed.

9. **Where ATT&CK fits.** One paragraph: the CoA matrix is response options against kill chain
   phases; ATT&CK maps the adversary techniques you are responding to. You can drive CoA selection
   off ATT&CK technique coverage, choosing actions per technique rather than per phase for finer
   granularity, and D3FEND (already referenced elsewhere on the blog) maps defensive techniques to
   ATT&CK offensive ones, which is essentially a technique-level CoA vocabulary. Keep it short;
   ATT&CK is covered elsewhere.

10. **Hands-On Exercise.** Take one indicator from a recent incident or advisory. Place it in the
    correct kill chain phase. Write the theoretical action for all seven Ds against it (mark the
    two passive as always-on). For each of the five mitigating actions, write the one-line gain and
    the one-line loss including what it signals to the adversary. Choose the one mitigating action
    you would actually take and state why in gain/loss terms. Finally, for the option you judged
    best but cannot currently execute, write the one-line capability gap: what you would need, and
    what it would cost.

11. **Conclusion.** Blocking feels like winning and often is not; it is the option that trades the
    most future visibility for the least present effort, and it hands the adversary a free signal.
    The mature move is to run both passive actions every time, then choose the single mitigating
    action whose gain/loss balance actually serves the requirement, and to log every time you were
    forced into a worse action than the one you wanted. Related reading: the behavioral analytics,
    collection management, and Pyramid of Pain posts.

## Visuals Summary

- SVG 1: the CoA matrix grid (7 phases x 7 Ds) with a lit row and passive/mitigating separation
- SVG 2: passive-always + single-select-mitigating decision diagram
- SVG 3 (optional): value/cost quadrant for capability gap prioritization
- Interactive: `<CoAMatrix />` with per-cell examples and a gain/loss panel on mitigating cells
- Tables: the seven Ds (passive/mitigating); gain/loss comparison for the worked C2 indicator
- CollapsibleCode: a filled CoA matrix for one worked intrusion; a gain/loss worksheet template

Theme rules as established: currentColor + accent palette (sky, amber, emerald, violet, red),
no blank lines inside JSX blocks, captions under every figure, Fragment keys in mapped table rows.

## New Glossary Terms for term.tsx

courses-of-action, intelligence-gain-loss, sinkhole, honeypot, passive-defense (reuse if exists).
Reuse existing: kill-chain, c2, indicator-lifecycle, diamond-model, detection-engineering.

## References (curl-verify every URL at draft time)

1. Hutchins, Cloppert, Amin, Intelligence-Driven CND (Lockheed Martin) — the CoA matrix origin.
   URL verified working in prior posts.
2. Michael Cloppert, SANS "Attacking the Cyber Kill Chain" / CoA blog series — verify current URL.
3. MITRE D3FEND. https://d3fend.mitre.org/ — technique-level defensive vocabulary.
4. MITRE ATT&CK. https://attack.mitre.org/ — for the ATT&CK-fit section.
5. Conficker Working Group "Lessons Learned" report, or the ICANN/registry sinkhole record — for
   the documented deception/observation case. Verify canonical URL.
6. DOJ/FBI Coreflood or Kelihos takedown press release — alternative documented sinkhole case.
   Verify at draft time; pick whichever has the cleanest public primary source.
7. Cross-links (not references): behavioral analytics post, collection management post,
   Pyramid of Pain post, Analytic Judgment post.

## Writing Cautions

- The worked C2-domain indicator, the per-cell action examples, and the gain/loss table are all
  original inventions clearly framed as illustrative.
- The takedown/sinkhole case study strictly from the public record; do not overclaim operational
  detail beyond what the chosen source states.
- Destroy: keep the legal framing crisp and honest (offensive action, authority required, not for
  most orgs); do not encourage hack-back. This is a defensive-context post.
- Do not re-teach the kill chain phases in depth (name them, move on), the Diamond Model, or
  ATT&CK; one-paragraph cross-links.
- Verify every reference URL with the curl sweep before writing the references section.

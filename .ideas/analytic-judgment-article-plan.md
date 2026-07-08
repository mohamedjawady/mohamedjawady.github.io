# Article Plan — Analytic Judgment: How Intelligence Analysis Should Actually Be Done

Standalone post (NOT part of the CTI Foundations series). Self-contained: no dependency on
Parts 1/2 — may link to them as related reading, but every concept needed must live in this post.

> Source material scope: FOR578 (2021) pp. 19–45 — "Understanding Intelligence: The Field Before
> the Word Cyber." The deck is a **topic map only**. Write from the public primary sources the
> course itself cites (Heuer, Kent, JP 2-0, ICD 203, Kahneman, Diamond Model paper) — no lifted
> slide phrasing or structure. **All examples and case studies must be different from the ones
> used in the deck** (so: no 2020 election/Tyler Technologies ransomware case, no Operation
> Bodyguard, no "IP is C2" ladder example, no MindMup).

## Title

**"Analytic Judgment: How Intelligence Analysis Should Actually Be Done"**

Alternatives:
- "Thinking About Thinking: The Analysis Discipline Behind Good Threat Intelligence"
- "From Data to Judgment: The Craft of Intelligence Analysis"

## Frontmatter Draft

```yaml
title: "Analytic Judgment: How Intelligence Analysis Should Actually Be Done"
description: "What intelligence analysis actually is, how analysts reach defensible judgments under incomplete information, and the cognitive traps and structured techniques — from Kent's doctrine to Heuer's ACH — that separate assessment from guesswork."
date: "<publish date>"
author: "Mohamed Habib Jaouadi"
tags: ["intelligence-analysis", "threat-intelligence", "cognitive-bias", "structured-analytic-techniques", "ach", "analyst-tradecraft"]
banner: "/banners/posts/<new or cti.avif>"
bannerAlt: "Intelligence analysis tradecraft: from data to defensible judgment"
visibility: "public"
```

(No `series` / `seriesOrder` keys. File: `content/posts/analytic-judgment-intelligence-analysis.mdx`.)

## Style Checklist (house style from existing posts)

- Open with a `> **Focus:**` blockquote + `**TL;DR:**` paragraph.
- Direct, prescriptive voice; call out failure modes plainly.
- `<Term concept="...">` on first use of glossary terms.
- Only documented public case studies with named sources — never invented incidents.
- At least one decision table, one `<CollapsibleCode>` template, one interactive visualization.
- One worked example running end-to-end.
- "Hands-On Exercise" near the end; annotated "References & Further Reading"; no series teaser —
  close with a standalone conclusion (may add a "Related posts" pointer).
- Length target ~350–400 lines of MDX.

## Outline

1. **TL;DR + framing.** Every security team "does analysis," almost none can say what that means.
   Analysis is not summarizing reports or enriching indicators — it is producing a defensible
   judgment under incomplete information. The post teaches the discipline: what a judgment is,
   how your brain produces (and sabotages) one, and the structured techniques that catch errors
   before your consumers do.

2. **What analysis actually is.** Etymology (taking apart) + the synthesis half everyone forgets
   (recombining with outside knowledge into campaigns, profiles, assessments). The
   data → information → intelligence ladder with an original four-step example:
   - "`hr-payroll-view[.]com` resolved to 198.51.100.7 yesterday" — data
   - "The domain serves a credential-phishing kit also present on six sibling domains sharing a
     TLS certificate" — information
   - "Three finance employees received the lure this week" — information
   - "We assess with medium confidence this is broad opportunistic credential harvesting, not
     targeting of our sector; the kit's victim list spans 40+ unrelated industries" — intelligence
     (a judgment: assessment + confidence + evidence + implicit gap).
   Key point: intelligence never answers yes/no with certainty because you never have all the
   collection; the honest product is an assessment with confidence attached.
   Brief sidebar: classic INT disciplines (HUMINT/SIGINT/OSINT...) specialize by collection source;
   CTI is all-source by necessity — malware, infrastructure, victimology, OSINT fused — and each
   source cultivates its own bias in the analyst who loves it.

3. **The people who professionalized this.** Two short profiles, working content only:
   - **Sherman Kent** — analysis as a profession, not intuition. His doctrine as a 9-row table
     with a "what this means for your team" column (policymaker focus → serve the decision-maker,
     not your curiosity; intellectual rigor; bias avoidance; willingness to hear other judgments;
     collective responsibility; plain-language communication; candid admission of mistakes).
     "Interesting" is not a standard — "useful to a decision" is.
   - **Richards Heuer** — the psychology of why smart analysts get it wrong; *Psychology of
     Intelligence Analysis*; the line that anchors the post: the analyst's job is *transcending
     the limits of incomplete information through the exercise of analytic judgment*.

4. **Analytic judgment: the actual product.** A judgment = assessment + explicit confidence +
   acknowledged gaps + stated assumptions. It must be like a forensic finding: defensible,
   repeatable, reviewable — another analyst can trace how you got there.
   Include a compact **confidence rubric** (High/Medium/Low with evidence criteria) so the post
   stands alone.
   **Data-driven vs conceptually-driven analysis** decision table: data-driven works when the
   dataset and the model are solid (detection metrics, infrastructure clustering); conceptually-
   driven is what attribution and intent assessments actually are — undefined variables, competing
   mental models, "it depends." Rule: "it depends" is only legitimate when followed by *what* it
   depends on.

5. **How your brain analyzes — and betrays you.** Perception hook (original, not Heuer's figure):
   build our own repeated-word illusion as inline SVG — e.g. a triage-themed phrase like
   "REVIEW THE\nTHE ALERT QUEUE" — same mechanism (expectation-driven perception), our own artifact.
   Back it with the **invisible gorilla** selective-attention experiment (Simons & Chabris, 1999):
   watchers counting basketball passes miss a gorilla walking through the frame — the exact
   failure mode of an analyst told what to look for.
   - Working memory as the bottleneck; why models and buckets exist at all.
   - Pattern recognition three ways: template matching, prototype matching, top-down filling of
     gaps — mapped to triage: "that beacon pattern looks like Cobalt Strike" is prototype matching —
     fast, useful, and completely unverified until you check (plenty of frameworks imitate CS
     traffic; plenty of red teams run it legitimately).
   - **System 1 / System 2** table with SOC-real examples: System 1 handles phishing ticket #47
     of the day; System 2 is mandatory for anything that reaches leadership or drives an
     attribution call. Experienced analysts push routine calls into System 1 *deliberately* to
     buy System 2 time for hard problems — the skill is knowing which call is which.

6. **Mental models: putting data into buckets.** Why Kill Chain and the Diamond Model earn their
   keep: they offload working memory, force completeness ("what fills this bucket? nothing? that's
   a gap"), and make patterns visible across intrusions. Every model carries axioms — state them,
   or the model silently lies about situations it was never built for (e.g., the kill chain
   assumes an external intruder progressing inward; it fits an insider case badly).

7. **Where analysis breaks: bias.** Thesis: you cannot remove bias; you can only build process
   that catches it. Three covered deeply (not a bias zoo):
   - **Anchoring + confirmation bias — case study centerpiece: Olympic Destroyer (2018).**
     Malware disrupted the PyeongChang opening ceremony; it contained a Lazarus-style rich-header
     artifact, and early reporting anchored on North Korea. Kaspersky's GReAT then showed the
     header was a deliberate forgery — a false flag planted to exploit exactly this analytic
     shortcut — and the operation was later attributed to Russian GRU/Sandworm in the October 2020
     US DOJ indictment. Lesson: the most "diagnostic-looking" evidence was the cheapest to fake,
     and analysts who scored evidence by how well it *confirmed* the lead hypothesis were the
     intended audience of the deception.
   - **Supporting paragraph: TV5Monde (2015).** French broadcaster taken off air by attackers
     claiming to be the ISIS-affiliated "CyberCaliphate"; the claimed persona anchored initial
     reporting until forensic work (ANSSI, FireEye) pointed to APT28. Self-attribution is
     evidence *someone wants you to weigh*.
   - **Mirror imaging** — assuming the adversary optimizes like you would; one-line historical
     anchor from the traditional-intel world (the Iraq WMD estimate as the canonical documented
     failure of unchallenged assumptions and single-source anchoring — Silberman-Robb commission).
   - **Field-of-view bias from collection** — your worldview is your telemetry: an email-security
     vendor sees phishing-shaped threats, an OT vendor sees ICS-shaped ones, and a firm whose
     customers sit in Europe barely sees actors who only operate in APAC. Reading vendor
     reporting without asking "what can this vendor even see?" imports their collection bias as
     your assessment.
   - Structural control: cognitive diversity on the team — ten malware analysts produce
     malware-shaped intelligence.

8. **Structured Analytic Techniques + ACH worked example (the payoff section).**
   SATs in one paragraph + one table: six families (getting organized / exploration / diagnostic /
   reframing / foresight / decision support); common DNA = decomposition + visualization; the point
   is externalizing reasoning so it can be attacked before publication.
   Then the deep-dive: **Analysis of Competing Hypotheses**, start to finish, on an original
   scenario that rhymes with §7's false-flag theme: *your org's public web server is defaced
   with hacktivist messaging during a geopolitical flashpoint.* Hypotheses:
   1. genuine hacktivist collective (as claimed on the page),
   2. state-linked actor using a hacktivist front,
   3. opportunistic defacer exploiting a 3-week-old unpatched CMS bug at scale,
   4. insider with a grievance.
   - Build the evidence × hypothesis matrix; score consistency (C / I / N). Evidence rows include:
     the claimed persona, exploit used vs. public PoC availability, mass-scanning telemetry hitting
     the same CMS bug internet-wide, timing vs. the geopolitical event, whether other victims share
     any profile, access logs showing no prior recon.
   - The ACH move everyone misses: you refute, not confirm — the surviving hypothesis is the one
     with the least *inconsistent* evidence, not the most consistent (consistent evidence is cheap;
     the claimed persona is consistent with hypotheses 1, 2 AND 3).
   - Show the "exciting" hypothesis accumulating inconsistencies while the boring opportunistic
     one survives — ACH mechanically catching the §7 anchoring failure.
   - Close with sensitivity check: which single piece of evidence, if wrong, flips the judgment?
     That evidence gets flagged in the final product.
   Ship the matrix as a `<CollapsibleCode>` markdown template AND as the interactive component.

9. **The analyst's minimum toolkit.** Deliberately anticlimactic: brainstorm capture (mind maps,
   whiteboards, paper), sorting/pivoting (a spreadsheet is still the most underrated CTI tool),
   and a written judgment template. The tooling bar is low; the discipline bar is high. Provide a
   `<CollapsibleCode>` **Analytic Judgment Template**: requirement, assessment (one sentence),
   confidence + rubric justification, key evidence, inconsistent evidence, assumptions, gaps,
   what would change this judgment, review sign-off.

10. **Hands-On Exercise.** Take one recent public attribution claim (vendor blog or government
    advisory). Write the primary hypothesis + two alternatives; list evidence for/against each;
    run a mini-ACH; assign confidence with the rubric; name the single assumption that, if wrong,
    flips the call. Compare your confidence with the source's language — did they publish a
    judgment or a hypothesis?

11. **Conclusion.** Analysis is a discipline, not a talent. The difference between an assessment
    and a guess is not the analyst's brilliance — it is whether the reasoning survives being
    written down, attacked, and reviewed. You can't debias yourself; you can build a process that
    catches bias before your consumers pay for it.

## Interactive Components

- **`<ACHMatrix />`** (build): interactive ACH grid — user toggles each evidence/hypothesis cell
  through C / I / N, per-hypothesis inconsistency score updates live, least-inconsistent column
  highlighted; preloaded with the §8 defacement scenario, resettable to blank for the reader's
  own use. Companion file `content/visualizations/ach-matrix.md` per repo convention.
- **Perception figure** (§5): original inline SVG repeated-word illusion (our own phrase), plus a
  text description of the invisible-gorilla experiment — no copied figures.
- Optional, cut if scope grows: `<System1System2 />` comparison toggle.

## References & Further Reading (annotated, house style)

1. Heuer, *Psychology of Intelligence Analysis* — free PDF at cia.gov. Read ch. 1–3 for
   perception/memory, ch. 4 for analysis strategies, ch. 8 for ACH.
2. Heuer & Pherson, *Structured Analytic Techniques for Intelligence Analysis* — the SAT catalog;
   use to pick techniques per analytic problem.
3. *Sherman Kent and the Profession of Intelligence Analysis* (CIA Kent Center Occasional Papers) —
   the analytic doctrine principles in their original form.
4. Warner, "Wanted: A Definition of Intelligence" (Studies in Intelligence) — why defining
   intelligence is hard; the process-and-product duality.
5. ICD 203, Analytic Standards — the professional benchmark for sourcing, uncertainty expression,
   and analytic rigor; use it to grade your own products.
6. JP 2-0, Joint Intelligence — data/information/intelligence definitions and the lifecycle.
7. Kahneman, *Thinking, Fast and Slow* — the System 1/System 2 dual-process model.
8. Caltagirone, Pendergast, Betz — *The Diamond Model of Intrusion Analysis* (DTIC) — models,
   axioms, and data-into-buckets done right.
9. Simons & Chabris, "Gorillas in Our Midst" (1999) — selective attention; why analysts miss
   what they are not primed to see.
10. Kaspersky GReAT, "Olympic Destroyer is here to trick the industry" (Securelist, 2018) +
    US DOJ Sandworm indictment (Oct 2020) — the §7 false-flag case study record.
11. ANSSI / public reporting on the TV5Monde intrusion and its APT28 attribution — the §7
    supporting case.
12. Chris Sanders, "InfoSec Mental Models" — practitioner-level treatment of models in security.

## Writing Cautions

- No SANS slide text, structure, or deck examples: excluded specifically — the 2020 election /
  Tyler Technologies ransomware case, Operation Bodyguard, the deck's "IP is C2" ladder example,
  Heuer's printed triangle figure as-is, and MindMup. All replaced above with original or
  independently documented alternatives.
- Case studies (Olympic Destroyer, TV5Monde) must be reconstructed from the cited public record
  as our own bias analysis.
- Self-contained: include the confidence rubric inline (do not point to CTI Foundations Part 1
  as a dependency); linking to the series as related reading is fine.
- Intelligence lifecycle: one paragraph max, only where it situates "analysis & production" —
  the CTI Foundations series already owns the lifecycle deep-dive.

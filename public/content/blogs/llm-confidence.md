---
title: "LLM Confidence Isn't a Safety Gate"
date: "2026-10-09"
tags: ["Healthcare AI", "LLM Safety", "Evals"]
---

Hospitals exchange data in FHIR, but the codes inside it are often local. In the MIMIC-IV FHIR demo, **all 107,727 lab results** use the hospital's own code system: 498 local codes like `50912` for creatinine. None of them use LOINC, the standard vocabulary. A query for "all creatinine results" across MIMIC and a LOINC-coded source like Synthea silently misses every MIMIC row.

Mapping local codes to LOINC is normally expert work. I built FHIRFlow to see how far an LLM can take it, and I learned more from where it failed than from where it worked.

## The design: the LLM can't invent a code

LOINC has ~100,000 codes, and an LLM asked to "give the LOINC code for creatinine" will happily produce a plausible-looking wrong one. So the model never generates a code directly:

1. The LLM rewrites the local test into LOINC's own vocabulary ("Creatinine [Mass/volume] in Serum or Plasma"), using the unit and specimen from the FHIR record.
2. NLM's LOINC search retrieves candidates for those queries.
3. The LLM picks one candidate *or abstains*. Any answer outside the retrieved set is treated as an abstention, and there's a test for that.

Scored against MIT-LCP's curated mapping on a 40-code development set, this gets **65% exact matches**, vs 17.5% for a rule-based baseline and 7.5% for plain search. The codes it gets right cover 87% of those lab results, because it nails the common tests.

## The part that matters for safety

The obvious next step is to auto-apply confident mappings and send the rest to a human. The model reports a confidence for every pick. So I checked it.

**It said 0.95 on wrong answers.** Among picks with confidence ≥ 0.8, precision was barely better than a coin flip. Self-reported confidence was not measuring anything.

In a clinical data pipeline, that's the difference between a tool and a liability. A wrong LOINC code doesn't throw an error. It quietly puts a potassium result in a creatinine trend line.

## What I used instead

I tried a gate that doesn't depend on the model grading itself: auto-apply only when the LLM's pick **agrees with an independent rule-based strategy**. That reached 75% precision, but only covered 20% of codes. Honest summary: better than self-reported confidence, nowhere near good enough to remove a human from the loop.

## Takeaways

- **Constrain generation to retrieved options** whenever wrong answers are expensive. Abstaining is a feature.
- **Measure calibration before you trust a confidence score.** An uncalibrated number is worse than none, because it looks like a control.
- **Use agreement between independent methods** as a gate, and measure its precision like any other model.
- **Retrieval is the ceiling.** The right code was among the candidates 82.5% of the time; no picker can beat that. Better retrieval is the next lever, not a bigger model.

Code: [github.com/Naramkeshav59/FHIRFlow](https://github.com/Naramkeshav59/FHIRFlow)

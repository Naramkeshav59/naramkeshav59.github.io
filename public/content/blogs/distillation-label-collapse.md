---
title: "Distilling a 120B Model Into 2B for $0.20, and the 100% Score I Didn't Trust"
date: "2026-10-08"
tags: ["Fine-tuning", "Small Models", "Evals"]
---

Small models are having a moment: cheaper to serve, runnable on-prem, fast. The standard recipe is distillation: have a large "teacher" model label data, then fine-tune a small "student" on those labels. I tried it on ShuttleCast's coaching task, and the most useful result was a number I had to throw away.

## The setup

- **Teacher:** a 120B model on Groq writing structured coaching analyses (depth, suggestion type, what happened, what to try) for badminton rallies.
- **Student:** Qwen2-VL-2B, a small vision-language model, fine-tuned with QLoRA (4-bit base, LoRA rank 16).
- **Data:** 139 training examples, evaluated on 34 rallies from matches the student never saw. Split by match, not by rally, because rallies within a match share players and patterns and would leak.
- **Compute:** 10.4 minutes on a rented RTX A5000 at $0.27/hour. **Under $0.20.**

## The results

| | Untuned 2B | Fine-tuned 2B |
| --- | --- | --- |
| Follows the output format | 0% | **100%** |
| Suggestion similarity to teacher | — | 0.72 |
| Depth / suggestion-type agreement with teacher | — | 100% |

The untuned model was unusable: it echoed the template back (`DEPTH: deep|surface|skip`) instead of filling it in. After fine-tuning it produced valid, parseable analyses every time. That part is real.

## The 100% I didn't trust

Perfect agreement with the teacher on the agent's two decisions looked great, so I checked the label distribution.

**All 34 eval rallies were labelled `deep / shot_selection`.** So were 128 of the 141 training examples. The teacher had collapsed to essentially one answer, so a student that always outputs `deep / shot_selection` scores 100% without learning anything about rallies.

The agreement metric measured nothing. Two things went wrong upstream:

1. The teacher's labels weren't diverse, and I didn't check before training.
2. The eval set inherited the same collapse, so it couldn't detect it.

## What I'd do differently

- **Look at the label histogram before training,** not after scoring. One `value_counts()` would have caught this.
- **Report the metric that survives scrutiny.** Here that's format compliance (0% → 100%) and suggestion similarity (0.72, below my 0.75 target). Not the 100%.
- **Don't ship a student that misses the bar.** I didn't put it into production; the 120B still serves the app. Deciding not to ship is a legitimate outcome of an eval.
- **Fix the teacher first.** More varied teacher labels come before the next training run, or the student will faithfully learn the collapse.

Distillation is cheap now. Verifying what the student actually learned is the expensive part, and the part worth doing.

Code: [github.com/Naramkeshav59/Shuttlecast](https://github.com/Naramkeshav59/Shuttlecast) (see `training/`)

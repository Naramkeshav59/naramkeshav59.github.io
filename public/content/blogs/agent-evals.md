---
title: "My Agent Blamed the Winner: What Evals Catch That Demos Don't"
date: "2026-10-06"
tags: ["AI Agents", "Evals", "LLMOps"]
---

ShuttleCast is a ReAct agent that writes a coaching note for every rally of a professional badminton match. It reads the stroke-by-stroke data, looks at broadcast frames, decides whether the rally is worth analyzing, and writes what went wrong and what the player should have done instead.

The demo looked great. Every note read like a coach wrote it. Then I measured it.

## The metric

I picked the simplest check I could think of that a coaching note *must* pass: **does it blame the player who lost the rally?** ShuttleSet records the winner of every rally, so this is checkable without a human grader. A note that critiques the winner's "mistake" is wrong no matter how fluent it is.

On the first 20 rallies of a quarterfinal, the agent scored **62.5%**.

## What was actually happening

Reading the failures showed a pattern: the model kept critiquing player B, *including in rallies B won*. The prompt gave it the full stroke sequence and asked what went wrong, but never said who won. A smash that ends a rally looks like an aggressive choice either way. The model was guessing, and it guessed the same way most of the time.

The fix was one line in the generation prompt: state the winner and the loser.

## Measuring the fix properly

The tempting move is to re-run the agent and compare. But the agent makes three decisions per rally (whether to look at frames again, how deep to go, which kind of suggestion), and those decisions vary run to run. A re-run changes many things at once.

So I ran an A/B with **every agent decision held fixed** and only the generation prompt varied. Attribution went from **62.5% to 93.8%** (15 of 16 analyzed rallies).

## The second bug evals found

The same eval run surfaced something unrelated: **4 of 20 rallies failed outright** with malformed JSON. The agent was copying the whole stroke summary back into its tool-call arguments, and long, quote-heavy arguments are exactly where models break JSON.

The fix was architectural, not a prompt tweak: tools read the current rally from bound state, and tool arguments carry only the agent's own decisions. Failures went to **0 of 20**.

## What I'd tell anyone shipping an agent

- **Pick one metric the output must pass, even a crude one.** Winner attribution doesn't measure advice quality, but it caught a systematic error fluency hid completely.
- **Hold decisions fixed when you A/B a prompt.** Otherwise you're measuring noise.
- **Keep data out of tool arguments.** If the model doesn't need to decide it, it shouldn't have to type it.
- **State the caveats.** This was one match and 16 rallies, and the prompt now gives away who won, so attribution is easier than it sounds. A next eval should check whether the *advice* is right, not just aimed at the right player.

Code and eval scripts: [github.com/Naramkeshav59/Shuttlecast](https://github.com/Naramkeshav59/Shuttlecast)

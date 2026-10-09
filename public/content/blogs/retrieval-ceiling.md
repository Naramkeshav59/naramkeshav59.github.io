---
title: "Retrieval Is the Ceiling: Notes From Two RAG-Style Systems"
date: "2026-10-08"
tags: ["RAG", "Retrieval", "Evals"]
---

Most RAG tuning effort goes into the generator: better prompts, bigger models, rerankers. In the two retrieval systems I built this year, the numbers kept pointing somewhere else.

## FinSight: cited answers over SEC 10-K filings

FinSight answers questions about Apple, JPMorgan and Johnson & Johnson filings (FY2021–23) with numbered citations to the exact chunk each claim comes from. I benchmarked 9 combinations: 3 chunking strategies × 3 retrieval strategies (dense vectors, dense + BM25 hybrid, and hybrid + cross-encoder reranking).

The surprise: **adding a cross-encoder reranker lowered answer similarity** in every chunking setup (≈0.79 vs ≈0.84–0.85 without it), while adding latency.

The likely reason is a mismatch. The reranker (`ms-marco-MiniLM`) was trained on web search queries and passages. 10-K text is long, formal and full of near-duplicate boilerplate across years. A reranker that's excellent on its home distribution can reorder financial chunks *worse* than plain similarity.

Caveat: the eval set was 8 question-answer pairs, so treat this as a direction, not a verdict. The point stands: a component that "always helps" is a hypothesis until measured on your data.

## FHIRFlow: mapping hospital lab codes to LOINC

In FHIRFlow, an LLM maps hospital-local lab codes to the LOINC standard by picking from search results. Before tuning the LLM at all, I measured retrieval alone:

- Searching the hospital's label directly put the right code in the top 15 **only 42% of the time**, and ranked it first 6.5% of the time.
- Searching "creatinine serum" ranked a survey protocol above the actual serum creatinine test.

No picker can choose a code that was never retrieved. So the LLM's most valuable job turned out to be **query rewriting**: turning "Creatinine, Blood, mg/dL" into LOINC's own phrasing, "Creatinine [Mass/volume] in Serum or Plasma". With rewriting, the right code was in the candidate set 82.5% of the time, and end-to-end accuracy went from 17.5% (rules) to 65%.

## What I'd check first on any retrieval system

1. **Recall@k of retrieval alone,** before looking at generated answers. It's the upper bound on everything downstream.
2. **Whether queries and documents speak the same language.** Rewriting the query into the corpus's vocabulary was the biggest single win in FHIRFlow.
3. **Every "standard" component on your own data.** Rerankers, chunkers and embedding models are trained on someone else's distribution.
4. **A baseline that isn't strawman-weak.** FHIRFlow's rule-based rewrite (unit → property, specimen → system) beat plain search by 10 points. It's the bar the LLM had to clear, not the naive one.

Code: [FinSight](https://github.com/Naramkeshav59/finsight) · [FHIRFlow](https://github.com/Naramkeshav59/FHIRFlow)

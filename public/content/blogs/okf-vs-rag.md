---
title: "OKF vs RAG: Does Your Agent Need a Retriever or a Knowledge Format?"
date: "2026-10-09"
tags: ["RAG", "OKF", "AI Agents", "Knowledge Management"]
---

In June 2026 Google Cloud published the **Open Knowledge Format (OKF) v0.1**, an open specification for packaging knowledge so AI agents can read it. It landed in the middle of a long-running debate: if retrieval-augmented generation (RAG) already gives models access to documents, why do we need a *format*?

Because they solve different problems. RAG is a **runtime technique**: find relevant text and put it in the prompt. OKF is a **data contract**: decide how knowledge is written down in the first place. You can use either alone, but they work best together.

## What OKF actually is

An OKF bundle is a directory of Markdown files. Each file is one **concept**: a table, a metric, a runbook, an API. The file's path is its identity.

```text
sales/
├── index.md
├── tables/
│   ├── index.md
│   ├── orders.md
│   └── customers.md
└── metrics/
    └── weekly_active_users.md
```

Each concept starts with YAML frontmatter. Only one field is required, `type`. The standard fields worth filling in are `title`, `description`, `resource`, `tags` and `timestamp`:

```markdown
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
tags: [sales, revenue]
timestamp: 2026-05-28T14:30:00Z
---

Joined with [customers](/tables/customers.md) on `customer_id`.
```

Two filenames are reserved: `index.md` files let an agent drill down one level at a time, and `log.md` records how the bundle changed. Ordinary Markdown links between concepts turn the folder into a graph.

Google describes it as formalizing the "LLM wiki" pattern: the `AGENTS.md` files, Obsidian vaults and metadata-as-code repos that teams were already building by hand, each in its own shape.

## Side by side

| | Classic RAG | OKF |
| --- | --- | --- |
| **What it is** | A retrieval pipeline | A file format (a spec) |
| **Unit of knowledge** | Chunks cut from documents | One curated concept per file |
| **Structure** | Whatever survived chunking | Typed frontmatter + explicit links |
| **How an agent finds things** | Similarity search over embeddings | Navigate `index.md`, follow links, or search |
| **Who does the work** | Ingestion pipeline, at query time | A producer (human or agent), ahead of time |
| **Freshness signal** | Usually none | `timestamp` per concept, `log.md` per bundle |
| **Portability** | Locked to your vector DB and chunker | Plain files: any tool can read them |
| **Best at** | Large, messy, unstructured corpora | Curated, high-value operational knowledge |

## Where RAG struggles and OKF helps

**Chunking destroys structure.** A table's schema, its join keys and its caveats may land in three different chunks, and similarity search might return only one of them. In OKF that knowledge lives in one concept file with links to its neighbors, so the agent gets the whole thing.

**Retrieval can't tell you what's authoritative.** Ten wiki pages mention "active users", with three definitions. OKF's `type`, `resource` and `timestamp` fields make "this is the metric definition, it points at this source, it was updated last week" explicit.

**Agents need to navigate, not just search.** `index.md` gives progressive disclosure: an agent can read a short overview, choose a branch, and drill in, spending tokens only where they matter.

## Where OKF doesn't replace RAG

- **Scale.** Nobody is hand-curating a million support tickets into concepts. Large unstructured corpora still need retrieval.
- **It isn't a retrieval protocol.** v0.1 specifies how knowledge is stored, not how an agent queries it. At any real size you'll still index the bundle.
- **Quality moves upstream.** A format can't fix wrong content. If a producer agent drafts concepts badly, every consumer inherits the error, which is why provenance (`resource`) and freshness (`timestamp`) matter.
- **It's v0.1.** Google itself calls it "a starting point, not a finished standard". Expect the spec to change.

## The combination is the point

The strongest design uses OKF as the **source of truth** and retrieval as the **access path**:

1. Index each concept as one document, not arbitrary chunks, so a hit returns a complete, typed unit.
2. Use frontmatter as metadata filters: `type: metric`, recent `timestamp`, specific `tags`.
3. After retrieving a concept, **follow its links** to pull in the related tables and definitions it references.
4. Fall back to classic chunk-level RAG for the long tail of unstructured documents.

RAG answers *"how do I find relevant text?"* OKF answers *"what should the text look like so it's worth finding?"* As agents take on real operational work, the second question becomes more important than the first.

*Reference: Google Cloud, "How the Open Knowledge Format can improve data sharing" (June 2026), and the OKF spec in the `GoogleCloudPlatform/knowledge-catalog` repository.*

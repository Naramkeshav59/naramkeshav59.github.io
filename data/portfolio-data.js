export const portfolioData = {
  personal: {
    name: "Keshav Naram",
    title: "Machine Learning Engineer",
    tagline: "I ship ML that works on real data, not just benchmarks. Models, agents, pipelines, cloud, evals, end to end.",
    bio: "MS in Applied Machine Learning from the University of Maryland and a B.Tech in Electrical Engineering from IIT Dharwad. I own ML systems end to end: data, training, agents, evaluation, and the cloud infrastructure they ship on. I work where the data is messy and the stakes are real, and I don't call anything done until it's measured.",
    email: "naramkeshav59@gmail.com",
    github: "https://github.com/Naramkeshav59",
    linkedin: "https://www.linkedin.com/in/keshav-naram-33a834285/",
    resume: "/resume.pdf",
  },

  // Home page: one headline number per project, each with its baseline.
  results: [
    { metric: "0.87 F1", label: "Hit detection on raw broadcast video, vs 0.37 for an audio baseline", project: "ShuttleCast" },
    { metric: "62% → 94%", label: "Agent attributing errors to the right player, after evals exposed a bias", project: "ShuttleCast" },
    { metric: "65% vs 17.5%", label: "Hospital lab codes mapped to LOINC by an LLM, vs a rule-based baseline", project: "FHIRFlow" },
  ],

  projects: [
    {
      id: 1,
      title: "ShuttleCast: AI Coach for Pro Badminton",
      slug: "shuttlecast",
      description: "Turns any match video into per-rally coaching notes. Trained stroke models find the rallies, and a ReAct agent decides which ones are worth analyzing. Runs as an async AWS service.",
      fullDescription: "Problem: most badminton matches never get a human analyst, and most footage has no stroke labels. What I built: stroke-detection and shot-classification models trained on ShuttleSet (KDD 2023) that turn unlabelled video into rallies; a LangGraph ReAct agent that decides per rally whether to skip, write a brief note, or analyze in depth; and an async AWS service (API Gateway, Lambda, SQS, ECS Fargate, S3, DynamoDB in one CloudFormation stack) where you upload a video and coaching notes stream in rally by rally. I also distilled the 120B teacher into a 2B vision-language model with QLoRA on a rented GPU.",
      techStack: ["PyTorch", "DINOv2", "LangGraph", "AWS Fargate", "SQS", "Lambda", "DynamoDB", "CloudFormation", "QLoRA", "Streamlit"],
      github: "https://github.com/Naramkeshav59/Shuttlecast",
      demo: "",
      video: "/videos/shuttlecast-demo.mp4",
      youtube: "https://www.youtube.com/watch?v=1QtO1wVZCtc",
      highlights: [
        "Hit-detection F1 0.87 on raw broadcast footage of a held-out match, vs 0.37 for an audio-onset baseline",
        "Evals caught the agent blaming rally winners; a prompt fix raised correct attribution from 62% to 94% (A/B with decisions held fixed)",
        "Tool-call failures cut from 4/20 rallies to 0/20 by moving rally data out of tool arguments",
        "QLoRA on Qwen2-VL-2B: output-format compliance 0% to 100% on a $0.20 GPU run",
        "28 tests cover the full job flow (intake, queue, worker, S3, status) against simulated AWS"
      ],
      featured: true
    },
    {
      id: 2,
      title: "FHIRFlow: Making Hospital Lab Data Queryable",
      slug: "fhirflow",
      description: "Hospital FHIR exports code lab results in local vocabularies, so standard queries silently miss them. FHIRFlow validates FHIR into DuckDB and maps local lab codes to LOINC with a retrieval-grounded LLM.",
      fullDescription: "Problem: in the MIMIC-IV FHIR demo, 0% of 107,727 lab results are queryable by LOINC, because they use 498 hospital-local codes, so analytics combined with standard-coded data (Synthea) silently miss every MIMIC lab. What I built: a FHIR R4 to DuckDB pipeline with data-quality rules as queries, and an LLM code-repair layer that rewrites each local test into LOINC's vocabulary, retrieves candidates from NLM's LOINC search, and picks one of them or abstains. It can't invent a code, and uncertain picks go to human review. Scored against MIT-LCP's curated mapping.",
      techStack: ["Python", "DuckDB", "FHIR R4", "LOINC", "LLMs", "pytest"],
      github: "https://github.com/Naramkeshav59/FHIRFlow",
      demo: "",
      video: "",
      highlights: [
        "Showed 0% of MIMIC-IV's 107,727 lab results were queryable by LOINC (498 hospital-local codes)",
        "LLM mapping: 65% exact LOINC match vs 17.5% for a rule-based baseline and 7.5% for plain search (40-code dev set)",
        "The codes it maps correctly cover 87% of the sample's lab results, vs 66% with rules",
        "Constrained to retrieved candidates: it abstains rather than invent a code (tested)",
        "Found the LLM's self-reported confidence uncalibrated (0.95 on wrong answers), so agreement between methods gates auto-apply instead"
      ],
      featured: true
    },
    {
      id: 3,
      title: "FinSight: Cited Answers from SEC 10-K Filings",
      slug: "finsight",
      description: "A RAG system over Apple, JPMorgan and J&J 10-K filings (FY2021–23) that answers with numbered citations, compares filings year over year, and benchmarks its own retrieval strategies.",
      fullDescription: "Ingests 10-K filings from SEC EDGAR, chunks them three ways (fixed, recursive, section-aware), and retrieves with dense vectors, dense + BM25 hybrid fusion, or hybrid + cross-encoder reranking. Answers cite the exact chunk behind each claim, and a year-over-year view retrieves the same section from two filings and summarizes what changed. A benchmarking harness scores all 9 chunking × retrieval combinations on answer similarity, context relevance and latency, shown in a Streamlit dashboard with CI on every push.",
      techStack: ["RAG", "ChromaDB", "BM25", "sentence-transformers", "Cross-encoder", "Groq / Ollama", "Streamlit", "GitHub Actions"],
      github: "https://github.com/Naramkeshav59/finsight",
      demo: "",
      video: "/videos/finsight-demo.mp4",
      youtube: "https://www.youtube.com/watch?v=IpwAQtVk1mU",
      highlights: [
        "Benchmarked 9 chunking × retrieval strategies on answer similarity, context relevance and latency",
        "Found cross-encoder reranking lowered answer similarity on 10-K text (≈0.79 vs ≈0.85): a web-trained reranker on formal financial filings",
        "Every answer cites its source chunks; the year-over-year view puts both years' sources side by side",
        "Runs fully local (Ollama + ChromaDB) or on a hosted LLM with one environment variable"
      ],
      featured: true
    }
  ],

  blogs: [
    {
      id: 1,
      slug: "agent-evals",
      title: "My Agent Blamed the Winner: What Evals Catch That Demos Don't",
      excerpt: "Fluent coaching notes hid a systematic error: the agent kept critiquing the player who won. One crude metric caught it; a one-line fix took accuracy from 62.5% to 93.8%.",
      date: "2026-10-06",
      readTime: 4,
      tags: ["AI Agents", "Evals", "LLMOps"],
    },
    {
      id: 2,
      slug: "llm-confidence",
      title: "LLM Confidence Isn't a Safety Gate",
      excerpt: "Mapping hospital lab codes to LOINC, my LLM reported 0.95 confidence on wrong answers. What I used instead, and why it matters in clinical data.",
      date: "2026-10-09",
      readTime: 4,
      tags: ["Healthcare AI", "LLM Safety", "Evals"],
    },
    {
      id: 3,
      slug: "retrieval-ceiling",
      title: "Retrieval Is the Ceiling: Notes From Two RAG-Style Systems",
      excerpt: "A reranker that made answers worse, and a search step that missed the right answer 58% of the time. Why I measure retrieval before touching the generator.",
      date: "2026-10-08",
      readTime: 4,
      tags: ["RAG", "Retrieval", "Evals"],
    },
    {
      id: 4,
      slug: "distillation-label-collapse",
      title: "Distilling a 120B Model Into 2B for $0.20, and the 100% Score I Didn't Trust",
      excerpt: "QLoRA took a small vision-language model from unusable to 100% format compliance. Then a perfect agreement score turned out to measure nothing.",
      date: "2026-10-08",
      readTime: 4,
      tags: ["Fine-tuning", "Small Models", "Evals"],
    }
  ],

  skills: {
    "ML / AI": ["PyTorch", "Hugging Face", "PEFT / QLoRA", "LangChain / LangGraph", "RAG", "Whisper / Wav2Vec 2.0", "OpenCV"],
    "MLOps / Cloud": ["AWS (Lambda, SQS, ECS Fargate, S3, DynamoDB)", "CloudFormation", "Docker", "Kubernetes", "Airflow", "MLflow", "GitHub Actions"],
    "Languages / Tools": ["Python", "SQL", "Bash", "DuckDB", "Streamlit", "Flask", "pytest"],
    "Specializations": ["AI Agents", "Multimodal AI", "Evaluation", "Fine-tuning", "Clinical data (FHIR)"]
  }
};

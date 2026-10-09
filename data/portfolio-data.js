export const portfolioData = {
  personal: {
    name: "Keshav Naram",
    title: "Machine Learning Engineer",
    tagline: "LLM agents, vision and speech models, and the cloud and data infrastructure they run on",
    bio: "MS in Applied Machine Learning from the University of Maryland. I build ML systems end to end, from training models and building agents to deploying them on AWS, and I measure each one against ground truth with its baseline stated.",
    email: "naramkeshav59@gmail.com",
    github: "https://github.com/Naramkeshav59",
    linkedin: "https://www.linkedin.com/in/keshav-naram-33a834285/",
    twitter: "https://share.google/VPhBNVfGMXQvxljiY",
    resume: "/resume.pdf",
  },

  projects: [
    {
      id: 1,
      title: "ShuttleCast: AI Coach for Pro Badminton",
      slug: "shuttlecast",
      description: "Most matches never get an analyst. ShuttleCast turns any match video into per-rally coaching notes: trained stroke models find the rallies, and a ReAct agent decides which ones are worth analyzing.",
      fullDescription: "Problem: most badminton matches (amateur leagues, regional tournaments) never get a human analyst, and most footage has no stroke labels. What I built: stroke-detection and shot-classification models trained on ShuttleSet (KDD 2023) that turn unlabelled video into rallies; a LangGraph ReAct agent that decides per rally whether to skip, write a brief note, or analyze in depth; and an async AWS service (API Gateway, Lambda, SQS, ECS Fargate, S3, DynamoDB in one CloudFormation stack) where you upload a video and coaching notes stream in rally by rally. I also distilled the 120B teacher into a 2B vision-language model with QLoRA on a RunPod GPU.",
      techStack: ["PyTorch", "DINOv2", "LangGraph", "Groq", "AWS Fargate", "SQS", "Lambda", "DynamoDB", "CloudFormation", "QLoRA", "Streamlit"],
      github: "https://github.com/Naramkeshav59/Shuttlecast",
      demo: "",
      video: "/videos/shuttlecast-demo.mp4",
      highlights: [
        "Hit-detection F1 0.87 on raw broadcast footage of a held-out match, vs 0.37 for an audio-onset baseline",
        "Evals caught the agent blaming rally winners; a prompt fix raised correct attribution from 62% to 94% (A/B with decisions held fixed)",
        "Tool-call failures cut from 4/20 rallies to 0/20 by moving rally data out of tool arguments",
        "QLoRA on Qwen2-VL-2B: output-format compliance 0% to 100% for under $0.20 of GPU time",
        "28 tests cover the full job flow (intake, queue, worker, S3, status) against simulated AWS"
      ],
      featured: true
    },
    {
      id: 2,
      title: "FHIRFlow: Making Hospital Lab Data Queryable",
      slug: "fhirflow",
      description: "Hospital FHIR exports code lab results in local vocabularies, so standard queries silently miss them. FHIRFlow validates FHIR into a DuckDB warehouse and maps local lab codes to LOINC with a retrieval-grounded LLM.",
      fullDescription: "Problem: in the MIMIC-IV FHIR demo, 0% of 107,727 lab results are queryable by LOINC, because they use 498 hospital-local codes, so cross-source analytics with standard-coded data (Synthea) silently miss every MIMIC lab. Mapping codes by hand is weeks of expert work. What I built: a FHIR R4 to DuckDB pipeline with data-quality rules as queries, and an LLM code-repair layer that rewrites each local test into LOINC's vocabulary, retrieves candidates from NLM's LOINC search, and picks one of those candidates or abstains. It can't invent a code, and uncertain picks go to human review. It's scored against MIT-LCP's curated mapping.",
      techStack: ["Python", "DuckDB", "FHIR R4", "LOINC", "Groq", "pytest"],
      github: "https://github.com/Naramkeshav59/FHIRFlow",
      demo: "",
      video: "",
      highlights: [
        "Showed 0% of MIMIC-IV's 107,727 lab results were queryable by LOINC (498 hospital-local codes)",
        "LLM mapping: 65% exact LOINC match vs 17.5% for a rule-based baseline and 7.5% for plain search (40-code dev set)",
        "Those codes cover 87% of the sample's lab results, vs 66% with rules",
        "The LLM can only pick retrieved codes, or abstain; it can't invent a code (tested)",
        "Found that the LLM's self-reported confidence is uncalibrated (0.95 on wrong answers), so it can't gate auto-apply"
      ],
      featured: true
    }
  ],

  blogs: [
    {
      id: 1,
      slug: "multimodal-llms",
      title: "Understanding Multimodal LLMs: A Deep Dive",
      excerpt: "Exploring the architecture and capabilities of modern multimodal large language models, from CLIP to GPT-4 Vision.",
      date: "2024-01-15",
      readTime: 8,
      tags: ["LLMs", "Multimodal AI", "Research"],
      category: "Research",
      featured: true
    },
    {
      id: 2,
      slug: "building-ai-agents",
      title: "Building Production-Ready AI Agents",
      excerpt: "A comprehensive guide to designing, implementing, and deploying autonomous AI agents in production environments.",
      date: "2024-01-28",
      readTime: 12,
      tags: ["AI Agents", "LangChain", "Production"],
      category: "Tutorial",
      featured: true
    },
    {
      id: 3,
      slug: "fine-tuning-vlms",
      title: "Fine-tuning Vision-Language Models",
      excerpt: "Lessons learned from fine-tuning vision-language models on custom datasets for specialized applications.",
      date: "2024-02-10",
      readTime: 10,
      tags: ["Computer Vision", "Fine-tuning", "MLOps"],
      category: "Research",
      featured: false
    }
  ],

  skills: {
    "ML / AI": ["PyTorch", "Hugging Face", "PEFT / QLoRA", "LangChain / LangGraph", "RAG", "Whisper / Wav2Vec 2.0", "OpenCV"],
    "MLOps / Cloud": ["AWS (Lambda, SQS, ECS Fargate, S3, DynamoDB)", "CloudFormation", "Docker", "Kubernetes", "Airflow", "MLflow", "GitHub Actions"],
    "Languages / Tools": ["Python", "SQL", "Bash", "DuckDB", "Streamlit", "Flask", "pytest"],
    "Specializations": ["AI Agents", "Multimodal AI", "Evaluation", "Fine-tuning", "Clinical data (FHIR)"]
  }
};
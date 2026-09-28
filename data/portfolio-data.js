export const portfolioData = {
  personal: {
    name: "Keshav Naram",
    title: "Aspiring Machine Learning Engineer",
    tagline: "Building intelligent multimodal applications and AI agents",
    bio: "Passionate about pushing the boundaries of Generative AI. Specialized in developing production-ready multimodal applications, AI agents, and LLM-powered solutions. Currently exploring the intersection of vision-language models and autonomous systems.",
    email: "naramkeshav59@gmail.com",
    github: "https://github.com/Naramkeshav59",
    linkedin: "https://www.linkedin.com/in/keshav-naram-33a834285/",
    twitter: "https://share.google/VPhBNVfGMXQvxljiY",
    resume: "/resume.pdf",
  },

  projects: [
    {
      id: 1,
      title: "Multimodal AI Assistant",
      slug: "multimodal-ai-assistant",
      description: "An intelligent assistant that processes text, images, and audio inputs to provide contextual responses using vision-language models.",
      fullDescription: "Built a production-grade multimodal AI assistant capable of understanding and responding to complex queries involving text, images, and audio. The system leverages state-of-the-art vision-language models and implements advanced prompt engineering techniques for optimal performance. The assistant integrates seamlessly with existing workflows and provides real-time responses with high accuracy.",
      techStack: [
        "GPT-4 Vision",
        "LangChain",
        "Whisper API",
        "FastAPI",
        "React",
        "PostgreSQL",
        "Redis",
        "Docker"
      ],
      github: "https://github.com/yourusername/multimodal-assistant",
      demo: "",
      video: "",
      highlights: [
        "Processes 1000+ multimodal queries daily with 99.8% uptime",
        "Achieved 94% user satisfaction rate through continuous feedback loops",
        "Reduced response time by 40% through optimized prompting and caching",
        "Implemented custom RAG pipeline for domain-specific knowledge retrieval",
        "Built comprehensive monitoring and logging system"
      ],
      featured: true
    },
    {
      id: 2,
      title: "Autonomous Research Agent",
      slug: "autonomous-research-agent",
      description: "An AI agent that autonomously conducts research, synthesizes information from multiple sources, and generates comprehensive reports.",
      fullDescription: "Developed an autonomous AI agent that can perform end-to-end research tasks including web scraping, information synthesis, and report generation. The agent uses advanced planning and reasoning capabilities to break down complex research questions into manageable sub-tasks. It integrates with multiple data sources and employs sophisticated retrieval and ranking algorithms.",
      techStack: [
        "Claude API",
        "LlamaIndex",
        "Playwright",
        "Python",
        "Redis",
        "Celery",
        "MongoDB",
        "Pinecone"
      ],
      github: "https://github.com/yourusername/research-agent",
      demo: "https://research-agent-demo.vercel.app",
      video: "",
      highlights: [
        "Automated research workflow saving 15+ hours per week",
        "Integrated with 20+ data sources including academic databases",
        "Built custom RAG pipeline with 92% retrieval accuracy",
        "Implemented multi-agent collaboration for complex research tasks",
        "Generated over 500 comprehensive research reports"
      ],
      featured: true
    },
    {
      id: 3,
      title: "Visual Question Answering System",
      slug: "visual-qa-system",
      description: "A production-grade VQA system that answers complex questions about images using state-of-the-art vision transformers.",
      fullDescription: "Created a scalable visual question answering system that combines computer vision and natural language processing to understand and answer questions about images. Fine-tuned on domain-specific datasets and deployed with comprehensive monitoring. The system handles multiple image formats and question types with high accuracy.",
      techStack: [
        "CLIP",
        "LLaVA",
        "Hugging Face",
        "Streamlit",
        "Docker",
        "AWS",
        "PostgreSQL",
        "S3"
      ],
      github: "https://github.com/yourusername/visual-qa",
      demo: "",
      video: "",
      highlights: [
        "Fine-tuned on domain-specific dataset of 50K+ images",
        "Achieved 89% accuracy on benchmark VQA datasets",
        "Deployed with 99.9% uptime and comprehensive monitoring",
        "Handles 500+ concurrent requests with auto-scaling",
        "Reduced inference time by 60% through optimization"
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
    "AI/ML Frameworks": [
      "LangChain",
      "LlamaIndex",
      "Hugging Face",
      "OpenAI API",
      "Anthropic API"
    ],
    "Languages": [
      "Python",
      "JavaScript",
      "TypeScript",
      "SQL"
    ],
    "Tools & Infrastructure": [
      "Docker",
      "AWS",
      "Vercel",
      "PostgreSQL",
      "Redis",
      "Pinecone"
    ],
    "Specializations": [
      "Multimodal AI",
      "AI Agents",
      "RAG Systems",
      "Fine-tuning",
      "Prompt Engineering"
    ]
  }
};
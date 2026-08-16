export type DemoExample = {
  id: string;
  label: string;
  title: string;
  description: string;
  hook: string;
  post: string;
  duration: string;
  accent: "coral" | "lime" | "blue" | "violet";
};

export const marketingContent = {
  nav: [
    { label: "Examples", href: "#examples" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Use cases", href: "#use-cases" },
    { label: "FAQ", href: "#faq" },
  ],
  hero: {
    eyebrow: "Release communication, assembled",
    title: "Turn a shipped feature into a release worth watching.",
    description:
      "ReleaseFlow turns a rough browser recording and a few product notes into a polished release video and launch-ready social copy.",
    note: "Current workflow · browser recording in, Release Pack out",
  },
  productEntry: {
    inputLabel: "Start with",
    inputValue: "Browser recording",
    outputLabel: "Walk away with",
    outputValue: "Video + launch copy",
    action: "Create a Release Pack",
    footnote: "MP4 or MOV · deterministic local mode available",
  },
  proof: {
    eyebrow: "Internal demo gallery",
    title: "One release. Every surface ready.",
    description:
      "Explore provisional examples that show the presentation system—not customer work. Production media can replace them without changing the page.",
  },
  demos: [
    {
      id: "search",
      label: "AI Search",
      title: "Find the right work without remembering where it lives.",
      description: "A search launch shaped into a compact product story with a clear outcome.",
      hook: "Search every project in plain English",
      post: "Your workspace finally answers back. AI Search is now live across projects, tasks, and docs.",
      duration: "00:24",
      accent: "coral",
    },
    {
      id: "approvals",
      label: "Approvals",
      title: "Move work forward without chasing the next reviewer.",
      description: "A workflow update framed around momentum rather than a list of controls.",
      hook: "Approvals that keep moving",
      post: "Route, review, and resolve approvals from one place—with the full decision trail attached.",
      duration: "00:19",
      accent: "lime",
    },
    {
      id: "insights",
      label: "Usage Insights",
      title: "See adoption while there is still time to act.",
      description: "A dense analytics capability translated into an easy-to-follow release narrative.",
      hook: "Know what users adopt next",
      post: "Usage Insights turns feature activity into a clear view of adoption, drop-off, and opportunity.",
      duration: "00:27",
      accent: "blue",
    },
    {
      id: "deployments",
      label: "Deploy Guard",
      title: "Ship with context before risk reaches production.",
      description: "A technical release made legible through precise pacing and restrained annotation.",
      hook: "Catch deployment risk earlier",
      post: "Deploy Guard now flags release risk before production and keeps every check tied to the change.",
      duration: "00:22",
      accent: "violet",
    },
  ] satisfies DemoExample[],
  transformation: {
    eyebrow: "Before → after",
    title: "The feature is done. The announcement can be, too.",
    description:
      "ReleaseFlow converts the material already around a launch into a coherent Release Pack—without turning your team into a video studio.",
    before: {
      label: "Raw handoff",
      title: "A recording and scattered context",
      items: ["Cursor-heavy walkthrough", "Feature notes in a draft", "No launch framing", "Three channels still waiting"],
    },
    after: {
      label: "Release Pack",
      title: "A finished announcement system",
      items: ["Focused 1080p release video", "Clear hook and outcome", "English X post", "English LinkedIn post"],
    },
  },
  process: {
    eyebrow: "How it works",
    title: "From product walkthrough to publishable story.",
    steps: [
      {
        number: "01",
        title: "Bring the raw release",
        description: "Add a browser recording, feature name, and the context a customer should understand.",
      },
      {
        number: "02",
        title: "Shape the signal",
        description: "ReleaseFlow selects moments, plans the story, and writes copy around the product outcome.",
      },
      {
        number: "03",
        title: "Review the Release Pack",
        description: "Preview the video, copy the posts, or regenerate with one focused direction.",
      },
    ],
  },
  capability: {
    eyebrow: "One source, coordinated outputs",
    title: "Built for the part after “shipped.”",
    description:
      "The current ReleaseFlow pipeline keeps product footage, story structure, and launch copy moving together—so refinement happens as one release, not three disconnected tasks.",
    points: ["Visual story planning", "Focused captions and pacing", "Channel-ready launch copy"],
  },
  useCases: {
    eyebrow: "Current focus",
    title: "For small teams with real features and no launch department.",
    description: "These audiences are the current hypothesis, deliberately isolated from the reusable site system.",
    items: [
      {
        kicker: "Founder-led SaaS",
        title: "Make a release feel considered without adding a production sprint.",
      },
      {
        kicker: "Developer tools",
        title: "Explain technical value with product evidence, not inflated claims.",
      },
      {
        kicker: "Product teams",
        title: "Turn the walkthrough already used internally into a cleaner external story.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "The practical details.",
    items: [
      {
        question: "What does ReleaseFlow create today?",
        answer: "The current product creates a 1080p H.264 release video plus English copy for X and LinkedIn from a browser recording and feature details.",
      },
      {
        question: "What kind of recording can I use?",
        answer: "The current flow accepts an MP4 or MOV browser recording up to 500 MB and 90 seconds. The product validates the media before processing it.",
      },
      {
        question: "Can I refine the first result?",
        answer: "Yes. After generation, you can regenerate the Release Pack with a focused direction such as shorter, more energetic, less text, or a custom instruction.",
      },
      {
        question: "Does it require an OpenAI API key?",
        answer: "No. The local product includes a deterministic fallback so the complete workflow remains usable without OPENAI_API_KEY. An OpenAI provider can be configured separately.",
      },
      {
        question: "Are the examples on this page customer work?",
        answer: "No. They are clearly labeled internal demos used to show the page and presentation system until production demo media is available.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Your feature already has the footage",
    title: "Finish the release while the moment still matters.",
    action: "Start creating",
    note: "Open the current ReleaseFlow builder",
  },
} as const;

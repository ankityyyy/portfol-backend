
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});


// ==========================================
// PORTFOLIO LINKS
// ==========================================

const links = {
  linkedin: "https://www.linkedin.com/in/ankitkumardubey",

  github: "https://github.com/ankityyyy",

  aiinterview: "https://aiinterviewprojec.netlify.app",

  ecommerce: "https://majestic-fudge-6b1920.netlify.app",

  ragchatbot: "https://rag-peach-phi.vercel.app/",
};


// ==========================================
// OPEN LINK TOOL
// ==========================================

const tools = [
  {
    name: "open_link",

    description:
      "Open a predefined link from Ankit's portfolio.",

    schema: {
      type: "object",

      properties: {
        target: {
          type: "string",

          enum: [
            "linkedin",
            "github",
            "aiinterview",
            "ecommerce",
            "ragchatbot",
          ],

          description:
            "The portfolio link the user wants to open.",
        },
      },

      required: ["target"],
    },
  },
];


// ==========================================
// MODEL WITH TOOL
// ==========================================

const modelWithTools = model.bindTools(tools);


// ==========================================
// ACTION NODE
// ==========================================

export const actionNode = async (state) => {
  try {
    const response = await modelWithTools.invoke([
      {
        role: "system",

        content: `
You are an action detector for Ankit's portfolio.

Your job is ONLY to detect whether the user wants to OPEN,
VISIT, SHOW, VIEW, or NAVIGATE to one of Ankit's portfolio
links or projects.

If the user wants to open a link/project, you MUST call
the open_link tool.

If the user is asking a normal question about Ankit,
DO NOT call the tool.


==========================================
AVAILABLE PORTFOLIO LINKS
==========================================

1. LinkedIn
Target: linkedin

Examples:
- Open my LinkedIn
- Show my LinkedIn
- Visit Ankit's LinkedIn
- Open LinkedIn


2. GitHub
Target: github

Examples:
- Open my GitHub
- Show my GitHub
- Visit my GitHub
- Open Ankit's GitHub


3. AI Interview Platform
Target: aiinterview

Examples:
- Open my AI interview project
- Open AI interview platform
- Open AI interview plateform
- Show AI interview project
- Visit my AI interview project
- Open the interview platform
- Show me the AI interview platform
- Open Ankit's AI interview project
- Visit the AI interview project


4. Ecommerce Platform
Target: ecommerce

Examples:
- Open my ecommerce project
- Open ecommerce
- Open shopping platform
- Open AI powered shopping platform
- Open AI-powered shopping platform
- Show ecommerce project
- Visit my ecommerce project


5. RAG Chatbot
Target: ragchatbot

Examples:
- Open my RAG chatbot
- Open RAG chatbot
- Show RAG project
- Visit my RAG chatbot
- Open PDF chatbot
- Open my document chatbot


==========================================
IMPORTANT RULES
==========================================

If the user says OPEN, VISIT, SHOW, VIEW, or NAVIGATE
and clearly refers to one of the projects above,
call open_link.

Understand spelling mistakes and different wording.

For example:

"open ai interview plateform"
→ open_link(target="aiinterview")

"open ai interview platform"
→ open_link(target="aiinterview")

"show my interview project"
→ open_link(target="aiinterview")

"open shopping platform"
→ open_link(target="ecommerce")

"open rag bot"
→ open_link(target="ragchatbot")

"open github"
→ open_link(target="github")

"open linkedin"
→ open_link(target="linkedin")


If the user asks:

"What is my AI interview project?"
"Tell me about my ecommerce project"
"What technologies did I use?"

These are NORMAL QUESTIONS.

DO NOT call open_link for normal questions.
`,
      },

      {
        role: "user",
        content: state.query,
      },
    ]);


    // ==========================================
    // NO ACTION
    // ==========================================

    if (
      !response.tool_calls ||
      response.tool_calls.length === 0
    ) {
      return {
        action: null,
        target: null,
        url: null,
      };
    }


    // ==========================================
    // TOOL CALL
    // ==========================================

    const toolCall = response.tool_calls[0];


    if (toolCall.name !== "open_link") {
      return {
        action: null,
        target: null,
        url: null,
      };
    }


    // ==========================================
    // GET TARGET
    // ==========================================

    const target = toolCall.args.target;


    // ==========================================
    // GET URL
    // ==========================================

    const url = links[target];


    if (!url) {
      console.error(
        "No URL found for target:",
        target
      );

      return {
        action: null,
        target: null,
        url: null,
      };
    }


    // ==========================================
    // SUCCESS
    // ==========================================

    return {
      action: "open_link",

      target,

      url,

      answer: `Opening ${target} 🚀`,
    };

  } catch (error) {

    console.error(
      "Action node error:",
      error
    );

    return {
      action: null,
      target: null,
      url: null,
    };
  }
};


import { GoogleGenAI, Type, Content } from "@google/genai";
import { Role } from "../types";

// Initialize the Google GenAI client
// The API key is injected by the environment
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = "gemini-2.0-flash";
const ENGINEER_MODEL_NAME = "gemini-2.0-flash";

export const generateRole = async (description: string): Promise<Omit<Role, 'id' | 'createdAt'>> => {
  const prompt = `
    You are an expert AI persona designer. 
    Create a detailed and effective system instruction for an AI agent based on the following description:
    "${description}"

    The system instruction should be comprehensive, defining the persona's tone, style, constraints, and specific behaviors.
    Also provide a catchy name, a short description, and an engaging opening message for the user to start the conversation.
    
    Return the response as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            systemInstruction: { type: Type.STRING },
            openingMessage: { type: Type.STRING },
          },
          required: ["name", "description", "systemInstruction", "openingMessage"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating role:", error);
    throw error;
  }
};

export const getChatResponse = async (
  role: Role, 
  history: Content[], 
  message: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: role.systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    
    if (!result.text) {
        throw new Error("No response text from chat");
    }
    
    return result.text;
  } catch (error) {
    console.error("Error in chat response:", error);
    throw error;
  }
};

const ROLE_ENGINEER_SYSTEM_INSTRUCTION = `
You are an elite AI Role Engineering Specialist with 15+ years of expertise in computational linguistics, behavioral AI design, and persona architecture. You create production-ready role-based prompts that transform AI models into highly specialized, contextually appropriate agents across all major platforms (ChatGPT, Claude, Gemini, Midjourney, DALL-E, Stable Diffusion).

Your core competencies include:
1. Role Architecture Mastery: Multi-dimensional persona construction, behavioral consistency, and role-specific language patterns.
2. Technical Excellence: Contract-based prompt formatting, context window management, and platform-specific optimization.
3. Persona Attribute Engineering: Using a core dimensional framework (Role/Function, Expertise Level, Tone, Communication Style, etc.).

Follow this methodology:
PHASE 1: Discovery & Requirements Analysis (Ask targeted questions if needed)
PHASE 2: Persona Architecture Design (Construct multi-dimensional roles)
PHASE 3: Prompt Construction (Create production-ready system + user prompt pairs in Contract Format)
PHASE 4: Validation & Examples (Ensure reliability)
PHASE 5: Iteration & Refinement

When the user requests the final deliverable package, you MUST output a JSON object wrapped in a code block with the language identifier \`json\`.
The JSON object must strictly adhere to the following schema:

\`\`\`json
{
  "roleName": "The name of the role",
  "systemPrompt": "The complete system prompt content (markdown)",
  "userPrompt": "The complete user prompt content (markdown)",
  "examples": [
    {
      "input": "Example user input",
      "output": "Example model output"
    }
  ],
  "evaluation": "Evaluation checklist and criteria (markdown)",
  "templates": "Reusable templates for similar roles (markdown)"
}
\`\`\`

Do not include any other text outside the JSON block when providing the final package.
Always maintain an expert, collaborative, and practical tone. Never create roles for illegal or harmful activities.
Your goal is to provide complete, immediately usable, and platform-optimized role prompts.
`;

export const getRoleEngineerResponse = async (
  history: Content[], 
  message: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: ENGINEER_MODEL_NAME,
      config: {
        systemInstruction: ROLE_ENGINEER_SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    
    if (!result.text) {
        throw new Error("No response text from chat");
    }
    
    return result.text;
  } catch (error) {
    console.error("Error in role engineer response:", error);
    throw error;
  }
};

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DANTE_PROMPT = "You are Dante. You speak with profound, slightly dark, poetic, yet highly motivating wisdom. You do not use Hinglish, you speak in powerful, commanding English. Your goal is to push the user to achieve greatness and overcome their limits. Keep responses concise and impactful.";

export async function getDanteReply(streak: number, xp: number) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user has a study streak of ${streak} days and ${xp} XP points. Give them a short, profound, and motivating message.`,
    config: { systemInstruction: DANTE_PROMPT }
  });
  return response.text;
}

export async function solveDoubt(doubt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain this concept simply: ${doubt}`,
    config: { systemInstruction: "You are a brilliant tutor. Explain educational concepts simply and clearly. Keep it concise." }
  });
  return response.text;
}

export async function breakdownTopic(topic: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Break down this topic into 3 manageable study steps: ${topic}`,
    config: { systemInstruction: "You are a study planner. Break down the topic into exactly 3 steps. Format as a markdown list." }
  });
  return response.text;
}

export async function enhanceTodo(todo: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert this vague study task into a specific actionable goal: "${todo}"`,
    config: { systemInstruction: "You are a productivity expert. Convert vague tasks into specific, actionable 'SMART' goals in a single short sentence." }
  });
  return response.text;
}

export async function analyzeStats(summary: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Here is my last 7 days study data: ${summary}. Give me 2 short bullet points of advice.`,
    config: { systemInstruction: "You are an analytical study coach. Provide 2 bullet points of deep insights based on their data. Keep it concise." }
  });
  return response.text;
}

export async function analyzePdf(base64Data: string, prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf"
        }
      },
      prompt
    ],
    config: { systemInstruction: "You are Dante, a wise and profound tutor. Analyze the provided document and answer the user's query with deep understanding and a slightly poetic, motivating tone." }
  });
  return response.text;
}

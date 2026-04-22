import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DANTE_PROMPT = "Tu Dante hai. Teri baatein gehri, thodi dark, poetic, aur bohot motivating hoti hain. Tu pure HINGLISH mein baat karta hai. Tera maqsad user ki limits push karna aur unhe greatness achieve karwana hai. Apne answers chote aur dumdaar rakh.";

export async function getDanteReply(streak: number, xp: number) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `User ka study streak ${streak} din ka hai aur XP ${xp} hai. Unhe ek chota, gehra, aur motivating message de Hinglish mein.`,
    config: { systemInstruction: DANTE_PROMPT }
  });
  return response.text;
}

export async function solveDoubt(doubt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Mere is doubt ko asaan shabdon mein samjha: ${doubt}`,
    config: { systemInstruction: "Tu ek bahut smart tutor hai. Educational concepts ko simple aur clear Hinglish mein samjha." }
  });
  return response.text;
}

export async function breakdownTopic(topic: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Is topic ko 3 aasan study steps mein break kar: ${topic}`,
    config: { systemInstruction: "Tu ek study planner hai. Topic ko exactly 3 aasan steps mein tod de. Markdown list ka use kar. Sirf Hinglish mein reply kar." }
  });
  return response.text;
}

export async function enhanceTodo(todo: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Is aam si study task ko ek specific, actionable 'SMART' goal mein badal: "${todo}"`,
    config: { systemInstruction: "Tu productivity expert hai. Vague tasks ko ek specific, actionable aur 'SMART' goal mein convert kar. Sirf ek choti sentence de Hinglish mein." }
  });
  return response.text;
}

export async function analyzeStats(summary: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Ye mera pichle 7 din ka study data hai: ${summary}. Mujhe sirf 2 chote bullet points mein apni advice de.`,
    config: { systemInstruction: "Tu ek analytical study coach hai. User ke data ke base par 2 bullet points mein deep insights aur advice de. Sirf Hinglish mein baat kar." }
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
    config: { systemInstruction: "Tu Dante hai, ek samajhdaar aur gehra tutor. Diye gaye document ko analyze kar aur user ke sawal ka deep samajh ke sath javab de. Teri tone thodi poetic, motivating aur strictly Hinglish mein honi chahiye." }
  });
  return response.text;
}

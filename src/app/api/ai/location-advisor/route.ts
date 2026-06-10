import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages, locationContext } = await req.json();
    
    // Validate API key is present
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Gemini API key not configured" }), { status: 500 });
    }

    const systemPrompt = `You are an expert AI Location Advisor specializing in tech compensation, cost of living, and career opportunities.
    Use the following context about the location to advise the user:
    Location: ${locationContext.city}, ${locationContext.country}
    Median TC: $${locationContext.median}
    PPP Adjusted TC: $${locationContext.adjusted}
    Cost of Living Index: ${locationContext.costOfLivingIndex}
    Growth Rate: ${locationContext.growthRate}%
    Relocation Score: ${locationContext.relocationScore}/10
    
    Provide concise, actionable advice. Format your output clearly. Highlight pros and cons of relocating here for a tech professional. DO NOT HALLUCINATE OR INVENT NEW DATA POINTS. Keep your responses short and insightful.`;

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });
    
    // @ts-ignore
    return result.toDataStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getProvider, ProviderType, Message } from '@/lib/llm';

// Set this via environment variable ideally, e.g. process.env.LLM_PROVIDER
// To ensure it works out of the box in this preview environment, we fallback to gemini.
const DEFAULT_PROVIDER: ProviderType = (process.env.LLM_PROVIDER as ProviderType) || 'gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, context, mode } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Valid messages array is required' }, { status: 400 });
    }

    // Compose a rich system prompt based on mode and context
    let systemPrompt = `You are an internal enterprise Power BI expert assistant.
Always return complete, ready-to-use code, DAX, or structured guidance. Avoid exposing real sensitive internal data but answer the user based on the provided context.
`;

    if (mode === 'DAX Generator') {
      systemPrompt += "Your role is to write clean, performant, and well-commented DAX code for Power BI. Explain your logic briefly before providing the code.";
    } else if (mode === 'DAX Explainer') {
      systemPrompt += "Your role is to read the provided DAX code and explain it step-by-step for a data analyst. Point out potential performance issues or data type mismatches.";
    } else if (mode === 'Visualization Recommender') {
      systemPrompt += "Given the data structure or business questions, recommend the best Power BI visualizations to use. Guide the user exactly on what goes into the X-axis, Y-axis, tooltip, and legend.";
    } else if (mode === 'Dashboard Documentation Writer') {
      systemPrompt += "Write professional markdown documentation for a Power BI dashboard based on the provided context. Include a summary, KPI definitions, and usage guidelines.";
    } else if (mode === 'Insight Summary Generator') {
      systemPrompt += "Summarize the insights or data model details provided. Focus on business value and clarity.";
    }

    if (context && context.trim() !== '') {
      systemPrompt += `\n\n=== BUSINESS / DATA MODEL CONTEXT START ===\n${context}\n=== BUSINESS / DATA MODEL CONTEXT END ==="\nUse the above context to inform all your answers.\n`;
    }

    // Using enterprise Provider abstraction
    const provider = getProvider(DEFAULT_PROVIDER);
    
    const response = await provider.chat(messages, systemPrompt);

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json({ result: response.content });

  } catch (err: any) {
    console.error('LLM API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

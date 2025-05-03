import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: Ensure you have the 'openai' package installed!
// Run: pnpm install openai
import OpenAI from 'openai';

// Check if the API key is set in environment variables
const apiKey = process.env.OPENAI_API_KEY;

// --- Debugging Line --- 
console.log('API Route: process.env.OPENAI_API_KEY:', apiKey);
// --- End Debugging Line ---

if (!apiKey) {
  console.error("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.");
  // Don't throw here during build time, handle in POST
}

const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
  if (!openai) {
     return NextResponse.json({ error: 'OpenAI API key not configured on server.' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call the OpenAI API (Chat Completions)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Specify the desired model
      messages: [
        // You can add system messages or previous context here if needed
        { role: "user", content: prompt },
      ],
      // Add other parameters like max_tokens, temperature if needed
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
       return NextResponse.json({ error: 'Failed to get response from OpenAI' }, { status: 500 });
    }

    // Return the AI's response text
    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // Avoid exposing detailed errors to the client in production
    return NextResponse.json({ error: 'Failed to process chat request.', details: errorMessage }, { status: 500 });
  }
} 
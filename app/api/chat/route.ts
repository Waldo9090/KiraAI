import { NextRequest, NextResponse } from 'next/server';

// --- Get API Keys ---
const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

// --- Model ID Mapping (Optional but helpful for different API requirements) ---
// You might need slightly different identifiers for Google API calls
const GOOGLE_MODEL_MAP: { [key: string]: string } = {
  'gemini-1.5-pro-latest': 'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest': 'gemini-1.5-flash-latest',
  // Add other mappings if needed
};

const KNOWN_GROQ_MODELS = [
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-instruct',
  'mistral-7b-instruct',
  'gemma-7b-it'
];

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    if (!modelId) {
      return NextResponse.json({ error: 'Model ID is required' }, { status: 400 });
    }

    let aiResponseText: string | null | undefined = null;
    let response: Response;
    let responseData: any;

    // --- Route based on modelId using fetch ---

    if (modelId.startsWith('gpt-')) {
      // --- OpenAI Fetch Call ---
      if (!openaiApiKey) return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 });

      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: prompt }],
          // stream: false, // Ensure streaming is off if not handled
        }),
      });
      responseData = await response.json();
      if (!response.ok) {
        console.error('OpenAI Error:', responseData);
        throw new Error(responseData.error?.message || `OpenAI API Error: ${response.statusText}`);
      }
      aiResponseText = responseData.choices?.[0]?.message?.content;

    } else if (modelId.startsWith('claude-')) {
      // --- Anthropic Fetch Call ---
      if (!anthropicApiKey) return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 500 });

      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      responseData = await response.json();
      if (!response.ok) {
        console.error('Anthropic Error:', responseData);
        throw new Error(responseData.error?.message || `Anthropic API Error: ${response.statusText}`);
      }
      aiResponseText = responseData.content?.[0]?.type === 'text' ? responseData.content[0].text : undefined;

    } else if (modelId.startsWith('gemini-')) {
      // --- Google Fetch Call ---
      if (!googleApiKey) return NextResponse.json({ error: 'Google API key not configured.' }, { status: 500 });

      const googleModel = GOOGLE_MODEL_MAP[modelId] || modelId; // Use mapped ID if available
      const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${googleApiKey}`;

      response = await fetch(googleApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      responseData = await response.json();
      if (!response.ok) {
        console.error('Google Error:', responseData);
        throw new Error(responseData.error?.message || `Google API Error: ${response.statusText}`);
      }
      aiResponseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    } else if (KNOWN_GROQ_MODELS.includes(modelId)) {
       // --- Groq Fetch Call ---
       if (!groqApiKey) return NextResponse.json({ error: 'Groq API key not configured.' }, { status: 500 });

       response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
          }),
       });
       responseData = await response.json();
       if (!response.ok) {
         console.error('Groq Error:', responseData);
         throw new Error(responseData.error?.message || `Groq API Error: ${response.statusText}`);
       }
       aiResponseText = responseData.choices?.[0]?.message?.content;

    } else {
       return NextResponse.json({ error: `Unsupported or unknown model ID: ${modelId}` }, { status: 400 });
    }


    // --- Check and return response ---
    if (aiResponseText === null || aiResponseText === undefined) { // More robust check
       console.error('Failed to extract response text from API data:', responseData); 
       return NextResponse.json({ error: 'Failed to get valid response text from the AI model' }, { status: 500 });
    }

    return NextResponse.json({ response: aiResponseText });

  } catch (error) {
    console.error('[API Chat Error - Fetch Implementation]', error);
    let errorMessage = 'Internal Server Error';
    let errorDetails: any = {}; 

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { name: error.name, message: error.message, stack: error.stack }; // Capture more error details
    } else if (typeof error === 'object' && error !== null) {
      // Try to serialize generic objects/errors
      errorDetails = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } else {
      errorMessage = String(error);
    }

    console.error('[API Chat Error Details - Fetch Implementation]', errorDetails);

    return NextResponse.json({ 
       error: 'Failed to process chat request.', 
       details: errorMessage // Provide the core error message
    }, { status: 500 });
  }
} 
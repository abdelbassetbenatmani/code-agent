import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const prompt = (code: string, language?: string) => {
  return `
    You are an advanced code refactoring AI. Your task is to improve the provided code snippet by applying best practices, enhancing readability, and optimizing performance.
    
    Here is the code to refactor:
    \`\`\`${language ? language : ""}
    ${code}
    \`\`\`

    Please refactor this code and return your results in the following JSON format ONLY:
    
    {
      "refactored": "The refactored code",
      "changes": [
        {
          "type": "performance | readability | structure | security | bug-fix",
          "description": "Description of what was changed and why"
        }
        // More changes...
      ],
      "summary": "A concise summary of the changes and their benefits"
    }

    For the "type" field in each change, use one of these categories:
    - "performance": For changes that improve execution speed or resource usage
    - "readability": For changes that make the code easier to read and understand
    - "structure": For changes related to code organization or architecture
    - "security": For changes that address security vulnerabilities
    - "bug-fix": For changes that fix potential bugs or errors

    Make the "description" field specific and actionable, explaining both what was changed and why.
    
    Ensure the code keeps the same overall functionality while improving it according to best practices.
    Preserve comments from the original code and add new comments where appropriate.
    
    Return ONLY valid JSON without any additional text, markdown formatting, or code blocks.
`;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language } = body;

    if (!code) {
      return NextResponse.json(
        { error: "No code provided for refactoring" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a code refactoring assistant. Respond only with valid JSON according to the format specified.",
        },
        {
          role: "user",
          content: prompt(code, language),
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content =
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      typeof completion.choices[0].message.content === "string"
        ? completion.choices[0].message.content
        : "";

    // Try to parse the response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Validate the structure matches what we expect
    if (
      !parsedResponse.refactored ||
      !Array.isArray(parsedResponse.changes) ||
      !parsedResponse.summary
    ) {
      return NextResponse.json(
        { error: "AI response doesn't match expected format" },
        { status: 500 }
      );
    }

    
    return NextResponse.json(parsedResponse, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate code refactoring" },
      { status: 500 }
    );
  }
}

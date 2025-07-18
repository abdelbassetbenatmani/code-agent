import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const prompt = (code: string) => {
  return `
    You are an advanced code review AI. Your task is to analyze the provided code snippet for functionality, readability, and efficiency. 
    
    Here is the code to review:
    \`\`\`
    ${code}
    \`\`\`

    Please analyze this code and return your review in the following JSON format ONLY:
    
    {
      "summary": "A concise summary of the overall code quality and main findings",
      "issues": [
        {
          "type": "error | warning | improvement | best-practice",
          "line": <line number>,
          "message": "Description of the issue with specific advice"
        },
        // More issues...
      ],
      "score": <number between 0 and 100 indicating overall code quality>
    }

    For the "type" field in each issue, use one of these categories:
    - "error": For critical problems that will cause the code to fail
    - "warning": For issues that might cause bugs or unexpected behavior
    - "improvement": For suggestions that would improve performance or readability
    - "best-practice": For recommendations based on coding standards and best practices

    Ensure the "line" field contains the actual line number from the code where the issue occurs.
    Make the "message" field specific and actionable, explaining both what to fix and how to fix it.
    The "score" should reflect the overall quality considering the number and severity of issues.

    Return ONLY valid JSON without any additional text, markdown formatting, or code blocks.
`;
};
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a code review assistant. Respond only with valid JSON according to the format specified.",
        },
        {
          role: "user",
          content: prompt(body.code),
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    console.log("AI Response:", completion.choices);
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
      !parsedResponse.summary ||
      !Array.isArray(parsedResponse.issues) ||
      typeof parsedResponse.score !== "number"
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
      { error: "Failed to generate code review" },
      { status: 500 }
    );
  }
}

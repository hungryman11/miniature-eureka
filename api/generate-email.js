export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { user, opportunity, instruction } = await req.json();
    const prompt = `Write a personalized application email for the following opportunity:\n\nUSER PROFILE:\n- Name: ${user.name}\n- Field: ${user.field}\n- Dream: ${user.dream}\n- Drive: ${user.drives}\n- Stage: ${user.stage}\n- Goal: ${user.goal}\n\nOPPORTUNITY:\n- Name: ${opportunity.name}\n- Type: ${opportunity.type}\n- Organization: ${opportunity.organization}\n- Why this fits: ${opportunity.why_you}\n- URL: ${opportunity.url}\n\nINSTRUCTION: ${instruction}\n\nWrite the email with subject line, greeting, body, and professional sign-off. Keep it under 300 words.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const emailContent = data.candidates?.[0]?.content?.[0]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!emailContent) {
      throw new Error("Failed to parse Gemini response");
    }

    return new Response(JSON.stringify({ email: emailContent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Email generation error:", err);
    return new Response(JSON.stringify({ error: err.message || "Email generation failed" }), { status: 500 });
  }
}

export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are Pathfinder, an elite opportunity matching engine for ambitious people — especially from Africa and emerging markets. 

Your job: given a person's profile, generate exactly 100 real, specific, currently-active opportunities they should apply to.

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown, no preamble, no explanation
2. Generate EXACTLY 100 opportunities
3. Every opportunity must be REAL — actual programs, companies, organizations that exist
4. Distribute across these buckets proportionally based on the user's profile:
   - Fellowship (15-20): Named fellowships, leadership programs
   - Scholarship (10-15): Funded study, research grants
   - Job (15-20): Roles matching their field and stage
   - Grant (8-12): Funding for founders, creators, researchers
   - Community (10-15): Networks, accelerators, member organizations  
   - Conference (8-10): Events where they could speak or attend
   - Award (6-8): Recognition programs they'd qualify for
   - Competition (6-8): Pitch competitions, hackathons, prizes
   - Writing (5-8): Platforms, residencies, publishing opportunities

5. The "why_you" field must be SPECIFIC to their profile — reference their dream, drive, or strengths directly
6. Match % should be honest (60-98 range)
7. Prioritize African/emerging market opportunities when relevant
8. Include global prestige opportunities (Rhodes, Fulbright, etc.) if they're realistic
9. Effort levels: Low (quick apply, <1hr), Medium (2-5hrs), High (full application)

Return this exact JSON structure:
{
  "opportunities": [
    {
      "name": "Program/Job/Grant Name",
      "type": "Fellowship|Job|Scholarship|Grant|Community|Conference|Award|Competition|Writing",
      "organization": "Organization name",
      "url": "https://actual-url.com",
      "why_you": "One specific sentence connecting this to their profile",
      "deadline": "Rolling|Month YYYY|Varies|Closed/Opens Month",
      "effort": "Low|Medium|High",
      "match": 85
    }
  ]
}`;

function buildUserPrompt(answers) {
  return `Generate 100 opportunities for this person:

NAME: ${answers.name}
FIELD: ${answers.field}
DREAM (no limitations): ${answers.dream}
CORE DRIVE: ${answers.drives}
CURRENT STAGE: ${answers.stage}
PRIMARY GOAL: ${answers.goal}
TOP STRENGTHS: ${Array.isArray(answers.strengths) ? answers.strengths.join(", ") : answers.strengths}
IDENTITY/COMMUNITIES: ${Array.isArray(answers.identity) ? answers.identity.join(", ") : (answers.identity || "not specified")}
TIME FOR APPLICATIONS: ${answers.commitment}

Use their dream ("${answers.dream}") and drive ("${answers.drives}") heavily to find prestige and visionary opportunities. Don't be conservative — find the doors most people don't know exist.`;
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
  }

  let answers;
  try {
    answers = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: buildUserPrompt(answers) }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return new Response(JSON.stringify({ error: err.error?.message || "Claude API error" }), { status: 500 });
    }

    const data = await response.json();
    const raw = data.content[0].text;

    // Strip any accidental markdown fences
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // Try to extract JSON from the response
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Failed to parse response");
      }
    }

    // Validate and cap at 100
    const opportunities = (parsed.opportunities || []).slice(0, 100);

    return new Response(JSON.stringify({ opportunities }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Generation error:", err);
    return new Response(JSON.stringify({ error: err.message || "Generation failed" }), { status: 500 });
  }
}

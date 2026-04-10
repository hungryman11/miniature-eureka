import opportunities from './data/opportunities.json';

// Scoring function - no AI required
function calculateScore(opportunity, userProfile) {
  let score = 0;

  // Field/category matching (40 points max)
  if (userProfile.field) {
    const fieldLower = userProfile.field.toLowerCase();
    if (opportunity.category === 'tech' && fieldLower.includes('tech')) score += 20;
    if (opportunity.category === 'business' && fieldLower.includes('business')) score += 20;
    if (opportunity.category === 'education' && fieldLower.includes('education')) score += 20;
    if (opportunity.category === 'social-impact' && (fieldLower.includes('social') || fieldLower.includes('impact'))) score += 20;
    if (opportunity.category === 'sustainability' && fieldLower.includes('sustain')) score += 20;
  }

  // Goal matching (30 points max)
  if (userProfile.goal) {
    const goalLower = userProfile.goal.toLowerCase();
    if (goalLower.includes('funding') && ['Grant', 'Scholarship'].includes(opportunity.type)) score += 15;
    if (goalLower.includes('network') && ['Community', 'Conference'].includes(opportunity.type)) score += 15;
    if (goalLower.includes('learn') && ['Scholarship', 'Fellowship'].includes(opportunity.type)) score += 15;
    if (goalLower.includes('job') && opportunity.type === 'Job') score += 15;
    if (goalLower.includes('recognition') && ['Award', 'Competition'].includes(opportunity.type)) score += 15;
  }

  // Stage matching (20 points max)
  if (userProfile.stage) {
    const stageLower = userProfile.stage.toLowerCase();
    if (stageLower.includes('student') && ['Scholarship', 'Fellowship'].includes(opportunity.type)) score += 10;
    if (stageLower.includes('early') && ['Job', 'Fellowship', 'Community'].includes(opportunity.type)) score += 10;
    if (stageLower.includes('mid') && ['Job', 'Grant', 'Conference'].includes(opportunity.type)) score += 10;
  }

  // Strengths matching (10 points max)
  if (userProfile.strengths) {
    const strengths = Array.isArray(userProfile.strengths)
      ? userProfile.strengths.map(s => s.toLowerCase())
      : [userProfile.strengths.toLowerCase()];

    if (strengths.some(s => s.includes('leadership')) && ['Fellowship', 'Community'].includes(opportunity.type)) score += 5;
    if (strengths.some(s => s.includes('technical')) && opportunity.category === 'tech') score += 5;
    if (strengths.some(s => s.includes('creative')) && ['Writing', 'Award'].includes(opportunity.type)) score += 5;
  }

  // Location/Africa preference (20 points max)
  if (userProfile.identity) {
    const identities = Array.isArray(userProfile.identity)
      ? userProfile.identity.map(i => i.toLowerCase())
      : [userProfile.identity.toLowerCase()];

    if (identities.some(i => i.includes('africa')) && opportunity.location === 'africa') score += 20;
    if (identities.some(i => i.includes('african')) && opportunity.location === 'africa') score += 20;
  }

  // Dream/goal alignment (20 points max)
  if (userProfile.dream) {
    const dreamLower = userProfile.dream.toLowerCase();
    if (dreamLower.includes('social') && opportunity.category === 'social-impact') score += 10;
    if (dreamLower.includes('tech') && opportunity.category === 'tech') score += 10;
    if (dreamLower.includes('business') && opportunity.category === 'business') score += 10;
    if (dreamLower.includes('education') && opportunity.category === 'education') score += 10;
  }

  // Commitment level matching (10 points max)
  if (userProfile.commitment) {
    const commitmentLower = userProfile.commitment.toLowerCase();
    if (commitmentLower === 'high' && opportunity.effort === 'High') score += 5;
    if (commitmentLower === 'medium' && ['Medium', 'Low'].includes(opportunity.effort)) score += 5;
    if (commitmentLower === 'low' && opportunity.effort === 'Low') score += 5;
  }

  return Math.min(score, 100); // Cap at 100
}

// Generate personalized "why you" explanation
function generateWhyYou(opportunity, userProfile) {
  const reasons = [];

  if (userProfile.dream && opportunity.description.toLowerCase().includes(userProfile.dream.toLowerCase().split(' ')[0])) {
    reasons.push(`aligns perfectly with your dream of ${userProfile.dream}`);
  }

  if (userProfile.drives && opportunity.category) {
    reasons.push(`matches your drive for ${userProfile.drives} through ${opportunity.category} opportunities`);
  }

  if (userProfile.field && opportunity.category === userProfile.field.toLowerCase()) {
    reasons.push(`builds directly on your ${userProfile.field} background`);
  }

  if (userProfile.strengths && Array.isArray(userProfile.strengths)) {
    const relevantStrengths = userProfile.strengths.filter(strength =>
      opportunity.tags.some(tag => tag.toLowerCase().includes(strength.toLowerCase()))
    );
    if (relevantStrengths.length > 0) {
      reasons.push(`leverages your ${relevantStrengths[0]} strengths`);
    }
  }

  if (userProfile.identity && Array.isArray(userProfile.identity)) {
    if (userProfile.identity.some(i => i.toLowerCase().includes('africa')) && opportunity.location === 'africa') {
      reasons.push('connects you with African opportunities and networks');
    }
  }

  return reasons.length > 0
    ? `This opportunity ${reasons.join(' and ')}.`
    : `This ${opportunity.type.toLowerCase()} could be an excellent fit for your profile and goals.`;
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const userProfile = await req.json();
    const allOpportunities = opportunities;

    // Score each opportunity
    const scoredOpportunities = allOpportunities.map(opportunity => ({
      ...opportunity,
      score: calculateScore(opportunity, userProfile),
      why_you: generateWhyYou(opportunity, userProfile),
      match: Math.min(Math.max(calculateScore(opportunity, userProfile), 60), 98) // Match % between 60-98
    }));

    // Sort by score and return top 100
    const topOpportunities = scoredOpportunities
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);

    return new Response(JSON.stringify({ opportunities: topOpportunities }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Matching error:", err);
    return new Response(JSON.stringify({ error: err.message || "Matching failed" }), { status: 500 });
  }
}
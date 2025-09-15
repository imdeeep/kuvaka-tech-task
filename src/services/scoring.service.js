function calculateRuleScore(lead, offer) {
  let score = 0;

  // Rule 1: Role relevance (max 20)
  const role = lead.role.toLowerCase();
  const decisionMakerKeywords = ['head', 'vp', 'director', 'manager', 'founder', 'ceo', 'cto', 'cfo'];
  if (decisionMakerKeywords.some(keyword => role.includes(keyword))) {
    score += 20;
  } else if (role.includes('influencer') || role.includes('specialist')) {
    score += 10;
  }

  // Rule 2: Industry match (max 20)
  const idealIndustry = offer.ideal_use_cases[0] || '' // e.g., "B2B SaaS mid-market"
  if (lead.industry.toLowerCase().includes('saas')) { // Assuming ICP is SaaS
    score += 20;
  } else if (lead.industry.toLowerCase().includes('tech')) { // Adjacent
    score += 10;
  }
  
  // Rule 3: Data completeness (max 10)
  if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) {
    score += 10;
  }

  return score;
}

module.exports = { calculateRuleScore };
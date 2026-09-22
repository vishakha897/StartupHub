const { AppError } = require('../middleware/errorHandler');

/**
 * AI Business Plan Generation Service
 * Google Gemini using OpenAI-compatible API
 */

const isAIConfigured = () => {
  return Boolean(process.env.AI_API_KEY);
};

const REQUIRED_FIELDS = [
  'executiveSummary',
  'problem',
  'solution',
  'targetMarket',
  'customerPersonas',
  'valueProposition',
  'competitorAnalysis',
  'competitiveAdvantage',
  'businessModel',
  'productsServices',
  'marketingStrategy',
  'salesStrategy',
  'operationsPlan',
  'requiredResources',
  'pricingStrategy',
  'startupBudget',
  'revenueModel',
  'financialEstimate',
  'breakEvenAssumptions',
  'riskAnalysis',
  'riskMitigation',
  'actionPlan',
  'kpis',
  'finalRecommendations'
];

const ARRAY_FIELDS = new Set([
  'customerPersonas',
  'competitorAnalysis',
  'productsServices',
  'marketingStrategy',
  'salesStrategy',
  'operationsPlan',
  'requiredResources',
  'startupBudget',
  'riskAnalysis',
  'riskMitigation',
  'actionPlan',
  'kpis'
]);

function buildSystemPrompt() {
  return `
You are a practical startup business advisor.

Create realistic and useful business plans.

Rules:
- Consider the user's budget carefully.
- Consider the target customers carefully.
- Keep recommendations practical.
- Do not invent exact market statistics.
- Clearly identify assumptions.
- Never guarantee revenue or profit.
- Use estimated or illustrative projections for financial numbers.
- Give actionable recommendations.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not write anything before or after the JSON.
`;
}

function buildUserPrompt(input) {
  return `
Create a complete structured business plan for this business.

Business idea:
${input.businessIdea}

Budget:
${input.budget}

Target customers:
${input.targetCustomers}

Industry:
${input.industry || 'Not specified'}

Location:
${input.location || 'Not specified'}

Business type:
${input.businessType || 'Not specified'}

Expected timeline:
${input.timeline || 'Not specified'}

Founder experience:
${input.experienceLevel || 'Not specified'}

Goals:
${input.goals || 'Not specified'}

Preferred revenue model:
${input.revenueModelPreference || 'Not specified'}

Return ONLY valid JSON using exactly this structure:

{
  "executiveSummary": "string",
  "problem": "string",
  "solution": "string",
  "targetMarket": "string",
  "customerPersonas": ["string"],
  "valueProposition": "string",
  "competitorAnalysis": ["string"],
  "competitiveAdvantage": "string",
  "businessModel": "string",
  "productsServices": ["string"],
  "marketingStrategy": ["string"],
  "salesStrategy": ["string"],
  "operationsPlan": ["string"],
  "requiredResources": ["string"],
  "pricingStrategy": "string",
  "startupBudget": [
    {
      "item": "string",
      "estimatedCost": 0
    }
  ],
  "revenueModel": "string",
  "financialEstimate": {
    "monthlyRevenueEstimate": "string",
    "monthlyExpenseEstimate": "string",
    "notes": "string"
  },
  "breakEvenAssumptions": "string",
  "riskAnalysis": ["string"],
  "riskMitigation": ["string"],
  "actionPlan": [
    {
      "period": "Day 1-30",
      "actions": ["string"]
    }
  ],
  "kpis": ["string"],
  "finalRecommendations": "string"
}

Return JSON only.
`;
}

async function callProvider(input) {
  const baseUrl =
    process.env.AI_API_BASE_URL ||
    'https://generativelanguage.googleapis.com/v1beta/openai';

  const model =
    process.env.AI_MODEL ||
    'gemini-3.5-flash';

  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      'AI API key is missing. Please add AI_API_KEY to server/.env.',
      500
    );
  }

  let response;

  try {
    response = await fetch(
      `${baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: buildSystemPrompt()
            },
            {
              role: 'user',
              content: buildUserPrompt(input)
            }
          ],
          temperature: 0.6
        })
      }
    );
  } catch (error) {
    console.error('AI network error:', error);

    throw new AppError(
      'Could not connect to Google Gemini AI service.',
      502
    );
  }

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    console.error(
      'Invalid Gemini response:',
      responseText
    );

    throw new AppError(
      'The AI provider returned an invalid response.',
      502
    );
  }

  if (!response.ok) {
    console.error('');
    console.error('========================================');
    console.error('GEMINI API ERROR');
    console.error('========================================');
    console.error('HTTP Status:', response.status);
    console.error('Model:', model);
    console.error('Base URL:', baseUrl);
    console.error('Provider Response:');
    console.error(JSON.stringify(data, null, 2));
    console.error('========================================');
    console.error('');

    const providerMessage =
      data?.error?.message ||
      data?.error?.status ||
      data?.error?.code ||
      'Unknown Gemini API error';

    throw new AppError(
      `Google Gemini API error: ${providerMessage}`,
      502
    );
  }

  const raw =
    data?.choices?.[0]?.message?.content;

  if (!raw) {
    console.error('Empty Gemini response:');
    console.error(JSON.stringify(data, null, 2));

    throw new AppError(
      'Google Gemini returned an empty response.',
      502
    );
  }

  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error('AI returned invalid JSON:');
    console.error(cleaned);

    throw new AppError(
      'The AI response was not valid JSON.',
      502
    );
  }

  return validateAndNormalize(parsed);
}

function validateAndNormalize(plan) {
  if (
    !plan ||
    typeof plan !== 'object' ||
    Array.isArray(plan)
  ) {
    throw new AppError(
      'The AI response was malformed.',
      502
    );
  }

  const normalized = {};

  for (const field of REQUIRED_FIELDS) {
    const value = plan[field];

    if (ARRAY_FIELDS.has(field)) {
      normalized[field] = Array.isArray(value)
        ? value
        : value
          ? [value]
          : [];
    } else if (field === 'financialEstimate') {
      normalized[field] =
        value &&
        typeof value === 'object' &&
        !Array.isArray(value)
          ? value
          : {};
    } else {
      normalized[field] =
        typeof value === 'string'
          ? value
          : value
            ? String(value)
            : '';
    }
  }

  return normalized;
}

async function generateBusinessPlan(input) {
  if (!isAIConfigured()) {
    return {
      configured: false,
      message:
        'AI business plan generation is not configured on this server. Add a valid AI_API_KEY to server/.env.'
    };
  }

  const planData = await callProvider(input);

  return {
    configured: true,
    planData
  };
}

module.exports = {
  generateBusinessPlan,
  isAIConfigured,
  REQUIRED_FIELDS
};
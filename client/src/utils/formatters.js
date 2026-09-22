export const formatCurrency = (value, currency = 'USD') => {
  const num = Number(value) || 0;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num);
  } catch {
    return `$${num.toLocaleString()}`;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const truncate = (text, max = 140) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

// Flattens a saved plan's planData into a single readable text block —
// used for both the "Copy Plan" button and as the PDF body source.
export const planToText = (plan) => {
  const d = plan.planData || {};
  const list = (arr) => (Array.isArray(arr) ? arr.map((x) => `- ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n') : '');

  return `STARTUPHUB BUSINESS PLAN
${plan.title}

BUSINESS IDEA
${plan.businessIdea}

BUDGET
${formatCurrency(plan.budget)}

TARGET CUSTOMERS
${plan.targetCustomers}

EXECUTIVE SUMMARY
${d.executiveSummary || ''}

PROBLEM
${d.problem || ''}

SOLUTION
${d.solution || ''}

TARGET MARKET
${d.targetMarket || ''}

CUSTOMER PERSONAS
${list(d.customerPersonas)}

VALUE PROPOSITION
${d.valueProposition || ''}

COMPETITOR ANALYSIS
${list(d.competitorAnalysis)}

COMPETITIVE ADVANTAGE
${d.competitiveAdvantage || ''}

BUSINESS MODEL
${d.businessModel || ''}

PRODUCTS / SERVICES
${list(d.productsServices)}

MARKETING STRATEGY
${list(d.marketingStrategy)}

SALES STRATEGY
${list(d.salesStrategy)}

OPERATIONS PLAN
${list(d.operationsPlan)}

REQUIRED RESOURCES
${list(d.requiredResources)}

PRICING STRATEGY
${d.pricingStrategy || ''}

STARTUP BUDGET
${Array.isArray(d.startupBudget) ? d.startupBudget.map((b) => `- ${b.item}: ${formatCurrency(b.estimatedCost)}`).join('\n') : ''}

REVENUE MODEL
${d.revenueModel || ''}

FINANCIAL ESTIMATE (illustrative)
${d.financialEstimate ? Object.entries(d.financialEstimate).map(([k, v]) => `${k}: ${v}`).join('\n') : ''}

BREAK-EVEN ASSUMPTIONS
${d.breakEvenAssumptions || ''}

RISK ANALYSIS
${list(d.riskAnalysis)}

RISK MITIGATION
${list(d.riskMitigation)}

ACTION PLAN
${Array.isArray(d.actionPlan) ? d.actionPlan.map((a) => `${a.period}:\n${(a.actions || []).map((x) => `  - ${x}`).join('\n')}`).join('\n') : ''}

KPIs
${list(d.kpis)}

FINAL RECOMMENDATIONS
${d.finalRecommendations || ''}
`;
};

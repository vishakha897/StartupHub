const mongoose = require('mongoose');

/**
 * planData stores the full structured AI output (executiveSummary,
 * problem, solution, targetMarket, customerPersonas, valueProposition,
 * competitorAnalysis, businessModel, productsServices, marketingStrategy,
 * salesStrategy, operationsPlan, pricingStrategy, startupBudget,
 * revenueModel, financialEstimate, riskAnalysis, actionPlan, kpis, ...).
 * The exact shape is produced/validated by services/aiService.js, so it
 * is stored as Mixed rather than a rigid sub-schema — this keeps the
 * model resilient to the AI adding reasonable extra detail while the
 * service layer still enforces the required-field contract.
 */
const BusinessPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    businessIdea: {
      type: String,
      required: [true, 'Business idea is required'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [1, 'Budget must be greater than 0'],
    },
    targetCustomers: {
      type: String,
      required: [true, 'Target customers is required'],
      trim: true,
    },
    industry: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    businessType: { type: String, trim: true, default: '' },
    timeline: { type: String, trim: true, default: '' },
    experienceLevel: { type: String, trim: true, default: '' },
    goals: { type: String, trim: true, default: '' },
    revenueModelPreference: { type: String, trim: true, default: '' },
    planData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'complete'],
      default: 'complete',
    },
  },
  { timestamps: true }
);

BusinessPlanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('BusinessPlan', BusinessPlanSchema);

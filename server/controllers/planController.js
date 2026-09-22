const { validationResult } = require('express-validator');
const BusinessPlan = require('../models/BusinessPlan');
const aiService = require('../services/aiService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }
};

const pickInput = (body) => ({
  businessIdea: body.businessIdea,
  budget: body.budget,
  targetCustomers: body.targetCustomers,
  industry: body.industry || '',
  location: body.location || '',
  businessType: body.businessType || '',
  timeline: body.timeline || '',
  experienceLevel: body.experienceLevel || '',
  goals: body.goals || '',
  revenueModelPreference: body.revenueModelPreference || '',
});

const deriveTitle = (businessIdea) => {
  const trimmed = businessIdea.trim();
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
};

// POST /api/plans/generate — generates a plan but does NOT save it
const generatePlan = asyncHandler(async (req, res) => {
  checkValidation(req);
  const input = pickInput(req.body);

  const result = await aiService.generateBusinessPlan(input);

  if (!result.configured) {
    return res.status(200).json({ success: false, aiConfigured: false, message: result.message });
  }

  res.status(200).json({
    success: true,
    aiConfigured: true,
    planData: result.planData,
    input,
    suggestedTitle: deriveTitle(input.businessIdea),
  });
});

// POST /api/plans — saves a plan (planData must already be generated on the client)
const createPlan = asyncHandler(async (req, res) => {
  checkValidation(req);
  const input = pickInput(req.body);

  const plan = await BusinessPlan.create({
    ...input,
    title: req.body.title?.trim() || deriveTitle(input.businessIdea),
    planData: req.body.planData,
    userId: req.user._id,
  });

  res.status(201).json({ success: true, plan });
});

// GET /api/plans — list current user's plans (list view: no need for full planData weight beyond what UI needs, but we keep it simple and return full docs)
const getPlans = asyncHandler(async (req, res) => {
  const { search, sort } = req.query;

  const query = { userId: req.user._id };
  if (search) {
    const regex = new RegExp(search, 'i');
    query.$or = [{ title: regex }, { businessIdea: regex }, { industry: regex }];
  }

  let sortSpec = { createdAt: -1 };
  if (sort === 'oldest') sortSpec = { createdAt: 1 };
  if (sort === 'budget_high') sortSpec = { budget: -1 };
  if (sort === 'budget_low') sortSpec = { budget: 1 };

  const plans = await BusinessPlan.find(query).sort(sortSpec);
  res.status(200).json({ success: true, count: plans.length, plans });
});

// Helper: fetch a plan and enforce ownership
const findOwnedPlan = async (planId, userId) => {
  const plan = await BusinessPlan.findById(planId);
  if (!plan) throw new AppError('Business plan not found', 404);
  if (plan.userId.toString() !== userId.toString()) {
    throw new AppError('You do not have access to this business plan', 403);
  }
  return plan;
};

// GET /api/plans/:id
const getPlanById = asyncHandler(async (req, res) => {
  const plan = await findOwnedPlan(req.params.id, req.user._id);
  res.status(200).json({ success: true, plan });
});

// PUT /api/plans/:id
const updatePlan = asyncHandler(async (req, res) => {
  const plan = await findOwnedPlan(req.params.id, req.user._id);

  const allowedFields = [
    'title', 'businessIdea', 'budget', 'targetCustomers', 'industry', 'location',
    'businessType', 'timeline', 'experienceLevel', 'goals', 'revenueModelPreference',
    'status', 'planData',
  ];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) plan[field] = req.body[field];
  });

  await plan.save();
  res.status(200).json({ success: true, plan });
});

// DELETE /api/plans/:id
const deletePlan = asyncHandler(async (req, res) => {
  const plan = await findOwnedPlan(req.params.id, req.user._id);
  await plan.deleteOne();
  res.status(200).json({ success: true, message: 'Business plan deleted' });
});

// POST /api/plans/:id/duplicate
const duplicatePlan = asyncHandler(async (req, res) => {
  const plan = await findOwnedPlan(req.params.id, req.user._id);

  const clone = plan.toObject();
  delete clone._id;
  delete clone.createdAt;
  delete clone.updatedAt;
  clone.title = `${clone.title} (Copy)`;

  const newPlan = await BusinessPlan.create(clone);
  res.status(201).json({ success: true, plan: newPlan });
});

// POST /api/plans/:id/regenerate — re-runs AI with the plan's original inputs and updates planData
const regeneratePlan = asyncHandler(async (req, res) => {
  const plan = await findOwnedPlan(req.params.id, req.user._id);

  const input = pickInput(plan);
  const result = await aiService.generateBusinessPlan(input);

  if (!result.configured) {
    return res.status(200).json({ success: false, aiConfigured: false, message: result.message });
  }

  plan.planData = result.planData;
  await plan.save();

  res.status(200).json({ success: true, aiConfigured: true, plan });
});

module.exports = {
  generatePlan, createPlan, getPlans, getPlanById, updatePlan, deletePlan, duplicatePlan, regeneratePlan,
};

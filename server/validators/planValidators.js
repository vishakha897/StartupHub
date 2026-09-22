const { body } = require('express-validator');

// Shared rules for both "generate" (no save yet) and "create" (save) requests.
const businessPlanInputValidator = [
  body('businessIdea')
    .trim()
    .notEmpty().withMessage('Please enter a meaningful business idea.')
    .isLength({ min: 10 }).withMessage('Please enter a meaningful business idea.')
    .isLength({ max: 2000 }).withMessage('Business idea is too long (max 2000 characters).'),
  body('budget')
    .notEmpty().withMessage('Budget is required.')
    .isFloat({ gt: 0 }).withMessage('Budget must be greater than 0.'),
  body('targetCustomers')
    .trim()
    .notEmpty().withMessage('Please describe your target customers.')
    .isLength({ min: 3 }).withMessage('Please describe your target customers.')
    .isLength({ max: 500 }).withMessage('Target customers description is too long (max 500 characters).'),
  body('industry').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('location').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('businessType').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('timeline').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('experienceLevel').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('goals').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('revenueModelPreference').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
];

const savePlanValidator = [
  ...businessPlanInputValidator,
  body('title').trim().notEmpty().withMessage('Plan title is required').isLength({ max: 120 }),
  body('planData').notEmpty().withMessage('planData is required').custom((v) => typeof v === 'object'),
];

module.exports = { businessPlanInputValidator, savePlanValidator };

const express = require('express');
const {
  generatePlan, createPlan, getPlans, getPlanById, updatePlan, deletePlan, duplicatePlan, regeneratePlan,
} = require('../controllers/planController');
const { businessPlanInputValidator, savePlanValidator } = require('../validators/planValidators');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect); // every plan route requires authentication

router.post('/generate', aiLimiter, businessPlanInputValidator, generatePlan);
router.post('/', savePlanValidator, createPlan);
router.get('/', getPlans);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);
router.post('/:id/duplicate', duplicatePlan);
router.post('/:id/regenerate', aiLimiter, regeneratePlan);

module.exports = router;

import jsPDF from 'jspdf';
import { formatCurrency, formatDate } from './formatters';

const MARGIN = 15;
const PAGE_WIDTH = 210; // A4 mm
const USABLE_WIDTH = PAGE_WIDTH - MARGIN * 2;

/**
 * Generates a real, readable multi-page PDF for a saved business plan
 * (not a screenshot of the page) and triggers a download.
 */
export function downloadPlanAsPDF(plan) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const pageBottom = 285;

  const ensureSpace = (needed) => {
    if (y + needed > pageBottom) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const addHeading = (text, size = 14) => {
    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.setTextColor(30, 41, 59);
    doc.text(text, MARGIN, y);
    y += size === 14 ? 7 : 6;
  };

  const addParagraph = (text, size = 10.5) => {
    if (!text) return;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(String(text), USABLE_WIDTH);
    lines.forEach((line) => {
      ensureSpace(6);
      doc.text(line, MARGIN, y);
      y += 5.2;
    });
    y += 2;
  };

  const addList = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    items.forEach((item) => {
      const text = typeof item === 'string' ? item : JSON.stringify(item);
      const lines = doc.splitTextToSize(`•  ${text}`, USABLE_WIDTH - 3);
      lines.forEach((line) => {
        ensureSpace(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(51, 65, 85);
        doc.text(line, MARGIN + 2, y);
        y += 5.2;
      });
    });
    y += 2;
  };

  // ---- Cover / header ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('StartupHub', MARGIN, y);
  y += 9;

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(plan.title || 'Business Plan', MARGIN, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${formatDate(plan.updatedAt || plan.createdAt || new Date())}`, MARGIN, y);
  y += 8;

  const d = plan.planData || {};

  addHeading('Business Idea');
  addParagraph(plan.businessIdea);

  addHeading('Budget & Target Customers');
  addParagraph(`Budget: ${formatCurrency(plan.budget)}`);
  addParagraph(`Target customers: ${plan.targetCustomers}`);

  addHeading('Executive Summary');
  addParagraph(d.executiveSummary);

  addHeading('Problem');
  addParagraph(d.problem);

  addHeading('Solution');
  addParagraph(d.solution);

  addHeading('Target Market');
  addParagraph(d.targetMarket);

  addHeading('Customer Personas');
  addList(d.customerPersonas);

  addHeading('Value Proposition');
  addParagraph(d.valueProposition);

  addHeading('Competitor Analysis');
  addList(d.competitorAnalysis);

  addHeading('Competitive Advantage');
  addParagraph(d.competitiveAdvantage);

  addHeading('Business Model');
  addParagraph(d.businessModel);

  addHeading('Products / Services');
  addList(d.productsServices);

  addHeading('Marketing Strategy');
  addList(d.marketingStrategy);

  addHeading('Sales Strategy');
  addList(d.salesStrategy);

  addHeading('Operations Plan');
  addList(d.operationsPlan);

  addHeading('Required Resources');
  addList(d.requiredResources);

  addHeading('Pricing Strategy');
  addParagraph(d.pricingStrategy);

  addHeading('Startup Budget (Estimated)');
  if (Array.isArray(d.startupBudget)) {
    addList(d.startupBudget.map((b) => `${b.item}: ${formatCurrency(b.estimatedCost)}`));
  }

  addHeading('Revenue Model');
  addParagraph(d.revenueModel);

  addHeading('Financial Estimate (Illustrative)');
  if (d.financialEstimate) {
    Object.entries(d.financialEstimate).forEach(([k, v]) => addParagraph(`${k}: ${v}`));
  }

  addHeading('Break-Even Assumptions');
  addParagraph(d.breakEvenAssumptions);

  addHeading('Risk Analysis');
  addList(d.riskAnalysis);

  addHeading('Risk Mitigation');
  addList(d.riskMitigation);

  addHeading('Action Plan');
  if (Array.isArray(d.actionPlan)) {
    d.actionPlan.forEach((phase) => {
      addParagraph(phase.period, 11);
      addList(phase.actions);
    });
  }

  addHeading('Key Performance Indicators');
  addList(d.kpis);

  addHeading('Final Recommendations');
  addParagraph(d.finalRecommendations);

  const fileName = `${(plan.title || 'business-plan').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}

import React from 'react';
import Card from './Card';
import { formatCurrency } from '../utils/formatters';

const Section = ({ title, children }) => (
  <Card className="p-6">
    <h3 className="font-bold text-slate-900 mb-3">{title}</h3>
    <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
  </Card>
);

const BulletList = ({ items }) => (
  <ul className="list-disc list-inside space-y-1.5">
    {(items || []).map((item, i) => (
      <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
    ))}
  </ul>
);

/**
 * Renders a full structured business plan (planData) as a stack of
 * readable section cards. Used by both the pre-save GeneratedPlan
 * view and the saved PlanDetails view.
 */
export default function PlanSections({ planData }) {
  const d = planData || {};

  return (
    <div className="space-y-5">
      <Section title="Executive Summary"><p>{d.executiveSummary}</p></Section>

      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="Problem"><p>{d.problem}</p></Section>
        <Section title="Solution"><p>{d.solution}</p></Section>
      </div>

      <Section title="Target Market"><p>{d.targetMarket}</p></Section>
      <Section title="Customer Personas"><BulletList items={d.customerPersonas} /></Section>
      <Section title="Value Proposition"><p>{d.valueProposition}</p></Section>

      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="Competitor Analysis"><BulletList items={d.competitorAnalysis} /></Section>
        <Section title="Competitive Advantage"><p>{d.competitiveAdvantage}</p></Section>
      </div>

      <Section title="Business Model"><p>{d.businessModel}</p></Section>
      <Section title="Products / Services"><BulletList items={d.productsServices} /></Section>

      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="Marketing Strategy"><BulletList items={d.marketingStrategy} /></Section>
        <Section title="Sales Strategy"><BulletList items={d.salesStrategy} /></Section>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="Operations Plan"><BulletList items={d.operationsPlan} /></Section>
        <Section title="Required Resources"><BulletList items={d.requiredResources} /></Section>
      </div>

      <Section title="Pricing Strategy"><p>{d.pricingStrategy}</p></Section>

      <Section title="Startup Budget (Estimated)">
        {Array.isArray(d.startupBudget) && d.startupBudget.length > 0 ? (
          <table className="w-full text-sm">
            <tbody>
              {d.startupBudget.map((b, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="py-1.5 pr-4">{b.item}</td>
                  <td className="py-1.5 text-right font-semibold text-slate-800">{formatCurrency(b.estimatedCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-slate-400">No breakdown provided.</p>}
      </Section>

      <Section title="Revenue Model"><p>{d.revenueModel}</p></Section>

      <Section title="Financial Estimate (Illustrative)">
        {d.financialEstimate && Object.keys(d.financialEstimate).length > 0 ? (
          <dl className="space-y-1">
            {Object.entries(d.financialEstimate).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="font-semibold text-slate-700 capitalize shrink-0">{k.replace(/([A-Z])/g, ' $1')}:</dt>
                <dd className="text-slate-600">{String(v)}</dd>
              </div>
            ))}
          </dl>
        ) : <p className="text-slate-400">Not provided.</p>}
      </Section>

      <Section title="Break-Even Assumptions"><p>{d.breakEvenAssumptions}</p></Section>

      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="Risk Analysis"><BulletList items={d.riskAnalysis} /></Section>
        <Section title="Risk Mitigation"><BulletList items={d.riskMitigation} /></Section>
      </div>

      <Section title="30 / 60 / 90 Day Action Plan">
        {Array.isArray(d.actionPlan) && d.actionPlan.length > 0 ? (
          <div className="space-y-4">
            {d.actionPlan.map((phase, i) => (
              <div key={i}>
                <p className="font-semibold text-slate-800">{phase.period}</p>
                <BulletList items={phase.actions} />
              </div>
            ))}
          </div>
        ) : <p className="text-slate-400">Not provided.</p>}
      </Section>

      <Section title="Key Performance Indicators"><BulletList items={d.kpis} /></Section>
      <Section title="Final Recommendations"><p>{d.finalRecommendations}</p></Section>
    </div>
  );
}

import type { AIRecommendation } from "../types";

export const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: "ai_rec_1",
    returnId: "ret_maria_2025",
    fieldId: "fld_interest_income",
    kind: "anomaly_warning",
    title: "Interest amount has a low-confidence digit",
    summary:
      "One digit in the 1099-INT interest amount is partially obscured in the scan. Confirm with the client before filing.",
    confidence: 0.58,
    evidence: [
      "Character-level OCR confidence on the flagged digit: 61%",
      "All other digits on this form read above 95% confidence",
      "No prior-year 1099-INT from this payer on file to cross-check",
    ],
    suggestedAction:
      "Ask the client to confirm the exact amount from their online statement.",
    status: "pending",
  },
  {
    id: "ai_rec_2",
    returnId: "ret_maria_2025",
    fieldId: "fld_childcare_expense",
    kind: "missing_document",
    title: "Childcare provider Tax ID is missing",
    summary:
      "Form 2441 requires the provider's EIN or SSN, and it isn't printed on the uploaded statement.",
    confidence: 0.97,
    evidence: [
      "Scanned every line of the document for an EIN/SSN pattern, but found none",
      "This is a structural gap in the source document, not an OCR error",
      "IRS Form 2441 instructions require Part I, column (c) to be completed",
    ],
    suggestedAction: "Request the provider's Tax ID directly from the client.",
    status: "pending",
  },
  {
    id: "ai_rec_3",
    returnId: "ret_maria_2025",
    kind: "deduction_suggestion",
    title: "Client may qualify for the Saver's Credit",
    summary:
      "Based on AGI and filing status, a retirement contribution could unlock an additional credit worth up to $400.",
    confidence: 0.73,
    evidence: [
      "Estimated AGI ($71,784.90) is within range for partial Saver's Credit eligibility at this filing status",
      "No retirement contribution (Form 8880) currently on file for this return",
      "Pattern seen on similar returns filed this season with comparable income",
    ],
    suggestedAction:
      "Ask the client whether they made any 2025 IRA or 401(k) contributions before the filing deadline.",
    status: "pending",
    potentialImpact: { amount: 400, direction: "saves" },
  },
  {
    id: "ai_rec_4",
    returnId: "ret_owen_2025",
    kind: "anomaly_warning",
    title: "Shareholder basis doesn't roll forward cleanly",
    summary:
      "This year's beginning basis doesn't match last year's ending basis on file, a $1,240 gap.",
    confidence: 0.88,
    evidence: [
      "Prior year return (2024) ending basis: $18,960",
      "This year's return (2025) beginning basis entered: $17,720",
      "No distribution or loss entry found that would explain the difference",
    ],
    suggestedAction:
      "Reconcile against last year's K-1 and basis worksheet before this return proceeds to review.",
    status: "accepted",
  },
];

export const AI_RECS_BY_RETURN = (returnId: string) =>
  AI_RECOMMENDATIONS.filter((r) => r.returnId === returnId);

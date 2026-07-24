import type { TaxReturn } from "../types";

export const RETURNS: TaxReturn[] = [
  {
    id: "ret_maria_2025",
    clientId: "u_client_maria",
    taxYear: 2025,
    entityType: "individual",
    formType: "Form 1040",
    stage: "client_action_needed",
    assignedPreparerId: "u_preparer_dana",
    assignedReviewerId: "u_reviewer_sam",
    firmId: "northgate",
    estimatedRefundOrDue: { amount: 1842, direction: "refund" },
    blockers: [
      "Missing 1099-INT from Ridgeline Credit Union",
      "Childcare provider EIN not confirmed",
    ],
    updatedAt: "2026-07-21T14:32:00Z",
  },
  {
    id: "ret_owen_2025",
    clientId: "u_client_owen",
    taxYear: 2025,
    entityType: "business",
    formType: "Form 1120-S",
    stage: "in_review",
    assignedPreparerId: "u_seasonal_theo",
    assignedReviewerId: "u_reviewer_sam",
    firmId: "northgate",
    estimatedRefundOrDue: { amount: 6210, direction: "due" },
    blockers: [],
    updatedAt: "2026-07-20T09:15:00Z",
  },
  {
    id: "ret_dana_personal_2025",
    clientId: "u_dana_personal",
    taxYear: 2025,
    entityType: "individual",
    formType: "Form 1040",
    stage: "documents_needed",
    assignedPreparerId: "u_reviewer_sam",
    firmId: "northgate",
    blockers: ["Awaiting W-2 upload"],
    updatedAt: "2026-07-15T11:00:00Z",
  },
  {
    id: "ret_jordan_2025",
    clientId: "u_new_client_jordan",
    taxYear: 2025,
    entityType: "individual",
    formType: "Form 1040",
    stage: "intake",
    firmId: "northgate",
    blockers: [],
    updatedAt: "2026-07-22T09:00:00Z",
  },
];

// Challenge 7 + 9 solution
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Priya",
  "Wei",
  "Fatima",
  "Liam",
  "Noah",
  "Emma",
  "Sofia",
  "Mateo",
  "Chen",
  "Aaliyah",
  "Ravi",
  "Elena",
  "Marcus",
  "Nadia",
  "Kevin",
  "Grace",
  "Diego",
  "Yuki",
];
const LAST_NAMES = [
  "Nguyen",
  "Okafor",
  "Patel",
  "Rossi",
  "Kowalski",
  "Haddad",
  "Larsen",
  "Suzuki",
  "Ibrahim",
  "Costa",
  "Fischer",
  "Reyes",
  "Novak",
  "Bergman",
  "Osei",
  "Tanaka",
  "Duarte",
  "Volkov",
  "Sharma",
  "Lindqvist",
];
const STAGES: TaxReturn["stage"][] = [
  "intake",
  "documents_needed",
  "in_preparation",
  "in_review",
  "client_action_needed",
  "ready_to_file",
  "filed",
];
const PREPARER_IDS = ["u_preparer_dana", "u_reviewer_sam", "u_seasonal_theo"];
const FORM_TYPES = [
  "Form 1040",
  "Form 1040",
  "Form 1040",
  "Schedule C",
  "Form 1120-S",
];

export function generateBulkReturns(count: number): TaxReturn[] {
  const rand = seededRandom(42);
  const out: TaxReturn[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const stage = STAGES[Math.floor(rand() * STAGES.length)];
    const hasBlocker = rand() > 0.6;
    const daysAgo = Math.floor(rand() * 45);
    const d = new Date("2026-07-22T12:00:00Z");
    d.setDate(d.getDate() - daysAgo);
    out.push({
      id: `ret_bulk_${i}`,
      clientId: `u_bulk_client_${i}`,
      taxYear: 2025,
      entityType: rand() > 0.8 ? "business" : "individual",
      formType: FORM_TYPES[Math.floor(rand() * FORM_TYPES.length)],
      stage,
      assignedPreparerId:
        PREPARER_IDS[Math.floor(rand() * PREPARER_IDS.length)],
      assignedReviewerId: rand() > 0.5 ? "u_reviewer_sam" : undefined,
      firmId: "northgate",
      estimatedRefundOrDue:
        rand() > 0.1
          ? {
              amount: Math.floor(rand() * 9000) + 100,
              direction: rand() > 0.35 ? "refund" : "due",
            }
          : undefined,
      blockers: hasBlocker ? ["Awaiting client document"] : [],
      updatedAt: d.toISOString(),
    });
    BULK_CLIENT_NAMES[`u_bulk_client_${i}`] = `${first} ${last}`;
  }
  return out;
}

export const BULK_CLIENT_NAMES: Record<string, string> = {};
export const BULK_RETURNS = generateBulkReturns(240);

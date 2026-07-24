import type { TaxDocument, DocumentStatus } from "../types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const DOC_TYPES = [
  "W-2",
  "1099-NEC",
  "1099-INT",
  "1099-DIV",
  "1099-MISC",
  "1099-B",
  "1098",
  "1098-E",
  "K-1",
  "Receipt",
  "Bank Statement",
  "Prior Year Return",
  "Schedule K-1",
  "Property Tax Statement",
  "Charitable Donation Receipt",
  "Medical Expense Log",
  "Vehicle Mileage Log",
  "1095-A",
];
const STATUSES: DocumentStatus[] = [
  "uploaded",
  "processing",
  "extracted",
  "needs_attention",
  "verified",
];
const PAYERS = [
  "Brightpath Logistics",
  "Ridgeline Credit Union",
  "Meridian Home Lending",
  "Northwind Design Co.",
  "Sunrise Childcare",
  "Cascade Health Partners",
  "Union Pacific Freight",
  "Delacroix & Sons",
  "Harbor View Realty",
  "Fjeld Manufacturing",
  "Solstice Energy Co-op",
  "Blackwood Legal Group",
  "Ferrante Vineyards",
  "Copperline Financial",
  "Ashgrove Dental",
  "Pinecrest Motors",
];

export function generateBulkDocuments(
  count: number,
  returnIds: string[],
): TaxDocument[] {
  const rand = seededRandom(7);
  const out: TaxDocument[] = [];
  for (let i = 0; i < count; i++) {
    const type = DOC_TYPES[Math.floor(rand() * DOC_TYPES.length)];
    const payer = PAYERS[Math.floor(rand() * PAYERS.length)];
    const status = STATUSES[Math.floor(rand() * STATUSES.length)];
    const returnId = returnIds[Math.floor(rand() * returnIds.length)];
    const daysAgo = Math.floor(rand() * 90);
    const d = new Date("2026-07-22T12:00:00Z");
    d.setDate(d.getDate() - daysAgo);
    const pageCount = 1 + Math.floor(rand() * 3);
    out.push({
      id: `doc_bulk_${i}`,
      returnId,
      name: `${type}: ${payer}`,
      type,
      uploadedBy: "u_client_maria",
      uploadedAt: d.toISOString(),
      status,
      pages: Array.from({ length: pageCount }, (_, p) => ({
        page: p + 1,
        imageLabel: `${type}, page ${p + 1} of ${pageCount}`,
        ocrConfidence: 0.55 + rand() * 0.44,
      })),
      linkedFieldIds: [],
    });
  }
  return out;
}

export const BULK_DOCUMENTS = generateBulkDocuments(320, [
  "ret_maria_2025",
  "ret_owen_2025",
  "ret_dana_personal_2025",
]);

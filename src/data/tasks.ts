import type { Task } from "../types";

export const TASKS: Task[] = [
  {
    id: "task_confirm_1099int",
    returnId: "ret_maria_2025",
    title: "Confirm 1099-INT interest amount",
    description:
      "The scanned amount is partially unreadable. Upload a clearer copy or confirm the amount by phone/portal.",
    status: "blocked",
    priority: "high",
    ownerType: "client",
    assigneeId: "u_client_maria",
    dueDate: "2026-07-28",
    linkedDocumentIds: ["doc_1099int_ridgeline"],
    linkedMessageIds: ["msg_1099int_question"],
    createdAt: "2026-07-08T10:25:00Z",
    agingDays: 15,
  },
  {
    id: "task_confirm_ein",
    returnId: "ret_maria_2025",
    title: "Get childcare provider's Tax ID",
    description:
      "Form 2441 requires the childcare provider's EIN or SSN. It isn't on the annual statement you uploaded.",
    status: "not_started",
    priority: "urgent",
    ownerType: "client",
    assigneeId: "u_client_maria",
    dueDate: "2026-07-25",
    linkedDocumentIds: ["doc_childcare_receipt"],
    linkedMessageIds: ["msg_childcare_ein"],
    createdAt: "2026-07-09T08:00:00Z",
    agingDays: 14,
  },
  {
    id: "task_review_schedule_c",
    returnId: "ret_maria_2025",
    title: "Review Schedule C entry for freelance income",
    description:
      "Quick sanity check that the Northwind 1099-NEC was categorized correctly before this return moves to sign-off.",
    status: "in_review",
    priority: "medium",
    ownerType: "firm",
    assigneeId: "u_reviewer_sam",
    linkedDocumentIds: ["doc_1099nec_freelance"],
    createdAt: "2026-07-11T09:41:00Z",
    agingDays: 12,
  },
  {
    id: "task_owen_k1_review",
    returnId: "ret_owen_2025",
    title: "Reconcile shareholder basis worksheet",
    description:
      "Basis calc doesn't match last year's ending balance, and needs a second look before this return can go to review.",
    status: "in_progress",
    priority: "urgent",
    ownerType: "firm",
    assigneeId: "u_seasonal_theo",
    dueDate: "2026-07-24",
    createdAt: "2026-07-14T13:00:00Z",
    agingDays: 9,
  },
  {
    id: "task_dana_personal_w2",
    returnId: "ret_dana_personal_2025",
    title: "Upload your W-2",
    description:
      "Your personal return can't move forward until this is uploaded.",
    status: "not_started",
    priority: "low",
    ownerType: "client",
    assigneeId: "u_dana_personal",
    createdAt: "2026-07-15T11:00:00Z",
    agingDays: 8,
  },
];

export const TASKS_BY_RETURN = (returnId: string) =>
  TASKS.filter((t) => t.returnId === returnId);

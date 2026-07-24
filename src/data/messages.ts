import type { Message, Thread } from "../types";

export const THREADS: Thread[] = [
  {
    id: "thread_1099int",
    returnId: "ret_maria_2025",
    subject: "1099-INT interest amount, need a clearer copy",
    linkedDocumentId: "doc_1099int_ridgeline",
    linkedTaskId: "task_confirm_1099int",
    ownerNextAction: "client",
    resolved: false,
  },
  {
    id: "thread_childcare_ein",
    returnId: "ret_maria_2025",
    subject: "Childcare provider Tax ID needed for Form 2441",
    linkedDocumentId: "doc_childcare_receipt",
    linkedTaskId: "task_confirm_ein",
    ownerNextAction: "client",
    resolved: false,
  },
  {
    id: "thread_w2_confirm",
    returnId: "ret_maria_2025",
    subject: "W-2 received, looks good",
    linkedDocumentId: "doc_w2_brightpath",
    ownerNextAction: "firm",
    resolved: true,
  },
  {
    id: "thread_internal_schedulec",
    returnId: "ret_maria_2025",
    subject: "[Internal] Double-check Schedule C categorization",
    ownerNextAction: "firm",
    resolved: false,
  },
];

export const MESSAGES: Message[] = [
  {
    id: "msg_w2_confirm",
    threadId: "thread_w2_confirm",
    returnId: "ret_maria_2025",
    authorId: "u_preparer_dana",
    authorRoleAtSend: "preparer",
    visibility: "client_visible",
    body: "Got your W-2 from Brightpath, thanks, that one's all set. No action needed from you here.",
    sentAt: "2026-06-03T09:12:00Z",
    linkedDocumentId: "doc_w2_brightpath",
  },
  {
    id: "msg_1099int_question",
    threadId: "thread_1099int",
    returnId: "ret_maria_2025",
    authorId: "u_preparer_dana",
    authorRoleAtSend: "preparer",
    visibility: "client_visible",
    body: "The interest amount on your Ridgeline 1099-INT is a little blurry in the scan. We're reading it as $214.90 but want to confirm before we file. Could you check your online statement or upload a clearer photo?",
    sentAt: "2026-07-09T11:00:00Z",
    linkedDocumentId: "doc_1099int_ridgeline",
    linkedTaskId: "task_confirm_1099int",
    linkedFieldId: "fld_interest_income",
  },
  {
    id: "msg_1099int_reply",
    threadId: "thread_1099int",
    returnId: "ret_maria_2025",
    authorId: "u_client_maria",
    authorRoleAtSend: "client",
    visibility: "client_visible",
    body: "Sure, let me log into the credit union site and check. Will get back to you today or tomorrow.",
    sentAt: "2026-07-09T18:44:00Z",
    linkedTaskId: "task_confirm_1099int",
  },
  {
    id: "msg_childcare_ein",
    threadId: "thread_childcare_ein",
    returnId: "ret_maria_2025",
    authorId: "u_preparer_dana",
    authorRoleAtSend: "preparer",
    visibility: "client_visible",
    body: "To claim the childcare credit we need Sunrise Childcare's Tax ID (EIN). It's not on the annual statement you sent. Could you ask them for it, or check a receipt/invoice that might have it printed?",
    sentAt: "2026-07-09T12:30:00Z",
    linkedDocumentId: "doc_childcare_receipt",
    linkedTaskId: "task_confirm_ein",
    linkedFieldId: "fld_childcare_expense",
  },
  {
    id: "msg_internal_1",
    threadId: "thread_internal_schedulec",
    returnId: "ret_maria_2025",
    authorId: "u_preparer_dana",
    authorRoleAtSend: "preparer",
    visibility: "internal",
    body: "Sam, the Northwind 1099-NEC is small ($3,150) and this looks like a one-off freelance gig, not an ongoing business. Categorized as Schedule C, no home office or vehicle deductions claimed. Flag if you disagree before I move this to review.",
    sentAt: "2026-07-11T09:42:00Z",
    linkedFieldId: "fld_freelance_income",
  },
  {
    id: "msg_internal_2",
    threadId: "thread_internal_schedulec",
    returnId: "ret_maria_2025",
    authorId: "u_reviewer_sam",
    authorRoleAtSend: "reviewer",
    visibility: "internal",
    body: "Agreed, Schedule C is right for this. Approved, so go ahead and move it into review queue once the two client blockers clear.",
    sentAt: "2026-07-11T14:05:00Z",
  },
];

export const MESSAGES_BY_THREAD = (threadId: string) =>
  MESSAGES.filter((m) => m.threadId === threadId);
export const THREADS_BY_RETURN = (returnId: string) =>
  THREADS.filter((t) => t.returnId === returnId);

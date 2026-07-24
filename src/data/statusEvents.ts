import type { StatusEvent } from "../types";

export const STATUS_EVENTS: StatusEvent[] = [
  {
    id: "se_1",
    returnId: "ret_maria_2025",
    stage: "intake",
    occurredAt: "2026-05-20T10:00:00Z",
    note: "Return created for tax year 2025.",
  },
  {
    id: "se_2",
    returnId: "ret_maria_2025",
    stage: "documents_needed",
    occurredAt: "2026-05-20T10:05:00Z",
    note: "Document checklist sent to client.",
  },
  {
    id: "se_3",
    returnId: "ret_maria_2025",
    stage: "in_preparation",
    occurredAt: "2026-06-20T09:00:00Z",
    actorId: "u_preparer_dana",
    note: "Enough documents received to begin preparation.",
  },
  {
    id: "se_4",
    returnId: "ret_maria_2025",
    stage: "client_action_needed",
    occurredAt: "2026-07-09T12:30:00Z",
    actorId: "u_preparer_dana",
    note: "Two items need client input before this can move forward.",
  },

  {
    id: "se_5",
    returnId: "ret_owen_2025",
    stage: "intake",
    occurredAt: "2026-04-02T10:00:00Z",
  },
  {
    id: "se_6",
    returnId: "ret_owen_2025",
    stage: "documents_needed",
    occurredAt: "2026-04-05T10:00:00Z",
  },
  {
    id: "se_7",
    returnId: "ret_owen_2025",
    stage: "in_preparation",
    occurredAt: "2026-05-10T10:00:00Z",
    actorId: "u_seasonal_theo",
  },
  {
    id: "se_8",
    returnId: "ret_owen_2025",
    stage: "in_review",
    occurredAt: "2026-07-18T10:00:00Z",
    actorId: "u_seasonal_theo",
    note: "Sent to Sam for review.",
  },

  {
    id: "se_9",
    returnId: "ret_dana_personal_2025",
    stage: "intake",
    occurredAt: "2026-07-15T11:00:00Z",
  },
  {
    id: "se_10",
    returnId: "ret_dana_personal_2025",
    stage: "documents_needed",
    occurredAt: "2026-07-15T11:00:00Z",
  },
];

export const STATUS_EVENTS_BY_RETURN = (returnId: string) =>
  STATUS_EVENTS.filter((e) => e.returnId === returnId).sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
  );

export const STAGE_META: Record<
  string,
  { label: string; clientLabel: string; description: string; order: number }
> = {
  intake: {
    label: "Intake",
    clientLabel: "Getting started",
    description: "Return created, awaiting initial documents.",
    order: 0,
  },
  documents_needed: {
    label: "Documents needed",
    clientLabel: "We need a few documents from you",
    description: "Waiting on source documents from the client.",
    order: 1,
  },
  in_preparation: {
    label: "In preparation",
    clientLabel: "Your preparer is working on it",
    description: "Preparer is actively building out the return.",
    order: 2,
  },
  client_action_needed: {
    label: "Client action needed",
    clientLabel: "Action needed from you",
    description:
      "Preparation is paused on specific answers or documents from the client.",
    order: 3,
  },
  in_review: {
    label: "In review",
    clientLabel: "Final review in progress",
    description: "A reviewer is checking the completed return before filing.",
    order: 4,
  },
  ready_to_file: {
    label: "Ready to file",
    clientLabel: "Ready to file, awaiting your signature",
    description:
      "Review is complete; needs client sign-off / e-file authorization.",
    order: 5,
  },
  filed: {
    label: "Filed",
    clientLabel: "Filed",
    description: "Return has been submitted to the IRS/state.",
    order: 6,
  },
  amended: {
    label: "Amended",
    clientLabel: "Amendment in progress",
    description: "A previously filed return is being corrected.",
    order: 7,
  },
};

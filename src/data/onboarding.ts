import type { OnboardingItem } from "../types";

export const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    id: "ob_1",
    clientId: "u_client_maria",
    label: "Upload your W-2(s)",
    kind: "document",
    status: "done",
  },
  {
    id: "ob_2",
    clientId: "u_client_maria",
    label: "Upload 1099s (interest, freelance, etc.)",
    kind: "document",
    status: "done",
  },
  {
    id: "ob_3",
    clientId: "u_client_maria",
    label: "Answer the household & dependents questionnaire",
    kind: "questionnaire",
    status: "done",
  },
  {
    id: "ob_4",
    clientId: "u_client_maria",
    label: "Confirm childcare provider details",
    kind: "questionnaire",
    status: "in_progress",
  },
  {
    id: "ob_5",
    clientId: "u_client_maria",
    label: "Sign engagement letter",
    kind: "signature",
    status: "done",
  },
  {
    id: "ob_6",
    clientId: "u_client_maria",
    label: "Pay preparation fee",
    kind: "payment",
    status: "not_started",
  },
];

// Challenge 3 solution
export const NEW_CLIENT_ID = "u_new_client_jordan";
export const NEW_CLIENT_ONBOARDING: OnboardingItem[] = [
  {
    id: "nob_1",
    clientId: NEW_CLIENT_ID,
    label: "Upload your W-2(s)",
    kind: "document",
    status: "not_started",
  },
  {
    id: "nob_2",
    clientId: NEW_CLIENT_ID,
    label: "Answer the household & dependents questionnaire",
    kind: "questionnaire",
    status: "not_started",
  },
  {
    id: "nob_3",
    clientId: NEW_CLIENT_ID,
    label: "Sign engagement letter",
    kind: "signature",
    status: "not_started",
  },
  {
    id: "nob_4",
    clientId: NEW_CLIENT_ID,
    label: "Pay preparation fee",
    kind: "payment",
    status: "not_started",
  },
];

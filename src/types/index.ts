export type RoleId =
  | "client"
  | "preparer"
  | "reviewer"
  | "admin"
  | "seasonal_staff"
  | "business_owner";

export interface Role {
  id: RoleId;
  label: string;
  description: string;
}

// Challenge 5 solution
export interface UserAccount {
  id: string;
  name: string;
  initials: string;
  email: string;
  roles: RoleId[];
  firmId?: string;
}

// Challenge 8 solution
export type FieldValueState =
  | "ai_extracted"
  | "needs_review"
  | "verified"
  | "edited"
  | "locked"
  | "calculated";

// Challenge 1 solution
export interface TraceTransform {
  label: string;
  formula?: string;
}

// Challenge 1 solution
export interface SourceRef {
  documentId: string;
  page: number;
  boxLabel: string;
  snippetText: string;
  coordinates: { x: number; y: number; w: number; h: number };
}

// Challenge 1 + 8 + 10 solution
export interface ReturnField {
  id: string;
  returnId: string;
  formSection: string;
  lineLabel: string;
  value: string;
  state: FieldValueState;
  confidence?: number;
  source?: SourceRef;
  transform?: TraceTransform;
  editableBy: RoleId[];
  lastTouchedBy?: string;
  lastTouchedAt?: string;
  aiNote?: string;
  aiEvidence?: string[];
  flagReason?: string;
}

export interface DocumentPage {
  page: number;
  imageLabel: string;
  ocrConfidence: number;
}

// Challenge 6 solution
export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "extracted"
  | "needs_attention"
  | "verified";

// Challenge 9 solution
export interface TaxDocument {
  id: string;
  returnId: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  pages: DocumentPage[];
  linkedFieldIds: string[];
  linkedTaskIds?: string[];
  linkedMessageIds?: string[];
}

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "in_review"
  | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskOwnerType = "client" | "firm";

// Challenge 2 + 7 solution
export interface Task {
  id: string;
  returnId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  ownerType: TaskOwnerType;
  assigneeId?: string;
  dueDate?: string;
  linkedDocumentIds?: string[];
  linkedMessageIds?: string[];
  createdAt: string;
  agingDays: number;
}

export type MessageVisibility = "internal" | "client_visible";

// Challenge 2 solution
export interface Message {
  id: string;
  threadId: string;
  returnId: string;
  authorId: string;
  authorRoleAtSend: RoleId;
  visibility: MessageVisibility;
  body: string;
  sentAt: string;
  linkedDocumentId?: string;
  linkedTaskId?: string;
  linkedFieldId?: string;
}

// Challenge 2 + 4 solution
export interface Thread {
  id: string;
  returnId: string;
  subject: string;
  linkedDocumentId?: string;
  linkedTaskId?: string;
  ownerNextAction: TaskOwnerType;
  resolved: boolean;
}

// Challenge 6 solution
export type ReturnStage =
  | "intake"
  | "documents_needed"
  | "in_preparation"
  | "in_review"
  | "client_action_needed"
  | "ready_to_file"
  | "filed"
  | "amended";

export interface StatusEvent {
  id: string;
  returnId: string;
  stage: ReturnStage;
  occurredAt: string;
  actorId?: string;
  note?: string;
}

// Challenge 6 + 7 solution
export interface TaxReturn {
  id: string;
  clientId: string;
  taxYear: number;
  entityType: "individual" | "business";
  formType: string;
  stage: ReturnStage;
  assignedPreparerId?: string;
  assignedReviewerId?: string;
  firmId: string;
  estimatedRefundOrDue?: { amount: number; direction: "refund" | "due" };
  blockers: string[];
  updatedAt: string;
}

// Challenge 3 solution
export interface OnboardingItem {
  id: string;
  clientId: string;
  label: string;
  kind: "document" | "questionnaire" | "signature" | "payment";
  status: "not_started" | "in_progress" | "done";
}

// Challenge 10 solution
export interface AIRecommendation {
  id: string;
  returnId: string;
  fieldId?: string;
  kind:
    | "deduction_suggestion"
    | "anomaly_warning"
    | "missing_document"
    | "optimization";
  title: string;
  summary: string;
  confidence: number;
  evidence: string[];
  suggestedAction: string;
  status: "pending" | "accepted" | "dismissed" | "modified";
  potentialImpact?: { amount: number; direction: "saves" | "flags" };
}

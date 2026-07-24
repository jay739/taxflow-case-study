// Challenge 6 solution
type AnyStatus = string;

const MAP: Record<
  AnyStatus,
  {
    label: string;
    tone: "success" | "attention" | "blocking" | "info" | "neutral";
  }
> = {
  ai_extracted: { label: "AI-extracted", tone: "info" },
  needs_review: { label: "Needs review", tone: "attention" },
  verified: { label: "Verified", tone: "success" },
  edited: { label: "Edited", tone: "info" },
  locked: { label: "Locked", tone: "neutral" },
  calculated: { label: "Calculated", tone: "neutral" },
  uploaded: { label: "Uploaded", tone: "neutral" },
  processing: { label: "Processing", tone: "info" },
  extracted: { label: "Extracted", tone: "info" },
  needs_attention: { label: "Needs attention", tone: "attention" },
  not_started: { label: "Not started", tone: "neutral" },
  in_progress: { label: "In progress", tone: "info" },
  blocked: { label: "Blocked", tone: "blocking" },
  in_review: { label: "In review", tone: "attention" },
  done: { label: "Done", tone: "success" },
  intake: { label: "Intake", tone: "neutral" },
  documents_needed: { label: "Documents needed", tone: "attention" },
  in_preparation: { label: "In preparation", tone: "info" },
  client_action_needed: { label: "Client action needed", tone: "blocking" },
  ready_to_file: { label: "Ready to file", tone: "success" },
  filed: { label: "Filed", tone: "success" },
  amended: { label: "Amended", tone: "attention" },
};

export function StatusPill({ state }: { state: AnyStatus }) {
  const meta = MAP[state] ?? { label: state, tone: "neutral" as const };
  return (
    <span className={`badge badge-${meta.tone}`}>
      <span className={`dot dot-${meta.tone}`} />
      {meta.label}
    </span>
  );
}

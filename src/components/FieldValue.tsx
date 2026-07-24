import type { ReturnField } from "../types";
import { useApp } from "../context/AppContext";

const STATE_ICON: Record<ReturnField["state"], string> = {
  ai_extracted: "◇",
  needs_review: "!",
  verified: "✓",
  edited: "✎",
  locked: "🔒",
  calculated: "Σ",
};

const STATE_LABEL: Record<ReturnField["state"], string> = {
  ai_extracted: "AI-extracted, not yet reviewed",
  needs_review: "Needs review",
  verified: "Verified by a human",
  edited: "Manually edited",
  locked: "Locked, cannot be changed here",
  calculated: "Calculated from other fields",
};

export function FieldValue({
  field,
  showLabel = true,
}: {
  field: ReturnField;
  showLabel?: boolean;
}) {
  const { openDrawer, activeRole } = useApp();
  const isInert = field.state === "locked" || field.state === "calculated";
  const canEdit = field.editableBy.includes(activeRole);

  return (
    <button
      type="button"
      className={`field-value state-${field.state}`}
      onClick={() =>
        openDrawer({
          kind: "field-trace",
          id: field.id,
          returnId: field.returnId,
        })
      }
      title={
        STATE_LABEL[field.state] +
        (isInert
          ? ""
          : canEdit
            ? ", click to inspect or edit"
            : ", click to inspect")
      }
      aria-label={`${field.lineLabel}: ${field.value}. ${STATE_LABEL[field.state]}.`}
    >
      <span className="field-icon" aria-hidden="true">
        {STATE_ICON[field.state]}
      </span>
      <span>{field.value}</span>
      {showLabel && field.state === "needs_review" && (
        <span className="text-sm">needs review</span>
      )}
    </button>
  );
}

export function FieldAffordanceLegend() {
  return (
    <div className="field-affordance-legend">
      <span className="legend-item">
        <span className="dot dot-ai" /> AI-extracted, unreviewed
      </span>
      <span className="legend-item">
        <span className="dot dot-attention" /> Needs review
      </span>
      <span className="legend-item">
        <span className="dot dot-success" /> Verified
      </span>
      <span className="legend-item">
        <span className="dot dot-neutral" /> Locked / calculated
      </span>
    </div>
  );
}

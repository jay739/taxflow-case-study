import type { ReactNode } from "react";
import { useApp } from "../context/AppContext";
import {
  FIELD_BY_ID,
  DOCUMENTS,
  DOC_PLACEHOLDER_LINES,
  AI_RECOMMENDATIONS,
  TASKS,
  MESSAGES,
  USERS,
} from "../data";
import { Link } from "react-router-dom";
import { StatusPill } from "./StatusPill";

function DrawerShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer" role="dialog" aria-label={title}>
        <div className="drawer-header">
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
            {subtitle && (
              <div className="text-muted text-sm" style={{ marginTop: 2 }}>
                {subtitle}
              </div>
            )}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </>
  );
}

// Challenge 1 + 8 + 10 solution
function FieldTraceDrawer({
  fieldId,
  onClose,
}: {
  fieldId: string;
  onClose: () => void;
}) {
  const field = FIELD_BY_ID(fieldId);
  if (!field) return null;
  const doc = field.source
    ? DOCUMENTS.find((d) => d.id === field.source!.documentId)
    : undefined;
  const lines = doc ? (DOC_PLACEHOLDER_LINES[doc.id] ?? []) : [];
  const touchedBy = field.lastTouchedBy
    ? USERS.find((u) => u.id === field.lastTouchedBy)
    : undefined;

  return (
    <DrawerShell
      title={field.lineLabel}
      subtitle={field.formSection}
      onClose={onClose}
    >
      <div className="stack">
        <div>
          <div className="section-title">Current value</div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {field.value}
          </div>
          <div style={{ marginTop: 6 }}>
            <StatusPill state={field.state} />
          </div>
        </div>

        {field.flagReason && (
          <div
            className="card card-pad"
            style={{
              background: "var(--attention-bg)",
              borderColor: "var(--attention-border)",
            }}
          >
            <div
              className="section-title"
              style={{ color: "var(--attention)" }}
            >
              Why this needs review
            </div>
            <div className="text-sm">{field.flagReason}</div>
          </div>
        )}

        {field.aiNote && (
          <div
            className="card card-pad"
            style={{
              background: "var(--ai-bg)",
              borderColor: "var(--ai-border)",
            }}
          >
            <div className="section-title" style={{ color: "var(--ai)" }}>
              What the AI did
            </div>
            <div className="text-sm" style={{ marginBottom: 8 }}>
              {field.aiNote}
            </div>
            {field.confidence !== undefined && (
              <div className="text-sm mono" style={{ marginBottom: 8 }}>
                Confidence: {(field.confidence * 100).toFixed(0)}%
              </div>
            )}
            {field.aiEvidence && (
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
                {field.aiEvidence.map((e, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {e}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {field.transform && (
          <div>
            <div className="section-title">How this value was derived</div>
            <div className="text-sm">{field.transform.label}</div>
            {field.transform.formula && (
              <div
                className="mono text-sm"
                style={{
                  marginTop: 6,
                  padding: "6px 10px",
                  background: "var(--surface-sunken)",
                  borderRadius: 6,
                }}
              >
                {field.transform.formula}
              </div>
            )}
          </div>
        )}

        {field.source && doc && (
          <div>
            <div className="section-title">Source document</div>
            <Link
              to={`/documents/${doc.id}`}
              className="card card-pad"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
              }}
              onClick={onClose}
            >
              <div className="flex justify-between items-center">
                <div style={{ fontWeight: 600, fontSize: 13 }}>{doc.name}</div>
                <span className="badge badge-neutral">
                  page {field.source.page}
                </span>
              </div>
              <div className="text-sm text-muted" style={{ marginTop: 4 }}>
                {field.source.boxLabel}
              </div>
            </Link>
            <div
              className="card card-pad"
              style={{ marginTop: 10, background: "var(--surface-sunken)" }}
            >
              <div className="section-title">Document excerpt</div>
              {lines.map((line, i) => {
                const isHighlighted = line.includes(
                  field.source!.snippetText.slice(0, 12),
                );
                return (
                  <div
                    key={i}
                    className="mono text-sm"
                    style={{
                      padding: "3px 6px",
                      borderRadius: 4,
                      background: isHighlighted
                        ? "var(--attention-bg)"
                        : "transparent",
                      border: isHighlighted
                        ? "1px solid var(--attention-border)"
                        : "1px solid transparent",
                      whiteSpace: "pre",
                      overflowX: "auto",
                    }}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-muted" style={{ marginTop: 6 }}>
              Simulated extraction, shown for illustration.
            </div>
          </div>
        )}

        {touchedBy && (
          <div className="text-sm text-muted">
            Last touched by {touchedBy.name} ·{" "}
            {field.lastTouchedAt &&
              new Date(field.lastTouchedAt).toLocaleDateString()}
          </div>
        )}

        {field.editableBy.length > 0 ? (
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">Edit value</button>
            <button className="btn btn-sm">Mark as verified</button>
          </div>
        ) : (
          <div className="text-sm text-muted">
            This field is locked and cannot be edited directly.
          </div>
        )}
      </div>
    </DrawerShell>
  );
}

// Challenge 4 solution
function DocumentDrawer({
  documentId,
  onClose,
}: {
  documentId: string;
  onClose: () => void;
}) {
  const doc = DOCUMENTS.find((d) => d.id === documentId);
  if (!doc) return null;
  const linkedFields = doc.linkedFieldIds
    .map((id) => FIELD_BY_ID(id))
    .filter(Boolean);
  const linkedTasks = TASKS.filter((t) => doc.linkedTaskIds?.includes(t.id));
  const linkedMessages = MESSAGES.filter((m) =>
    doc.linkedMessageIds?.includes(m.id),
  );

  return (
    <DrawerShell title={doc.name} subtitle={doc.type} onClose={onClose}>
      <div className="stack">
        <div className="flex gap-2 items-center">
          <span className="badge badge-neutral">
            {doc.pages.length} page{doc.pages.length > 1 ? "s" : ""}
          </span>
          <StatusPill state={doc.status} />
        </div>
        <div>
          <div className="section-title">Connected to</div>
          <div className="stack" style={{ marginTop: 0 }}>
            {linkedFields.length > 0 && (
              <div>
                <div className="text-sm text-muted" style={{ marginBottom: 4 }}>
                  Return fields ({linkedFields.length})
                </div>
                {linkedFields.map(
                  (f) =>
                    f && (
                      <div key={f.id} style={{ marginBottom: 4 }}>
                        <FieldValueMini field={f} />
                      </div>
                    ),
                )}
              </div>
            )}
            {linkedTasks.length > 0 && (
              <div>
                <div className="text-sm text-muted" style={{ marginBottom: 4 }}>
                  Open tasks ({linkedTasks.length})
                </div>
                {linkedTasks.map((t) => (
                  <Link
                    key={t.id}
                    to="/tasks"
                    onClick={onClose}
                    className="card card-pad"
                    style={{
                      display: "block",
                      marginBottom: 6,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            )}
            {linkedMessages.length > 0 && (
              <div>
                <div className="text-sm text-muted" style={{ marginBottom: 4 }}>
                  Related messages ({linkedMessages.length})
                </div>
                {linkedMessages.map((m) => (
                  <Link
                    key={m.id}
                    to="/messages"
                    onClick={onClose}
                    className="card card-pad"
                    style={{
                      display: "block",
                      marginBottom: 6,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div className="text-sm">
                      {m.body.slice(0, 90)}
                      {m.body.length > 90 ? "…" : ""}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {linkedFields.length === 0 &&
              linkedTasks.length === 0 &&
              linkedMessages.length === 0 && (
                <div className="text-sm text-muted">
                  No connected objects yet.
                </div>
              )}
          </div>
        </div>
        <Link
          to={`/documents/${doc.id}`}
          className="btn btn-primary btn-sm"
          onClick={onClose}
          style={{ textDecoration: "none", width: "fit-content" }}
        >
          Open full document viewer
        </Link>
      </div>
    </DrawerShell>
  );
}

function FieldValueMini({
  field,
}: {
  field: NonNullable<ReturnType<typeof FIELD_BY_ID>>;
}) {
  const { openDrawer } = useApp();
  return (
    <button
      className={`field-value state-${field.state}`}
      onClick={() => openDrawer({ kind: "field-trace", id: field.id })}
      style={{ width: "100%", justifyContent: "flex-start" }}
    >
      <span>
        {field.lineLabel}: {field.value}
      </span>
    </button>
  );
}

// Challenge 10 solution
function AIRecommendationDrawer({
  recId,
  onClose,
}: {
  recId: string;
  onClose: () => void;
}) {
  const rec = AI_RECOMMENDATIONS.find((r) => r.id === recId);
  if (!rec) return null;
  return (
    <DrawerShell
      title={rec.title}
      subtitle="AI recommendation"
      onClose={onClose}
    >
      <div className="stack">
        <div className="flex items-center gap-2">
          <span className="badge badge-ai">◇ AI-generated</span>
          <span className="text-sm mono text-muted">
            {(rec.confidence * 100).toFixed(0)}% confidence
          </span>
        </div>
        <div className="text-sm">{rec.summary}</div>
        <div>
          <div className="section-title">Evidence</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5 }}>
            {rec.evidence.map((e, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="card card-pad"
          style={{
            background: "var(--info-bg)",
            borderColor: "var(--info-border)",
          }}
        >
          <div className="section-title" style={{ color: "var(--info)" }}>
            Suggested action
          </div>
          <div className="text-sm">{rec.suggestedAction}</div>
        </div>
        {rec.fieldId && (
          <button className="btn btn-sm" onClick={() => {}}>
            <Link
              to="#"
              onClick={(e) => e.preventDefault()}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              View the affected field
            </Link>
          </button>
        )}
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm">Accept suggestion</button>
          <button className="btn btn-sm">Ask the client</button>
          <button className="btn btn-ghost btn-sm">Dismiss</button>
        </div>
      </div>
    </DrawerShell>
  );
}

export function GlobalDrawer() {
  const { drawer, closeDrawer } = useApp();
  if (!drawer) return null;

  if (drawer.kind === "field-trace")
    return <FieldTraceDrawer fieldId={drawer.id} onClose={closeDrawer} />;
  if (drawer.kind === "document")
    return <DocumentDrawer documentId={drawer.id} onClose={closeDrawer} />;
  if (drawer.kind === "ai-recommendation")
    return <AIRecommendationDrawer recId={drawer.id} onClose={closeDrawer} />;
  return null;
}

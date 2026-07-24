import { useParams, Link } from "react-router-dom";
import {
  DOCUMENTS,
  DOC_PLACEHOLDER_LINES,
  FIELDS,
  TASKS,
  MESSAGES,
  BULK_DOCUMENTS,
} from "../data";
import { StatusPill } from "../components/StatusPill";
import { FieldValue } from "../components/FieldValue";

export function DocumentDetail() {
  const { id } = useParams();
  const doc = [...DOCUMENTS, ...BULK_DOCUMENTS].find((d) => d.id === id);
  if (!doc) return <div className="empty-state">Document not found.</div>;

  const lines = DOC_PLACEHOLDER_LINES[doc.id] ?? [];
  const linkedFields = FIELDS.filter((f) => doc.linkedFieldIds.includes(f.id));
  const linkedTasks = TASKS.filter((t) => doc.linkedTaskIds?.includes(t.id));
  const linkedMessages = MESSAGES.filter((m) =>
    doc.linkedMessageIds?.includes(m.id),
  );

  return (
    <div className="stack">
      <div className="flex justify-between items-start">
        <div>
          <h1 style={{ fontSize: 19, margin: "0 0 4px" }}>{doc.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted">
            <StatusPill state={doc.status} />
            <span>{doc.type}</span>
            <span>
              · {doc.pages.length} page{doc.pages.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <Link
          to="/documents"
          className="btn btn-sm"
          style={{ textDecoration: "none" }}
        >
          ← All documents
        </Link>
      </div>

      <div className="two-col-grid-uneven">
        <div className="card card-pad">
          <div className="section-title">Extracted text</div>
          <div
            style={{
              background: "var(--surface-sunken)",
              borderRadius: 8,
              padding: 16,
            }}
          >
            {lines.length === 0 && (
              <div className="text-muted text-sm">
                No extracted text available for this document yet.
              </div>
            )}
            {lines.map((line, i) => (
              <div
                key={i}
                className="mono text-sm"
                style={{
                  padding: "3px 6px",
                  whiteSpace: "pre",
                  overflowX: "auto",
                }}
              >
                {line}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted" style={{ marginTop: 8 }}>
            Simulated extraction, no scanned image or real OCR behind this.
          </div>
          <div className="flex gap-2" style={{ marginTop: 12 }}>
            {doc.pages.map((p) => (
              <span key={p.page} className="badge badge-neutral mono">
                p.{p.page} · {(p.ocrConfidence * 100).toFixed(0)}% OCR
                confidence
              </span>
            ))}
          </div>
        </div>

        <div className="stack">
          {linkedFields.length > 0 && (
            <div className="card card-pad">
              <div className="section-title">Traced to these return fields</div>
              <div className="stack" style={{ marginTop: 0, gap: 8 }}>
                {linkedFields.map((f) => (
                  <div key={f.id} className="flex justify-between items-center">
                    <span className="text-sm">{f.lineLabel}</span>
                    <FieldValue field={f} showLabel={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {linkedTasks.length > 0 && (
            <div className="card card-pad">
              <div className="section-title">Related tasks</div>
              <div className="stack" style={{ marginTop: 0, gap: 6 }}>
                {linkedTasks.map((t) => (
                  <Link
                    key={t.id}
                    to="/tasks"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t.title}</span>
                      <StatusPill state={t.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {linkedMessages.length > 0 && (
            <div className="card card-pad">
              <div className="section-title">Related messages</div>
              <div className="stack" style={{ marginTop: 0, gap: 6 }}>
                {linkedMessages.map((m) => (
                  <Link
                    key={m.id}
                    to="/messages"
                    className="text-sm"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {m.body.slice(0, 100)}
                    {m.body.length > 100 ? "…" : ""}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {linkedFields.length === 0 &&
            linkedTasks.length === 0 &&
            linkedMessages.length === 0 && (
              <div className="card card-pad text-sm text-muted">
                Not yet connected to any return fields, tasks, or messages.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

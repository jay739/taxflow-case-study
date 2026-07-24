import { useParams, Link } from "react-router-dom";
import {
  RETURNS,
  FIELDS_BY_RETURN,
  USERS,
  AI_RECS_BY_RETURN,
  STATUS_EVENTS_BY_RETURN,
  STAGE_META,
  TASKS_BY_RETURN,
  THREADS_BY_RETURN,
} from "../data";
import { FieldValue, FieldAffordanceLegend } from "../components/FieldValue";
import { StatusPill } from "../components/StatusPill";
import { useApp } from "../context/AppContext";
import { useMemo } from "react";

const SECTION_ORDER = [
  "Form 1040",
  "Schedule A",
  "Schedule C",
  "Form 2441",
  "Worksheet",
];

export function ReturnDetail() {
  const { id } = useParams();
  const { activeRole, openDrawer } = useApp();
  const ret = RETURNS.find((r) => r.id === id) ?? RETURNS[0];
  const fields = FIELDS_BY_RETURN(ret.id);
  const aiRecs = AI_RECS_BY_RETURN(ret.id);
  const events = STATUS_EVENTS_BY_RETURN(ret.id);
  const tasks = TASKS_BY_RETURN(ret.id);
  const threads = THREADS_BY_RETURN(ret.id);
  const client = USERS.find((u) => u.id === ret.clientId);
  const preparer = USERS.find((u) => u.id === ret.assignedPreparerId);
  const reviewer = USERS.find((u) => u.id === ret.assignedReviewerId);
  const isClientView =
    activeRole === "client" || activeRole === "business_owner";

  const sections = useMemo(() => {
    const map = new Map<string, typeof fields>();
    for (const f of fields) {
      if (!map.has(f.formSection)) map.set(f.formSection, []);
      map.get(f.formSection)!.push(f);
    }
    return SECTION_ORDER.filter((s) => map.has(s)).map(
      (s) => [s, map.get(s)!] as const,
    );
  }, [fields]);

  const needsReviewCount = fields.filter(
    (f) => f.state === "needs_review",
  ).length;
  const openTasks = tasks.filter((t) => t.status !== "done");
  const unresolvedThreads = threads.filter((t) => !t.resolved);

  return (
    <div className="stack">
      <div className="flex justify-between items-start">
        <div>
          <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>
            {client?.name}: {ret.taxYear} {ret.formType}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted">
            <StatusPill state={ret.stage} />
            {ret.estimatedRefundOrDue && (
              <span>
                Estimated{" "}
                {ret.estimatedRefundOrDue.direction === "refund"
                  ? "refund"
                  : "amount due"}
                :{" "}
                <strong className="mono">
                  ${ret.estimatedRefundOrDue.amount.toLocaleString()}
                </strong>
              </span>
            )}
          </div>
        </div>
        {!isClientView && (
          <div className="flex gap-2">
            <Link
              to="/messages"
              className="btn btn-sm"
              style={{ textDecoration: "none" }}
            >
              Message client
            </Link>
            <button className="btn btn-primary btn-sm">Move to review</button>
          </div>
        )}
      </div>

      {ret.blockers.length > 0 && (
        <div
          className="card card-pad"
          style={{
            background: "var(--blocking-bg)",
            borderColor: "var(--blocking-border)",
          }}
        >
          <div
            className="section-title"
            style={{ color: "var(--blocking)", margin: "0 0 6px" }}
          >
            {isClientView
              ? "We need a couple things from you"
              : "Blocking this return"}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
            {ret.blockers.map((b, i) => (
              <li key={i} style={{ marginBottom: 2 }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isClientView && aiRecs.length > 0 && (
        <div>
          <div className="section-title">
            AI recommendations for this return
          </div>
          <div className="stack" style={{ marginTop: 0 }}>
            {aiRecs.map((rec) => (
              <button
                key={rec.id}
                onClick={() =>
                  openDrawer({ kind: "ai-recommendation", id: rec.id })
                }
                className="card card-pad"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  borderColor: "var(--ai-border)",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className="flex items-center gap-2"
                      style={{ marginBottom: 4 }}
                    >
                      <span className="badge badge-ai">◇ AI</span>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>
                        {rec.title}
                      </span>
                    </div>
                    <div className="text-sm text-muted">{rec.summary}</div>
                  </div>
                  <span
                    className="mono text-sm text-muted"
                    style={{ flexShrink: 0, marginLeft: 12 }}
                  >
                    {(rec.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card card-pad">
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 10 }}
        >
          <div className="section-title" style={{ margin: 0 }}>
            {isClientView
              ? "Your return"
              : `Return detail (${needsReviewCount} needing review)`}
          </div>
          {!isClientView && <FieldAffordanceLegend />}
        </div>

        <div className="stack">
          {sections.map(([section, sectionFields]) => (
            <div key={section}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 8,
                  color: "var(--ink-700)",
                }}
              >
                {section}
              </div>
              <div className="stack" style={{ marginTop: 0, gap: 8 }}>
                {sectionFields
                  .filter((f) => !isClientView || f.state !== "locked")
                  .map((f) => (
                    <div
                      key={f.id}
                      className="flex justify-between items-center"
                      style={{
                        padding: "6px 0",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{f.lineLabel}</span>
                      <FieldValue field={f} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col-grid">
        <div className="card card-pad">
          <div className="section-title">Status history</div>
          <div className="stack" style={{ marginTop: 0, gap: 10 }}>
            {events.map((e) => (
              <div key={e.id} className="flex gap-2" style={{ fontSize: 12.5 }}>
                <span
                  className="text-muted mono"
                  style={{ flexShrink: 0, width: 78 }}
                >
                  {new Date(e.occurredAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {STAGE_META[e.stage]?.label ?? e.stage}
                  </div>
                  {e.note && <div className="text-muted">{e.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-title">Connected items</div>
          <div className="stack" style={{ marginTop: 0, gap: 8 }}>
            <div className="text-sm">
              <strong>{openTasks.length}</strong> open task
              {openTasks.length !== 1 ? "s" : ""}
              {openTasks.length > 0 && (
                <Link to="/tasks" style={{ marginLeft: 6 }}>
                  view →
                </Link>
              )}
            </div>
            <div className="text-sm">
              <strong>{unresolvedThreads.length}</strong> unresolved
              conversation{unresolvedThreads.length !== 1 ? "s" : ""}
              {unresolvedThreads.length > 0 && (
                <Link to="/messages" style={{ marginLeft: 6 }}>
                  view →
                </Link>
              )}
            </div>
            {!isClientView && (
              <>
                <div className="text-sm text-muted" style={{ marginTop: 6 }}>
                  Preparer: {preparer?.name ?? "Unassigned"}
                </div>
                <div className="text-sm text-muted">
                  Reviewer: {reviewer?.name ?? "Unassigned"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

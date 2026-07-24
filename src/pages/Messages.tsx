import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  THREADS,
  MESSAGES_BY_THREAD,
  USERS,
  DOCUMENTS,
  TASKS,
  RETURNS,
} from "../data";
import { useApp } from "../context/AppContext";

export function Messages() {
  const { activeRole, currentUser } = useApp();
  const isClientView =
    activeRole === "client" || activeRole === "business_owner";

  const scopedThreads = useMemo(() => {
    const myReturn = isClientView
      ? RETURNS.find((r) => r.clientId === currentUser.id)
      : undefined;
    return THREADS.filter((t) => {
      if (isClientView && t.returnId !== myReturn?.id) return false;
      return true;
    });
  }, [isClientView, currentUser.id]);

  const [activeThreadId, setActiveThreadId] = useState(scopedThreads[0]?.id);
  const activeThread =
    scopedThreads.find((t) => t.id === activeThreadId) ?? scopedThreads[0];
  const messages = activeThread
    ? MESSAGES_BY_THREAD(activeThread.id).filter(
        (m) => !isClientView || m.visibility === "client_visible",
      )
    : [];
  const linkedDoc = activeThread?.linkedDocumentId
    ? DOCUMENTS.find((d) => d.id === activeThread.linkedDocumentId)
    : undefined;
  const linkedTask = activeThread?.linkedTaskId
    ? TASKS.find((t) => t.id === activeThread.linkedTaskId)
    : undefined;

  return (
    <div className="stack">
      <div>
        <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Messages</h1>
        <p className="text-muted text-sm" style={{ margin: 0 }}>
          {isClientView
            ? "Conversations with your preparer, tied to specific documents and questions."
            : "Every thread is tied to a document, task, or field, so nothing floats free."}
        </p>
      </div>

      <div className="messages-grid" style={{ minHeight: 480 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          {scopedThreads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThreadId(t.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid var(--border)",
                background:
                  t.id === activeThread?.id ? "var(--brand-bg)" : "transparent",
                cursor: "pointer",
              }}
            >
              <div
                className="flex justify-between items-start"
                style={{ gap: 8 }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}
                >
                  {t.subject}
                </span>
                {!t.resolved && (
                  <span
                    className="dot dot-attention"
                    style={{ marginTop: 4, flexShrink: 0 }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
                {!isClientView && t.subject.startsWith("[Internal]") && (
                  <span className="badge badge-neutral">Internal</span>
                )}
                <span className="text-sm text-muted">
                  {t.resolved
                    ? "Resolved"
                    : `Waiting on ${t.ownerNextAction === "client" ? "client" : "firm"}`}
                </span>
              </div>
            </button>
          ))}
          {scopedThreads.length === 0 && (
            <div className="empty-state text-sm">No conversations yet.</div>
          )}
        </div>

        <div className="card card-pad flex-col" style={{ display: "flex" }}>
          {activeThread ? (
            <>
              <div
                className="flex justify-between items-start"
                style={{
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {activeThread.subject}
                  </div>
                  <div
                    className="flex gap-2 items-center"
                    style={{ marginTop: 6 }}
                  >
                    <span
                      className={`badge ${activeThread.resolved ? "badge-success" : "badge-attention"}`}
                    >
                      {activeThread.resolved
                        ? "Resolved"
                        : `Next action: ${activeThread.ownerNextAction === "client" ? "Client" : "Firm"}`}
                    </span>
                    {linkedDoc && (
                      <Link
                        to={`/documents/${linkedDoc.id}`}
                        className="badge badge-info"
                        style={{ textDecoration: "none" }}
                      >
                        📄 {linkedDoc.name}
                      </Link>
                    )}
                    {linkedTask && (
                      <Link
                        to="/tasks"
                        className="badge badge-neutral"
                        style={{ textDecoration: "none" }}
                      >
                        ☑ {linkedTask.title}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="stack" style={{ flex: 1, gap: 14 }}>
                {messages.map((m) => {
                  const author = USERS.find((u) => u.id === m.authorId);
                  const isMe = author?.id === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "78%",
                          padding: "10px 13px",
                          borderRadius: 10,
                          background:
                            m.visibility === "internal"
                              ? "var(--neutral-bg)"
                              : isMe
                                ? "var(--brand)"
                                : "var(--surface-sunken)",
                          color:
                            m.visibility === "internal"
                              ? "var(--ink-900)"
                              : isMe
                                ? "white"
                                : "var(--ink-900)",
                          border:
                            m.visibility === "internal"
                              ? "1px dashed var(--border-strong)"
                              : "none",
                          fontSize: 13.5,
                        }}
                      >
                        {m.body}
                      </div>
                      <div
                        className="text-sm text-muted flex items-center gap-2"
                        style={{ marginTop: 4 }}
                      >
                        <span>{author?.name}</span>
                        {m.visibility === "internal" && (
                          <span className="badge badge-neutral">
                            Internal only
                          </span>
                        )}
                        <span>
                          {new Date(m.sentAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div className="flex gap-2">
                  <input
                    placeholder={
                      isClientView
                        ? "Reply to your preparer…"
                        : "Reply (visible to client)…"
                    }
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      borderRadius: 6,
                      border: "1px solid var(--border-strong)",
                      fontSize: 13,
                    }}
                  />
                  <button className="btn btn-primary btn-sm">Send</button>
                </div>
                {!isClientView && (
                  <div className="text-sm text-muted" style={{ marginTop: 6 }}>
                    Tip: replies here are client-visible by default. Use "Add
                    internal note" to keep something firm-only.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">Select a conversation.</div>
          )}
        </div>
      </div>
    </div>
  );
}

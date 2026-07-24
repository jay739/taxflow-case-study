import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TASKS, RETURNS, USERS, DOCUMENTS } from "../data";
import { StatusPill } from "../components/StatusPill";
import { useApp } from "../context/AppContext";
import type { TaskPriority } from "../types";

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function Tasks() {
  const { activeRole, currentUser } = useApp();
  const isClientView =
    activeRole === "client" || activeRole === "business_owner";
  const [filter, setFilter] = useState<"mine" | "all">("mine");

  const scoped = useMemo(() => {
    if (isClientView) {
      const myReturn = RETURNS.find((r) => r.clientId === currentUser.id);
      return TASKS.filter((t) => t.returnId === myReturn?.id);
    }
    if (filter === "mine")
      return TASKS.filter((t) => t.assigneeId === currentUser.id);
    return TASKS;
  }, [isClientView, currentUser.id, filter]);

  const sorted = [...scoped].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });

  return (
    <div className="stack">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Tasks</h1>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            {isClientView
              ? "Anything here that says it's on you is blocking your return."
              : "Sorted by priority, and whoever owns the next action is always named."}
          </p>
        </div>
        {!isClientView && (
          <div className="flex gap-2">
            <button
              className={`btn btn-sm${filter === "mine" ? " btn-primary" : ""}`}
              onClick={() => setFilter("mine")}
            >
              My tasks
            </button>
            <button
              className={`btn btn-sm${filter === "all" ? " btn-primary" : ""}`}
              onClick={() => setFilter("all")}
            >
              All tasks
            </button>
          </div>
        )}
      </div>

      <div className="stack">
        {sorted.map((t) => {
          const ret = RETURNS.find((r) => r.id === t.returnId);
          const client = ret
            ? USERS.find((u) => u.id === ret.clientId)
            : undefined;
          const assignee = USERS.find((u) => u.id === t.assigneeId);
          const docs = DOCUMENTS.filter((d) =>
            t.linkedDocumentIds?.includes(d.id),
          );
          return (
            <div key={t.id} className="card card-pad">
              <div className="flex justify-between items-start">
                <div style={{ flex: 1 }}>
                  <div
                    className="flex items-center gap-2"
                    style={{ marginBottom: 4 }}
                  >
                    <PriorityDot priority={t.priority} />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration:
                          t.status === "done" ? "line-through" : "none",
                      }}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div
                    className="text-sm text-muted"
                    style={{ marginBottom: 8 }}
                  >
                    {t.description}
                  </div>
                  <div
                    className="flex gap-2 items-center"
                    style={{ flexWrap: "wrap" }}
                  >
                    <StatusPill state={t.status} />
                    <span
                      className={`badge ${t.ownerType === "client" ? "badge-blocking" : "badge-info"}`}
                    >
                      Owner:{" "}
                      {t.ownerType === "client"
                        ? isClientView
                          ? "You"
                          : (client?.name ?? "Client")
                        : (assignee?.name ?? "Firm")}
                    </span>
                    {!isClientView && (
                      <Link
                        to={`/returns/${t.returnId}`}
                        className="text-sm"
                        style={{ textDecoration: "none" }}
                      >
                        {client?.name}'s return →
                      </Link>
                    )}
                    {docs.map((d) => (
                      <Link
                        key={d.id}
                        to={`/documents/${d.id}`}
                        className="badge badge-neutral"
                        style={{ textDecoration: "none" }}
                      >
                        📄 {d.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {t.dueDate && (
                  <div
                    className="text-sm text-muted mono"
                    style={{ flexShrink: 0, marginLeft: 12 }}
                  >
                    Due{" "}
                    {new Date(t.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="empty-state">Nothing here right now.</div>
        )}
      </div>
    </div>
  );
}

function PriorityDot({ priority }: { priority: TaskPriority }) {
  const tone =
    priority === "urgent"
      ? "blocking"
      : priority === "high"
        ? "attention"
        : "neutral";
  return <span className={`dot dot-${tone}`} title={`Priority: ${priority}`} />;
}

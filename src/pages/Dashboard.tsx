import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  RETURNS,
  BULK_RETURNS,
  BULK_CLIENT_NAMES,
  USERS,
  STAGE_META,
  AI_RECOMMENDATIONS,
  TASKS,
} from "../data";
import { StatusPill } from "../components/StatusPill";
import { useApp } from "../context/AppContext";
import type { TaxReturn } from "../types";

// Challenge 7 solution
function priorityScore(
  r: TaxReturn,
  agingDaysMap: Map<string, number>,
): number {
  let score = 0;
  const aging = agingDaysMap.get(r.id) ?? 0;
  if (r.stage === "client_action_needed") score += 40;
  if (r.blockers.length > 0) score += r.blockers.length * 15;
  if (r.stage === "in_review") score += 20;
  score += Math.min(aging, 30);
  return score;
}

export function Dashboard() {
  const { activeRole, currentUser } = useApp();
  const [scopeFilter, setScopeFilter] = useState<"mine" | "firm">(
    activeRole === "admin" ? "firm" : "mine",
  );
  const [stageFilter, setStageFilter] = useState<string>("all");

  const allReturns = useMemo(() => [...RETURNS, ...BULK_RETURNS], []);

  const agingDaysMap = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date("2026-07-22T12:00:00Z").getTime();
    for (const r of allReturns)
      map.set(
        r.id,
        Math.floor((now - new Date(r.updatedAt).getTime()) / 86400000),
      );
    return map;
  }, [allReturns]);

  const scoped = useMemo(() => {
    let list = allReturns.filter(
      (r) => r.stage !== "filed" && r.stage !== "amended",
    );
    if (scopeFilter === "mine")
      list = list.filter(
        (r) =>
          r.assignedPreparerId === currentUser.id ||
          r.assignedReviewerId === currentUser.id,
      );
    if (stageFilter !== "all")
      list = list.filter((r) => r.stage === stageFilter);
    return list;
  }, [allReturns, scopeFilter, stageFilter, currentUser.id]);

  const ranked = useMemo(
    () =>
      [...scoped].sort(
        (a, b) =>
          priorityScore(b, agingDaysMap) - priorityScore(a, agingDaysMap),
      ),
    [scoped, agingDaysMap],
  );

  const clientName = (r: TaxReturn) =>
    USERS.find((u) => u.id === r.clientId)?.name ??
    BULK_CLIENT_NAMES[r.clientId] ??
    "Unknown client";

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of allReturns)
      if (r.stage !== "filed" && r.stage !== "amended")
        counts[r.stage] = (counts[r.stage] ?? 0) + 1;
    return counts;
  }, [allReturns]);

  const urgentCount = ranked.filter(
    (r) => priorityScore(r, agingDaysMap) >= 50,
  ).length;
  const myAiRecs = AI_RECOMMENDATIONS.filter((r) => r.status === "pending");
  const myOpenTasks = TASKS.filter(
    (t) => t.assigneeId === currentUser.id && t.status !== "done",
  );

  return (
    <div className="stack">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Dashboard</h1>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            {scoped.length} active return{scoped.length !== 1 ? "s" : ""} in
            view · {urgentCount} need attention today
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm${scopeFilter === "mine" ? " btn-primary" : ""}`}
            onClick={() => setScopeFilter("mine")}
          >
            My workload
          </button>
          <button
            className={`btn btn-sm${scopeFilter === "firm" ? " btn-primary" : ""}`}
            onClick={() => setScopeFilter("firm")}
          >
            Whole firm
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatTile
          label="Client action needed"
          value={stageCounts.client_action_needed ?? 0}
          tone="blocking"
          onClick={() => setStageFilter("client_action_needed")}
        />
        <StatTile
          label="In review"
          value={stageCounts.in_review ?? 0}
          tone="attention"
          onClick={() => setStageFilter("in_review")}
        />
        <StatTile
          label="My open tasks"
          value={myOpenTasks.length}
          tone="info"
          onClick={() => {}}
        />
        <StatTile
          label="Pending AI flags"
          value={myAiRecs.length}
          tone="ai"
          onClick={() => {}}
        />
      </div>

      <div className="filter-row items-center">
        <span className="text-sm text-muted">Filter by stage:</span>
        <button
          className={`btn btn-sm${stageFilter === "all" ? " btn-primary" : ""}`}
          onClick={() => setStageFilter("all")}
        >
          All
        </button>
        {Object.entries(stageCounts).map(([stage, count]) => (
          <button
            key={stage}
            className={`btn btn-sm${stageFilter === stage ? " btn-primary" : ""}`}
            onClick={() => setStageFilter(stage)}
          >
            {STAGE_META[stage]?.label ?? stage} ({count})
          </button>
        ))}
      </div>

      <div>
        <div className="section-title">Work queue, ranked by urgency</div>
        <div className="card table-scroll">
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th style={th}>Client</th>
                <th style={th}>Stage</th>
                <th style={th}>Why it's ranked here</th>
                <th style={th}>Last activity</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {ranked.slice(0, 25).map((r) => {
                const aging = agingDaysMap.get(r.id) ?? 0;
                const reasons: string[] = [];
                if (r.stage === "client_action_needed")
                  reasons.push("waiting on client");
                if (r.blockers.length > 0)
                  reasons.push(
                    `${r.blockers.length} blocker${r.blockers.length > 1 ? "s" : ""}`,
                  );
                if (r.stage === "in_review") reasons.push("in review queue");
                if (aging > 14) reasons.push(`stale ${aging}d`);
                return (
                  <tr
                    key={r.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={td}>
                      <strong>{clientName(r)}</strong>
                      <div className="text-muted text-sm">{r.formType}</div>
                    </td>
                    <td style={td}>
                      <StatusPill state={r.stage} />
                    </td>
                    <td style={td} className="text-sm text-muted">
                      {reasons.length > 0 ? reasons.join(" · ") : "routine"}
                    </td>
                    <td style={td} className="text-sm text-muted">
                      {aging === 0 ? "today" : `${aging}d ago`}
                    </td>
                    <td style={td}>
                      {RETURNS.some((real) => real.id === r.id) ? (
                        <Link
                          to={`/returns/${r.id}`}
                          className="btn btn-sm"
                          style={{ textDecoration: "none" }}
                        >
                          Open →
                        </Link>
                      ) : (
                        <span
                          className="text-sm text-muted"
                          title="This return doesn't have full return detail wired up in this prototype"
                        >
                          Summary only
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {ranked.length > 25 && (
          <div className="text-sm text-muted" style={{ marginTop: 8 }}>
            Showing top 25 of {ranked.length} by urgency.
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  tone,
  onClick,
}: {
  label: string;
  value: number;
  tone: "blocking" | "attention" | "info" | "ai";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card card-pad"
      style={{
        textAlign: "left",
        cursor: "pointer",
        border: "1px solid var(--border)",
      }}
    >
      <div className="text-sm text-muted" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: `var(--${tone === "blocking" ? "blocking" : tone === "attention" ? "attention" : tone === "ai" ? "ai" : "brand"})`,
        }}
      >
        {value}
      </div>
    </button>
  );
}

const th = {
  padding: "10px 16px",
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "var(--ink-500)",
  fontWeight: 700,
};
const td = { padding: "10px 16px", verticalAlign: "top" as const };

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DOCUMENTS, BULK_DOCUMENTS, RETURNS, USERS } from "../data";
import { StatusPill } from "../components/StatusPill";
import { useApp } from "../context/AppContext";
import type { DocumentStatus } from "../types";

const PAGE_SIZE = 30;

export function Documents() {
  const { activeRole, currentUser } = useApp();
  const isClientView =
    activeRole === "client" || activeRole === "business_owner";

  const allDocs = useMemo(() => [...DOCUMENTS, ...BULK_DOCUMENTS], []);
  const scopedDocs = useMemo(() => {
    if (!isClientView) return allDocs;
    const myReturn = RETURNS.find((r) => r.clientId === currentUser.id);
    return allDocs.filter((d) => d.returnId === myReturn?.id);
  }, [allDocs, isClientView, currentUser.id]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const types = useMemo(
    () => Array.from(new Set(scopedDocs.map((d) => d.type))).sort(),
    [scopedDocs],
  );

  const filtered = useMemo(() => {
    return scopedDocs.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (query && !d.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [scopedDocs, statusFilter, typeFilter, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const d of filtered) {
      if (!map.has(d.type)) map.set(d.type, []);
      map.get(d.type)!.push(d);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const paged = filtered.slice(0, page * PAGE_SIZE);
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of scopedDocs) counts[d.status] = (counts[d.status] ?? 0) + 1;
    return counts;
  }, [scopedDocs]);

  return (
    <div className="stack">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Documents</h1>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            {scopedDocs.length} document{scopedDocs.length !== 1 ? "s" : ""}
            {!isClientView ? " across all returns" : " on your return"}
          </p>
        </div>
        {isClientView && (
          <button className="btn btn-primary btn-sm">Upload document</button>
        )}
      </div>

      {/* Challenge 9 solution */}
      <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
        <button
          className={`btn btn-sm${statusFilter === "all" ? " btn-primary" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All ({scopedDocs.length})
        </button>
        {(
          [
            "needs_attention",
            "processing",
            "extracted",
            "verified",
            "uploaded",
          ] as DocumentStatus[]
        ).map((s) =>
          statusCounts[s] ? (
            <button
              key={s}
              className={`btn btn-sm${statusFilter === s ? " btn-primary" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              <StatusPillInline status={s} /> ({statusCounts[s]})
            </button>
          ) : null,
        )}
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="search"
          placeholder="Search documents by name…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid var(--border-strong)",
            fontSize: 13,
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid var(--border-strong)",
            fontSize: 13,
          }}
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {!isClientView &&
        !query &&
        typeFilter === "all" &&
        statusFilter === "all" && (
          <div>
            <div className="section-title">By document type</div>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {grouped.slice(0, 12).map(([type, docs]) => (
                <button
                  key={type}
                  className="btn btn-sm"
                  onClick={() => setTypeFilter(type)}
                >
                  {type} <span className="text-muted">({docs.length})</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
              <th style={th}>Document</th>
              <th style={th}>Type</th>
              {!isClientView && <th style={th}>Return</th>}
              <th style={th}>Status</th>
              <th style={th}>Uploaded</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((d) => {
              const ret = RETURNS.find((r) => r.id === d.returnId);
              const client = ret
                ? USERS.find((u) => u.id === ret.clientId)
                : undefined;
              return (
                <tr
                  key={d.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={td}>
                    <strong>{d.name}</strong>
                  </td>
                  <td style={td} className="text-muted">
                    {d.type}
                  </td>
                  {!isClientView && (
                    <td style={td} className="text-muted">
                      {client?.name ?? "—"}
                    </td>
                  )}
                  <td style={td}>
                    <StatusPill state={d.status} />
                  </td>
                  <td style={td} className="text-muted">
                    {new Date(d.uploadedAt).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <Link
                      to={`/documents/${d.id}`}
                      className="btn btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 32, textAlign: "center" }}
                  className="text-muted"
                >
                  No documents match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > paged.length && (
        <button
          className="btn"
          style={{ width: "fit-content" }}
          onClick={() => setPage((p) => p + 1)}
        >
          Load more ({filtered.length - paged.length} remaining)
        </button>
      )}
    </div>
  );
}

function StatusPillInline({ status }: { status: DocumentStatus }) {
  return <StatusPill state={status} />;
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

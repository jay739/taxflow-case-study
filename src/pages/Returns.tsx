import type { CSSProperties } from "react";
import { Link, Navigate } from "react-router-dom";
import { RETURNS, USERS } from "../data";
import { StatusPill } from "../components/StatusPill";
import { useApp } from "../context/AppContext";

export function Returns() {
  const { activeRole, currentUser } = useApp();

  if (activeRole === "client" || activeRole === "business_owner") {
    const myReturn =
      RETURNS.find((r) => r.clientId === currentUser.id) ?? RETURNS[0];
    return <Navigate to={`/returns/${myReturn.id}`} replace />;
  }

  const visible =
    activeRole === "seasonal_staff"
      ? RETURNS.filter((r) => r.assignedPreparerId === currentUser.id)
      : RETURNS;

  return (
    <div className="stack">
      <div>
        <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Returns</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: 13.5 }}>
          {activeRole === "seasonal_staff"
            ? "Returns assigned to you."
            : "All active returns at the firm."}
        </p>
      </div>

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
              <th style={th}>Form</th>
              <th style={th}>Stage</th>
              <th style={th}>Preparer</th>
              <th style={th}>Updated</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const client = USERS.find((u) => u.id === r.clientId);
              const preparer = USERS.find((u) => u.id === r.assignedPreparerId);
              return (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{client?.name}</div>
                    <div className="text-muted text-sm">{r.taxYear}</div>
                  </td>
                  <td style={td}>{r.formType}</td>
                  <td style={td}>
                    <StatusPill state={r.stage} />
                    {r.blockers.length > 0 && (
                      <div
                        className="text-sm"
                        style={{ color: "var(--blocking)", marginTop: 3 }}
                      >
                        {r.blockers.length} blocker
                        {r.blockers.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </td>
                  <td style={td}>{preparer?.name ?? "—"}</td>
                  <td style={td} className="text-muted">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={td}>
                    <Link
                      to={`/returns/${r.id}`}
                      className="btn btn-sm"
                      style={{ textDecoration: "none" }}
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: CSSProperties = {
  padding: "10px 16px",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--ink-500)",
  fontWeight: 700,
};
const td: CSSProperties = { padding: "10px 16px", verticalAlign: "top" };

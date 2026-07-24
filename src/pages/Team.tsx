import { USERS, RETURNS, BULK_RETURNS, ROLES } from "../data";

export function Team() {
  const staff = USERS.filter((u) =>
    u.roles.some((r) =>
      ["preparer", "reviewer", "admin", "seasonal_staff"].includes(r),
    ),
  );
  const allReturns = [...RETURNS, ...BULK_RETURNS];

  return (
    <div className="stack">
      <div>
        <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Team & Assignments</h1>
        <p className="text-muted text-sm" style={{ margin: 0 }}>
          Firm-wide workload distribution across roles.
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
              <th style={th}>Staff member</th>
              <th style={th}>Role(s)</th>
              <th style={th}>Assigned as preparer</th>
              <th style={th}>Assigned as reviewer</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((u) => {
              const asPreparer = allReturns.filter(
                (r) => r.assignedPreparerId === u.id,
              ).length;
              const asReviewer = allReturns.filter(
                (r) => r.assignedReviewerId === u.id,
              ).length;
              return (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={td}>
                    <strong>{u.name}</strong>
                    <div className="text-muted text-sm">{u.email}</div>
                  </td>
                  <td style={td}>
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className="badge badge-neutral"
                        style={{ marginRight: 4 }}
                      >
                        {ROLES.find((role) => role.id === r)?.label}
                      </span>
                    ))}
                  </td>
                  <td style={td} className="mono">
                    {asPreparer}
                  </td>
                  <td style={td} className="mono">
                    {asReviewer}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-muted">
        Admins see workload distribution firm-wide; preparers and reviewers only
        ever see their own queue on the Dashboard. This page exists to make
        reassignment decisions, not day-to-day work.
      </div>
    </div>
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

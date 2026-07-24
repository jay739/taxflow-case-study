import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  RETURNS,
  ONBOARDING_ITEMS,
  NEW_CLIENT_ID,
  NEW_CLIENT_ONBOARDING,
  TASKS_BY_RETURN,
} from "../data";
import { StatusPill } from "../components/StatusPill";

export function Home() {
  const { currentUser, activeRole } = useApp();

  if (activeRole === "client" || activeRole === "business_owner") {
    return <ClientHome clientId={currentUser.id} />;
  }
  return <StaffHome />;
}

function ClientHome({ clientId }: { clientId: string }) {
  const isBrandNewDemo = clientId === NEW_CLIENT_ID;
  const items = isBrandNewDemo
    ? NEW_CLIENT_ONBOARDING
    : ONBOARDING_ITEMS.filter(
        (i) => i.clientId === clientId || clientId === "u_client_maria",
      );
  const myReturn = RETURNS.find((r) => r.clientId === clientId) ?? RETURNS[0];
  const clientFirstName =
    clientId === "u_new_client_jordan"
      ? "Jordan"
      : currentUserFirstName(clientId);
  const tasks = TASKS_BY_RETURN(myReturn.id).filter(
    (t) => t.ownerType === "client" && t.status !== "done",
  );
  const done = items.filter((i) => i.status === "done").length;
  const total = items.length;
  const nextItem = items.find((i) => i.status !== "done");
  const isFreshStart = done === 0;

  return (
    <div className="stack" style={{ maxWidth: 720 }}>
      {isFreshStart ? (
        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>
            Welcome, let's get your {myReturn.taxYear} return started
          </h1>
          <p className="text-muted" style={{ margin: 0, fontSize: 13.5 }}>
            This should take about 10 minutes. We'll ask for a few documents and
            some basic info, and nothing else is required right now.
          </p>
        </div>
      ) : (
        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>
            Welcome back, {clientFirstName}
          </h1>
          <p className="text-muted" style={{ margin: 0, fontSize: 13.5 }}>
            Here's where things stand on your {myReturn.taxYear} return.
          </p>
        </div>
      )}

      {/* Challenge 3 solution */}
      {nextItem && (
        <Link
          to={
            nextItem.kind === "document"
              ? "/documents"
              : nextItem.kind === "questionnaire"
                ? "/tasks"
                : "/tasks"
          }
          className="card card-pad"
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            borderColor: "var(--brand)",
            borderWidth: 2,
            background: "var(--brand-bg)",
          }}
        >
          <div className="section-title" style={{ color: "var(--brand)" }}>
            Your next step
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
            {nextItem.label}
          </div>
          <div className="text-sm text-muted">
            {kindHint(nextItem.kind)}, takes about {kindEstimate(nextItem.kind)}
          </div>
          <div
            className="btn btn-primary btn-sm"
            style={{ marginTop: 10, width: "fit-content" }}
          >
            Start now →
          </div>
        </Link>
      )}

      {!isFreshStart && (
        <div className="card card-pad">
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: 10 }}
          >
            <div className="section-title" style={{ margin: 0 }}>
              Getting started ({done}/{total})
            </div>
            <StatusPill state={myReturn.stage} />
          </div>
          <div
            style={{
              height: 6,
              background: "var(--surface-sunken)",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: `${(done / total) * 100}%`,
                height: "100%",
                background: "var(--success)",
              }}
            />
          </div>
          <div className="stack" style={{ marginTop: 0 }}>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <span style={{ fontSize: 14 }}>
                  {item.status === "done"
                    ? "✓"
                    : item.status === "in_progress"
                      ? "◐"
                      : "○"}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color:
                      item.status === "done"
                        ? "var(--ink-500)"
                        : "var(--ink-900)",
                    textDecoration:
                      item.status === "done" ? "line-through" : "none",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length > 0 && (
        <div>
          <div className="section-title">Also waiting on you</div>
          <div className="stack" style={{ marginTop: 0 }}>
            {tasks.map((t) => (
              <Link
                key={t.id}
                to="/tasks"
                className="card card-pad"
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>
                    {t.title}
                  </span>
                  <StatusPill state={t.status} />
                </div>
                <div className="text-sm text-muted" style={{ marginTop: 4 }}>
                  {t.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isFreshStart && (
        <div className="text-sm text-muted">
          Once you finish these steps, this page becomes your progress tracker,
          showing what's done, what your preparer is working on, and what (if
          anything) still needs you.
        </div>
      )}
    </div>
  );
}

function currentUserFirstName(clientId: string) {
  return clientId === "u_client_maria" ? "Maria" : "there";
}
function kindHint(kind: string) {
  if (kind === "document") return "Upload a file";
  if (kind === "questionnaire") return "Answer a few questions";
  if (kind === "signature") return "Review and sign";
  return "Complete payment";
}
function kindEstimate(kind: string) {
  if (kind === "document") return "2 minutes";
  if (kind === "questionnaire") return "5 minutes";
  if (kind === "signature") return "1 minute";
  return "1 minute";
}

function StaffHome() {
  return (
    <div className="stack">
      <div>
        <h1 style={{ fontSize: 20, margin: "0 0 4px" }}>Welcome back</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: 13.5 }}>
          Head to your dashboard to see what needs attention today.
        </p>
      </div>
      <Link
        to="/dashboard"
        className="btn btn-primary"
        style={{ width: "fit-content", textDecoration: "none" }}
      >
        Go to dashboard →
      </Link>
    </div>
  );
}

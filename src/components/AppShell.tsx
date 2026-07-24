import { type ReactNode, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  USERS,
  RETURNS,
  DOCUMENTS,
  BULK_DOCUMENTS,
  BULK_RETURNS,
  BULK_CLIENT_NAMES,
} from "../data";
import { GlobalDrawer } from "./Drawer";
import type { RoleId } from "../types";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles: RoleId[];
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Home",
    icon: "⌂",
    roles: [
      "client",
      "business_owner",
      "preparer",
      "reviewer",
      "admin",
      "seasonal_staff",
    ],
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "▤",
    roles: ["preparer", "reviewer", "admin", "seasonal_staff"],
  },
  {
    to: "/returns",
    label: "My Return",
    icon: "▦",
    roles: ["client", "business_owner"],
  },
  {
    to: "/returns",
    label: "Returns",
    icon: "▦",
    roles: ["preparer", "reviewer", "admin", "seasonal_staff"],
  },
  {
    to: "/documents",
    label: "Documents",
    icon: "▧",
    roles: [
      "client",
      "business_owner",
      "preparer",
      "reviewer",
      "admin",
      "seasonal_staff",
    ],
  },
  {
    to: "/messages",
    label: "Messages",
    icon: "✉",
    roles: [
      "client",
      "business_owner",
      "preparer",
      "reviewer",
      "admin",
      "seasonal_staff",
    ],
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: "☑",
    roles: [
      "client",
      "business_owner",
      "preparer",
      "reviewer",
      "admin",
      "seasonal_staff",
    ],
  },
  { to: "/team", label: "Team & Assignments", icon: "◎", roles: ["admin"] },
];

const ROLE_LABEL: Record<RoleId, string> = {
  client: "Client",
  business_owner: "Business Owner",
  preparer: "Preparer",
  reviewer: "Reviewer",
  admin: "Firm Admin",
  seasonal_staff: "Seasonal Staff",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 900,
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

const STAFF_ROLES: RoleId[] = [
  "preparer",
  "reviewer",
  "admin",
  "seasonal_staff",
];

export function AppShell({ children }: { children: ReactNode }) {
  const { currentUser, activeRole, setCurrentUserId, setActiveRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const switchKey = `${currentUser.id}:${activeRole}`;
  const prevSwitchKey = useRef(switchKey);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (prevSwitchKey.current === switchKey) return;
    prevSwitchKey.current = switchKey;
    setSwitching(true);
    const destination = STAFF_ROLES.includes(activeRole) ? "/dashboard" : "/";
    const timer = setTimeout(() => {
      navigate(destination, { replace: true });
      setSwitching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [switchKey, activeRole, navigate]);

  const items = NAV_ITEMS.filter((item) =>
    item.roles.includes(activeRole),
  ).filter((item, idx, arr) => arr.findIndex((i) => i.to === item.to) === idx);

  const railContent = (
    <>
      <div style={{ padding: "6px 10px 18px" }}>
        <div
          style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}
        >
          Northgate
        </div>
        <div className="text-sm text-muted">Tax workspace</div>
      </div>

      <nav className="flex-col" style={{ display: "flex", gap: 2 }}>
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `nav-link${isActive && (item.to === "/" ? location.pathname === "/" : true) ? " active" : ""}`
            }
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 6,
              fontSize: 13.5,
              fontWeight: 500,
              textDecoration: "none",
              color: isActive ? "var(--brand)" : "var(--ink-700)",
              background: isActive ? "var(--brand-bg)" : "transparent",
            })}
            end={item.to === "/"}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="section-title">Switch demo account</div>
        <select
          value={currentUser.id}
          onChange={(e) => setCurrentUserId(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 6,
            border: "1px solid var(--border-strong)",
            fontSize: 12.5,
            marginBottom: 8,
            maxWidth: "100%",
          }}
        >
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}: {u.roles.map((r) => ROLE_LABEL[r]).join(" + ")}
            </option>
          ))}
        </select>
        {currentUser.roles.length > 1 && (
          <>
            <div className="section-title" style={{ marginTop: 10 }}>
              Viewing as
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {currentUser.roles.map((r) => (
                <button
                  key={r}
                  className={`btn btn-sm${activeRole === r ? " btn-primary" : ""}`}
                  onClick={() => setActiveRole(r)}
                >
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="app-shell app-shell-mobile">
        <header className="topbar mobile-topbar">
          <button
            className="btn btn-sm btn-ghost"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? "✕" : "☰"}
          </button>
          <Breadcrumbs />
          <TopBarRight />
        </header>

        {navOpen && (
          <>
            <div
              className="drawer-backdrop"
              style={{ zIndex: 30 }}
              onClick={() => setNavOpen(false)}
            />
            <aside className="rail rail-mobile-open">{railContent}</aside>
          </>
        )}

        <div className="page-body">
          {switching ? <SwitchingOverlay /> : children}
        </div>
        <GlobalDrawer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="rail">{railContent}</aside>

      <div className="main-col">
        <TopBar />
        <div className="page-body">
          {switching ? <SwitchingOverlay /> : children}
        </div>
      </div>

      <GlobalDrawer />
    </div>
  );
}

function SwitchingOverlay() {
  return (
    <div
      className="flex-col items-center justify-center"
      style={{ display: "flex", minHeight: "60vh", gap: 12 }}
    >
      <div className="spinner" aria-hidden="true" />
      <div className="text-sm text-muted">Switching view…</div>
    </div>
  );
}

function TopBarRight() {
  const { currentUser, activeRole, navHistory } = useApp();
  return (
    <div
      style={{ marginLeft: "auto" }}
      className="flex items-center gap-3 topbar-right"
    >
      {navHistory.length > 0 && (
        <div
          className="text-sm text-muted topbar-history"
          title="Recently visited"
        >
          ← {navHistory[navHistory.length - 1]}
        </div>
      )}
      <span className="badge badge-neutral">{ROLE_LABEL[activeRole]}</span>
      <div
        title={currentUser.email}
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "var(--brand-bg)",
          color: "var(--brand)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {currentUser.initials}
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="topbar">
      <Breadcrumbs />
      <TopBarRight />
    </header>
  );
}

function resolveEntityLabel(
  parentSegment: string | undefined,
  segment: string,
): string {
  if (parentSegment === "returns") {
    const ret =
      RETURNS.find((r) => r.id === segment) ??
      BULK_RETURNS.find((r) => r.id === segment);
    if (ret) {
      const client = USERS.find((u) => u.id === ret.clientId);
      return `${client?.name ?? BULK_CLIENT_NAMES[ret.clientId] ?? "Unknown"}: ${ret.taxYear}`;
    }
  }
  if (parentSegment === "documents") {
    const doc =
      DOCUMENTS.find((d) => d.id === segment) ??
      BULK_DOCUMENTS.find((d) => d.id === segment);
    if (doc) return doc.name;
  }
  return decodeURIComponent(segment);
}

const CRUMB_LABELS: Record<string, string> = {
  "": "Home",
  dashboard: "Dashboard",
  returns: "Returns",
  documents: "Documents",
  messages: "Messages",
  tasks: "Tasks",
  team: "Team & Assignments",
  onboarding: "Getting started",
};

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length === 0) {
    return <span style={{ fontWeight: 600, fontSize: 13.5 }}>Home</span>;
  }
  let acc = "";
  return (
    <nav
      className="flex items-center gap-2"
      style={{ fontSize: 13 }}
      aria-label="Breadcrumb"
    >
      <Link to="/" className="text-muted" style={{ textDecoration: "none" }}>
        Home
      </Link>
      {parts.map((p, i) => {
        acc += "/" + p;
        const label = CRUMB_LABELS[p] ?? resolveEntityLabel(parts[i - 1], p);
        const isLast = i === parts.length - 1;
        return (
          <span key={acc} className="flex items-center gap-2">
            <span className="text-muted">/</span>
            {isLast ? (
              <span style={{ fontWeight: 600 }}>{label}</span>
            ) : (
              <Link
                to={acc}
                className="text-muted"
                style={{ textDecoration: "none" }}
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

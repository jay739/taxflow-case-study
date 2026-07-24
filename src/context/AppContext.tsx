import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RoleId, UserAccount } from "../types";
import { USERS } from "../data";

// Challenge 1 + 4 + 10 solution
export interface DrawerRequest {
  kind: "field-trace" | "document" | "object-connections" | "ai-recommendation";
  id: string;
  returnId?: string;
}

interface AppContextValue {
  currentUser: UserAccount;
  activeRole: RoleId;
  setCurrentUserId: (id: string) => void;
  setActiveRole: (role: RoleId) => void;
  drawer: DrawerRequest | null;
  openDrawer: (req: DrawerRequest) => void;
  closeDrawer: () => void;
  navHistory: string[];
  pushHistory: (label: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string>("u_client_maria");
  const currentUser = useMemo(
    () => USERS.find((u) => u.id === currentUserId) ?? USERS[0],
    [currentUserId],
  );
  const [activeRole, setActiveRoleState] = useState<RoleId>(
    currentUser.roles[0],
  );
  const [drawer, setDrawer] = useState<DrawerRequest | null>(null);
  const [navHistory, setNavHistory] = useState<string[]>([]);

  function handleSetCurrentUserId(id: string) {
    setCurrentUserId(id);
    const user = USERS.find((u) => u.id === id);
    if (user) setActiveRoleState(user.roles[0]);
    setDrawer(null);
  }

  function setActiveRole(role: RoleId) {
    setActiveRoleState(role);
  }

  function openDrawer(req: DrawerRequest) {
    setDrawer(req);
  }

  function closeDrawer() {
    setDrawer(null);
  }

  function pushHistory(label: string) {
    setNavHistory((h) => [...h.slice(-4), label]);
  }

  const value: AppContextValue = {
    currentUser,
    activeRole,
    setCurrentUserId: handleSetCurrentUserId,
    setActiveRole,
    drawer,
    openDrawer,
    closeDrawer,
    navHistory,
    pushHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

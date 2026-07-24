import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppShell } from "./components/AppShell";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Returns } from "./pages/Returns";
import { ReturnDetail } from "./pages/ReturnDetail";
import { Documents } from "./pages/Documents";
import { DocumentDetail } from "./pages/DocumentDetail";
import { Messages } from "./pages/Messages";
import { Tasks } from "./pages/Tasks";
import { Team } from "./pages/Team";
import "./styles/shared.css";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/returns/:id" element={<ReturnDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

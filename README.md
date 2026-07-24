# Northgate: AI Tax Platform Case Study

A working prototype covering all 10 design challenges from the case study brief, a greenfield client/CPA tax platform, built with React + TypeScript + Vite, no backend, fully mocked data.

## Running it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Use the **"Switch demo account"** dropdown in the bottom-left of the sidebar to jump between seeded users. This is the fastest way to see every challenge from a different seat.

## How the challenges map to the app

There's no separate screen per challenge. They're solved as one connected system to keep the product cohesive and avoid fragmentation. Here's where to look for each:

| #   | Challenge                    | Location & Interaction                                                                                                                                                |
| --- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Source document traceability | Any return field, click it. The right-hand drawer shows source doc, page, box label, highlighted OCR excerpt, and derivation formula. Try `/returns/ret_maria_2025`.  |
| 02  | Client & CPA collaboration   | `/messages`. Threads are tied to a document/task/field. Internal notes use a dashed border and "Internal only" badge and are completely invisible to the client role. |
| 03  | Where to start               | Switch to **Jordan Ellery: Client** (first-run account). Home page is a single next-action card, transitioning to a progress tracker once steps complete.             |
| 04  | Getting lost in the app      | Breadcrumbs resolve real entity names (not raw IDs), card badges link to connected objects, and the drawer overlay prevents losing page scroll position.              |
| 05  | Role-aware experiences       | Switch accounts to see 6 distinct nav shells. **Dana Whitfield, CPA** (`u_dana_personal`) holds two roles, Preparer and Client, with a "Viewing as" toggle.           |
| 06  | Return status & progress     | `StatusPill` (`src/components/StatusPill.tsx`) is a shared status vocabulary. Blocker labels reword automatically based on viewer role (client vs staff).             |
| 07  | Actionable dashboard         | `/dashboard` (staff roles). 240 generated returns ranked by a scoring function (`priorityScore` in `src/pages/Dashboard.tsx`), displaying ranking rationale inline.   |
| 08  | Clickable vs. editable       | `src/components/FieldValue.tsx` and `shared.css`. Consistent affordance system (border, icon, cursor) reused across fields. Violet is strictly reserved for AI data.  |
| 09  | Complexity at scale          | `/documents`. 325 generated documents with status filters, type facets, free-text search, paginated rendering (30 rows/page), and progressive filter collapse.        |
| 10  | Trustworthy AI               | AI recommendation cards on `/returns/ret_maria_2025` and in the field trace drawer. Always shows confidence %, evidence bullets, and suggested action buttons.        |

## What's real vs. simulated

**Real, working interaction logic:**

- All routing, state management, search, filtering, and pagination
- Dashboard prioritization scoring algorithm (`priorityScore()`) over 240 returns
- Role-based nav and permission-driven UI (nav items, editable-vs-locked fields, client-hidden internal notes) driven by `activeRole` in React context
- Slide-over contextual drawer system shared across traceability, document connections, and AI evidence
- Search and filter engine tested against 325 generated rows

**Fabricated / hardcoded:**

- Document OCR text (simulated plaintext snippets in `src/data/documents.ts` and `src/data/bulkDocuments.ts`)
- AI outputs (confidence scores, evidence bullets, and recommendations written by hand, including a blurry 1099 digit edge case)
- Messaging storage (threads and messages are static arrays; the send button does not write to a backend)
- Authentication (the account switcher directly sets the mock user)

**Out of scope:**

- Backend database persistence
- Real PDF rendering and OCR engine
- Real authentication / multi-tenant data isolation

## Key design decisions

- **One field-value component and one drawer everywhere.** Challenges 01, 04, 08, and 10 share `FieldValue` and `GlobalDrawer`. This keeps a 300-document return approachable without forcing full page transitions.
- **Shared status vocabulary (`StatusPill`).** Ensures consistent color and state interpretation across the Dashboard, Return Detail, and Document pages.
- **Enterprise tax visual language.** A subdued blue/gray palette that conveys trust and restraint. Violet is reserved exclusively for AI content (`--ai`).
- **Transparent ranking.** `priorityScore()` explains why a return is ranked high inline, for example "waiting on client, 2 blockers, stale 18d."
- **Dual-role edge case.** Dana Whitfield's account (`u_dana_personal`) explicitly demonstrates how one login toggles between Preparer and Client contexts.

## Project structure

```
src/
  types/        Shared domain model (ReturnField, TaxDocument, Task, Message, etc.)
  data/         Hand-written seed data (Maria Delgado's return) and bulk data generators
  context/      AppContext: active user/role, drawer state, navigation history
  components/   FieldValue, Drawer, StatusPill, AppShell
  pages/        Route handlers (Dashboard, ReturnDetail, Documents, Messages, Tasks, Team)
  styles/       Design tokens (index.css) and shared CSS utilities (shared.css)
```

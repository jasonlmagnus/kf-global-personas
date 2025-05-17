# Action Items & Outstanding Tasks

This document summarizes the key pending tasks, unimplemented features, and outstanding actions from the various planning documents. Please refer to the linked original documents for full context and details.

## 1. From `cleanup-plan.md`

Key pending cleanup tasks:

- **Data Consolidation:**
  - [x] Fully resolve usage of `src/data/personas.ts`. (Status: DONE - File deleted, API sources from /data/, components refactored.) (See: `docs/cleanup-plan.md#phase-1-data-consolidation`)
  - [ ] Ensure consistent data structure for all regions (Ongoing). (Progress: Key naming conventions partially addressed. Deeper structural consistency remains ongoing.)
- **API Handler Fixes:**
  - [~] Conduct a detailed review of `src/app/api/personas/route.ts` to ensure it properly handles global personas and correctly reads from the new data structure. (Status: PARTIALLY DONE - API now dynamically loads from /data/ and normalizePersonaData sets isGlobal=true & correct goal statement for global personas in lists. Fetching _individual_ global personas via API GET handler is still intentionally skipped.)
  - [x] Implement robust error handling for missing persona files/data within the API. (Status: DONE - Current file existence checks, null returns, console logs, and HTTP 404/500 responses in GET handler are sufficient for now.)
  - [x] Add validation for persona data structures being loaded by the API. (Status: DONE - Current normalization approach in `normalizePersonaData` which flexibly handles various data shapes and provides defaults is considered sufficient for now, rather than strict schema validation.)
        (See: `docs/cleanup-plan.md#api-handler-fixes`)
- **File Structure & Organization:**
  - [ ] Continue consolidating components into logical categories in `/src/components/`. (Progress: Sidebar.tsx identified as unused and moved to .bak. src/types/Persona.ts (singular) deleted as redundant.)
  - [ ] Continue enforcing consistent naming conventions.
        (See: `docs/cleanup-plan.md#file-structure-reorganization`)
- **Next.js App Router Cleanup:**
  - [ ] Fully review and organize the route structure.
  - [ ] Verify functionality of the `/test` page.
  - [ ] Ensure all pages use consistent layout patterns.
        (See: `docs/cleanup-plan.md#nextjs-app-router-cleanup`)
- **CSS and Styling:**
  - [ ] Organize `/src/app/globals.css` (review for purpose, duplicates, unused styles).
  - [ ] Document any custom CSS classes.
        (See: `docs/cleanup-plan.md#global-styles`)
- **Development Environment:**
  - [ ] Add pre-commit hooks for linting and formatting.
        (See: `docs/cleanup-plan.md#package-scripts`)
- **Documentation:**
  - [ ] Create a root `README.md` with clear project setup and usage instructions.
  - [ ] Continue documenting the data structure and reusable UI components.
        (See: `docs/cleanup-plan.md#documentation`)

## 2. From `DEPENDENCY-PLAN.md`

Pending dependency actions:

- **React Version Conflict:**
  - [ ] Address the React 19 vs. `cmdk` conflict. The current use of `legacy-peer-deps=true` is a temporary workaround.
  - [ ] Decide and implement one of the long-term solutions: 1. Downgrade React to v18.2.0 (Recommended in plan). 2. Update or replace `cmdk`. 3. Fork and update `cmdk`.
        (See: `docs/DEPENDENCY-PLAN.md`)

## 3. From `ui_spec.md` & `upgrade_plan.md` (Feature Development)

Key unimplemented or partially implemented features:

- **Integrate Global Persona Detail Views:**
  - [ ] Update API to allow fetching individual global personas (currently skipped).
  - [~] Ensure `PersonaPage.tsx` and related components correctly handle and display global persona data. (Status: MODIFIED - PersonaPage.tsx now actively _prevents_ generation/fetching of global persona detail pages.)
  - [~] Review and update `usePersona` hook if necessary to support individual global persona fetching without error. (Status: MODIFIED - usePersona hook now sets an error and does _not_ attempt to fetch individual global personas, preventing previous console errors.)
- **Global Header Enhancements:**
  - [ ] Integrate the actual KF Logo (currently a text placeholder).
  - [ ] Implement the "Help Button [?]" functionality.
        (See: `docs/ui_spec.md#global-header`, `docs/upgrade_plan.md#global-navigation`)
- **Advanced Sidebar Navigation:**
  - [ ] Implement collapsible sections for "Global Personas" and "Country-Specific Personas".
  - [ ] Add quick filters for persona types and roles as specified.
        (See: `docs/ui_spec.md#sidebar-navigation`, `docs/upgrade_plan.md#sidebar-navigation`)
- **Footer Implementation:**
  - [ ] Design and implement the site footer if required by the core layout.
        (See: `docs/ui_spec.md#core-layout-structure`)
- **Home Page Dashboard Features:**
  - [ ] Review and implement missing elements from the spec: Interactive World Map/Region Selector, Featured Countries, specific layout for Global/Country perspectives.
        (See: `docs/ui_spec.md#home-page-dashboard`)
- **Country Overview Page:**
  - [ ] Implement the "Country Overview Page" as specified, including country description, persona grid, and comparison links.
        (See: `docs/ui_spec.md#country-overview-page`)
- **Persona Detail Page Enhancements:**
  - [ ] Implement tabbed navigation for sections (Needs, Motivations, etc.) if not already present.
  - [ ] Ensure dynamic section rendering and visual distinction for country-specific content are fully realized.
        (See: `docs/ui_spec.md#persona-detail-page`, `docs/upgrade_plan.md#adaptive-persona-detail-pages`)
- **Full Comparison View Functionality:**
  - [ ] Develop the complete side-by-side comparison view, including highlighting differences and section navigation as per the spec.
  - [ ] Ensure `ComparisonView` component (from `upgrade_plan.md`) is created and functional.
        (See: `docs/ui_spec.md#comparison-view`, `docs/upgrade_plan.md#comparison-features`)
- **Contextual AI Assistant:**
  - [ ] Design and implement all aspects of the AI Assistant (persistent button, chat interface, context awareness, conversation management). This is a major feature group.
        (See: `docs/ui_spec.md#ai-assistant`, `docs/upgrade_plan.md#4-contextual-ai-assistant`)
- **Specific Component Creation (from `upgrade_plan.md`):**
  - [ ] Verify existence and functionality or create: `PersonaFilter`, `SectionTabNavigator`, `AIAssistantButton`, `ConversationPanel`.
        (See: `docs/upgrade_plan.md#component-structure`)
- **Responsive Design Verification:**
  - [ ] Conduct thorough testing and refinement for responsiveness across all specified breakpoints (Mobile, Tablet, Desktop).
        (See: `docs/upgrade_plan.md#responsive-design`, `docs/ui_spec.md#responsive-adaptations`)

---

This summary should help prioritize future development and cleanup efforts. Remember to update the respective plan documents and this action list as tasks are completed.

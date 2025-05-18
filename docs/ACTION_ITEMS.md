# Action Items & Outstanding Tasks

This document summarizes the key pending tasks, unimplemented features, and outstanding actions from the various planning documents. Please refer to the linked original documents for full context and details.

## 1. From `cleanup-plan.md`

Key pending cleanup tasks:

- **Data Consolidation:**
  - [x] Fully resolve usage of `src/data/personas.ts`. (Status: DONE - File deleted, API sources from /data/, components refactored.)
  - [x] Ensure consistent data structure for all regions. (Status: LARGELY DONE - JSON files now use a consistent `Role` field. `normalizePersonaData` updated to handle `Record<string, string[]>` for structured country persona fields like `Needs`, `Motivations`. Title generation logic standardized.)
- **API Handler Fixes:**
  - [x] Conduct a detailed review of `src/app/api/personas/route.ts`. (Status: DONE - Reviewed and updated multiple times, especially `normalizePersonaData` for consistent data processing, title generation, and type handling for global vs. country personas.)
  - [x] Implement robust error handling for missing persona files/data within the API. (Status: DONE - Current file existence checks, null returns, console logs, and HTTP 404/500 responses in GET handler are sufficient for now.)
  - [x] Add validation for persona data structures being loaded by the API. (Status: DONE - Normalization in `normalizePersonaData` handles various shapes and provides defaults. Type safety improved with `PersonaJsonData` interface.)
- **File Structure & Organization:**
  - [x] Continue consolidating components into logical categories in `/src/components/`. (Status: DONE - Persona-related components moved to `src/components/personas/` as per `PersonaTestRefactorPlan.md`.)
  - [x] Continue enforcing consistent naming conventions. (Status: IMPROVED - Especially in JSON `Role` field, and persona title generation. `formatDepartmentName` utility helps.)
- **Next.js App Router Cleanup:**
  - [ ] Fully review and organize the route structure.
  - [x] Verify functionality of the `/test` page. (Status: DONE - `/test` page was removed and functionality moved to `/personas`.)
  - [x] Ensure all pages use consistent layout patterns. (Status: IMPROVED - `GlobalNav` provides consistent navigation. `PersonaTest` refactor standardizes content display.)
- **CSS and Styling:**
  - [~] Organize `/src/app/globals.css` (review for purpose, duplicates, unused styles). (Status: PARTIALLY ADDRESSED - Tailwind CSS configuration resolved which was a major blocker. Specific review of `globals.css` content still pending but less critical now.)
  - [ ] Document any custom CSS classes.
  - Tailwind CSS functionality restored after significant troubleshooting. (COMPLETED)
  - Whitespace adjustments (horizontal and vertical padding/margins) made for better layout. (COMPLETED)
  - Download button visibility fixed. (COMPLETED)
- **Development Environment:**
  - [ ] Add pre-commit hooks for linting and formatting.
- **Documentation:**
  - [ ] Create a root `README.md` with clear project setup and usage instructions.
  - [x] Continue documenting the data structure and reusable UI components. (Status: IMPROVED - `PersonaTestRefactorPlan.md` updated. Types in `src/types/personas.ts` are more accurate.)

## 2. From `DEPENDENCY-PLAN.md`

Pending dependency actions:

- **React Version Conflict:**
  - [ ] Address the React 19 vs. `cmdk` conflict. The current use of `legacy-peer-deps=true` is a temporary workaround.
  - [ ] Decide and implement one of the long-term solutions: 1. Downgrade React to v18.2.0 (Recommended in plan). 2. Update or replace `cmdk`. 3. Fork and update `cmdk`.

## 3. From `ui_spec.md` & `upgrade_plan.md` (Feature Development)

Key unimplemented or partially implemented features:

- **Integrate Global Persona Detail Views:**
  - [ ] Update API to allow fetching individual global personas (currently skipped).
  - [x] Ensure `PersonaPage.tsx` and related components correctly handle and display global persona data. (Status: DONE - Refactored `PersonaTest.tsx` now handles inline display for all personas, including global, without separate detail pages or modals.)
  - [x] Review and update `usePersona` hook if necessary to support individual global persona fetching without error. (Status: DONE - Current inline display model bypasses issues with fetching individual global personas for a separate page/modal view.)
- **Global Header Enhancements:**
  - [ ] Integrate the actual KF Logo (currently a text placeholder).
  - [x] Implement the "Help Button [?]" functionality. (Status: PARTIALLY DONE - "Global Personas" title added to nav. Help button not yet implemented.)
  - [x] Page title moved into global nav bar. (COMPLETED)
  - [x] Redundant header banner removed from `PersonaTest.tsx`. (COMPLETED)
- **Advanced Sidebar Navigation:**
  - [ ] Implement collapsible sections for "Global Personas" and "Country-Specific Personas".
  - [ ] Add quick filters for persona types and roles as specified.
- **Footer Implementation:**
  - [ ] Design and implement the site footer if required by the core layout.
- **Home Page Dashboard Features:**
  - [ ] Review and implement missing elements from the spec: Interactive World Map/Region Selector, Featured Countries, specific layout for Global/Country perspectives.
- **Country Overview Page:**
  - [ ] Implement the "Country Overview Page" as specified, including country description, persona grid, and comparison links.
- **Persona Detail Page Enhancements:**
  - [ ] Implement tabbed navigation for sections (Needs, Motivations, etc.) if not already present.
  - [x] Ensure dynamic section rendering and visual distinction for country-specific content are fully realized. (Status: IMPROVED - `PersonaDetailsContent.tsx` now renders `Record<string, string[]>` for country personas, displaying subheadings and lists. JSON structures and normalization improved content display.)
  - [x] Persona Modals removed, details are now always inline. (COMPLETED)
  - [x] Persona card titles and subtitles (now removed) standardized. (COMPLETED)
  - [x] Default inline display for "Role Personas" view. (COMPLETED)
- **Full Comparison View Functionality:**
  - [ ] Develop the complete side-by-side comparison view, including highlighting differences and section navigation as per the spec.
  - [ ] Ensure `ComparisonView` component (from `upgrade_plan.md`) is created and functional.
- **Contextual AI Assistant:**
  - [ ] Design and implement all aspects of the AI Assistant (persistent button, chat interface, context awareness, conversation management). This is a major feature group.
- **Specific Component Creation (from `upgrade_plan.md`):**
  - [ ] Verify existence and functionality or create: `PersonaFilter` (exists as `PersonaSelector`), `SectionTabNavigator`, `AIAssistantButton`, `ConversationPanel`.
- **Responsive Design Verification:**
  - [ ] Conduct thorough testing and refinement for responsiveness across all specified breakpoints (Mobile, Tablet, Desktop).

---

This summary should help prioritize future development and cleanup efforts. Remember to update the respective plan documents and this action list as tasks are completed.

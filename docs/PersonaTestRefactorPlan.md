# PersonaTest.tsx Refactoring Plan

## 1. Overview

The `PersonaTest.tsx` component **was** a large, monolithic component. This refactoring plan **aimed** to break it down into smaller, more manageable, and reusable components. **This refactoring is largely complete.**

## 2. Goals

- [x] Increase modularity and separation of concerns.
- [x] Improve code readability and understanding.
- [x] Make components easier to test in isolation.
- [x] Facilitate future development and modifications.
- [x] Establish a clear and organized component structure for persona-related features.

## 3. Proposed Component Breakdown

The `PersonaTest.tsx` component **has been** refactored. It now acts as a container component, managing state and orchestrating child components.

### 3.1. `HeaderBanner.tsx`

- **Status:** COMPLETED (Extracted, then made obsolete as its functionality was integrated into `GlobalNav.tsx` and `PersonaTest.tsx` directly).
- **Responsibility:** Displays the main title/banner section of the personas page.
- **Location:** `src/components/personas/HeaderBanner.tsx` (File was created and later removed).

### 3.2. `PersonaSelector.tsx`

- **Status:** COMPLETED.
- **Responsibility:** Manages and displays the controls for filtering and selecting personas.
- **Location:** `src/components/personas/PersonaSelector.tsx`

### 3.3. `PersonaList.tsx`

- **Status:** COMPLETED.
- **Responsibility:** Renders a list or grid of summary views for multiple personas.
- **Location:** `src/components/personas/PersonaList.tsx`

### 3.4. `PersonaSummaryCard.tsx`

- **Status:** COMPLETED.
- **Responsibility:** Displays a condensed, summary view of a single persona.
- **Location:** `src/components/personas/PersonaSummaryCard.tsx`

### 3.5. `PersonaDetailView.tsx`

- **Status:** COMPLETED (Extracted, then made obsolete as modals were removed; details are now shown inline via `DetailedPersonaCard.tsx`).
- **Responsibility:** Displays the full, detailed information for a selected persona (initially as a modal).
- **Location:** `src/components/personas/PersonaDetailView.tsx` (File was created and later removed).

### 3.6. Existing Components to Relocate

- **`DetailedPersonaCard.tsx`**: **Status:** COMPLETED. Moved to `src/components/personas/DetailedPersonaCard.tsx`.
- **`PersonaDetailsContent.tsx`**: **Status:** COMPLETED. Moved to `src/components/personas/PersonaDetailsContent.tsx`.

## 4. Utility Functions

- **Status:** COMPLETED.
- **Responsibility:** Consolidate helper functions into a dedicated utility file.
- **Functions Moved:** `shouldHideRegionCode`, `getRoleImage`, `getRegionBackground`, `getRoleCardTitle`, `formatDepartmentName`.
- **Location:** `src/lib/personaUtils.ts`

## 5. Refactoring Steps (High-Level)

1.  **Create Directory:** Create the `src/components/personas/` directory. (COMPLETED)
2.  **Move Existing Components:** Relocate `DetailedPersonaCard.tsx` and `PersonaDetailsContent.tsx`. (COMPLETED)
3.  **Extract Helper Functions:** Create `src/lib/personaUtils.ts` and move relevant utility functions. (COMPLETED)
4.  **Component by Component Extraction:** (COMPLETED for all relevant components)
    - `HeaderBanner.tsx` (extracted, then removed)
    - `PersonaSelector.tsx` (extracted)
    - `PersonaList.tsx` (extracted)
    - `PersonaSummaryCard.tsx` (extracted)
    - `PersonaDetailView.tsx` (extracted, then removed)
5.  **Refine `PersonaTest.tsx`:** `PersonaTest.tsx` now serves as a container, managing state, data fetching orchestration, and rendering the layout. (COMPLETED)

## 6. State Management Considerations

- **Status:** Current approach maintained.
- `PersonaTest.tsx` uses `useState` and `useEffect` hooks, along with custom hooks (`usePersona`, `usePersonasByRegion`, `useRolePersonas`).
- State is primarily managed within `PersonaTest.tsx` and prop-drilled where necessary. This approach has remained sufficient for the current complexity.

## 7. Testing

- **Status:** Components are now more modular and thus inherently more testable in isolation.
- Each new component should be testable in isolation.
- Integration tests should ensure the components work together correctly. (Testing itself remains an ongoing development task).

This plan **has been followed**, and the refactoring of `PersonaTest.tsx` is largely complete.

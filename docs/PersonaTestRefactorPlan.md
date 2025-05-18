# PersonaTest.tsx Refactoring Plan

## 1. Overview

The `PersonaTest.tsx` component is currently a large, monolithic component responsible for displaying persona information, handling selections, and rendering various UI parts. This refactoring plan aims to break it down into smaller, more manageable, and reusable components to improve code clarity, maintainability, and testability.

## 2. Goals

- Increase modularity and separation of concerns.
- Improve code readability and understanding.
- Make components easier to test in isolation.
- Facilitate future development and modifications.
- Establish a clear and organized component structure for persona-related features.

## 3. Proposed Component Breakdown

The `PersonaTest.tsx` component will be refactored into the following main child components. The existing `PersonaTest.tsx` will act as a container component, managing state and orchestrating these child components.

### 3.1. `HeaderBanner.tsx`

- **Responsibility:** Displays the main title/banner section of the personas page. This might include a static title or dynamic content based on context (e.g., selected role/department for background images).
- **Key Logic to Extract:** UI elements related to the top banner/header section (e.g., the green bar with "Korn Ferry Global Personas" title, dynamic background image logic like `getRoleImage`, `getRegionBackground` if applicable to this specific banner).
- **Location:** `src/components/personas/HeaderBanner.tsx`

### 3.2. `PersonaSelector.tsx`

- **Responsibility:** Manages and displays the controls for filtering and selecting personas, such as dropdowns for Persona Type, Role, and Region.
- **Key Logic to Extract:** State management for selections (`selectedRegion`, `selectedDepartment`, `selectedPersonaType`, etc.), rendering of dropdown/select elements, fetching data for dropdown options (e.g., `availableRegions`, `availableDepartments` via `fetchConfig` or hooks), and callback handling for selection changes.
- **Location:** `src/components/personas/PersonaSelector.tsx`

### 3.3. `PersonaList.tsx`

- **Responsibility:** Renders a list or grid of summary views for multiple personas based on the current filters/selections.
- **Key Logic to Extract:** Mapping over the array of persona data (`personasByRegion`, `filteredPersonas`, or similar) and rendering a `PersonaSummaryCard.tsx` for each. Handles passing selection events up to the parent.
- **Location:** `src/components/personas/PersonaList.tsx`

### 3.4. `PersonaSummaryCard.tsx`

- **Responsibility:** Displays a condensed, summary view of a single persona. This component will be used by `PersonaList.tsx`.
- **Key Logic to Extract:** JSX and styling for an individual persona card as it appears in a list/grid view (e.g., title, a brief excerpt, an image/icon). Handles click events to select a persona for detailed view.
- **Location:** `src/components/personas/PersonaSummaryCard.tsx`

### 3.5. `PersonaDetailView.tsx`

- **Responsibility:** Displays the full, detailed information for a selected persona. This component will likely wrap or utilize the existing `DetailedPersonaCard.tsx` and `PersonaDetailsContent.tsx`.
- **Key Logic to Extract:** Logic for displaying the modal or dedicated view for a single selected persona. Manages the visibility of this detailed view and passes the selected persona data to `DetailedPersonaCard.tsx`.
- **Location:** `src/components/personas/PersonaDetailView.tsx`

### 3.6. Existing Components to Relocate

- **`DetailedPersonaCard.tsx`**: Currently in `src/components/`. Should be moved to `src/components/personas/DetailedPersonaCard.tsx`.
- **`PersonaDetailsContent.tsx`**: Currently in `src/components/`. Should be moved to `src/components/personas/PersonaDetailsContent.tsx`.

## 4. Utility Functions

- **Responsibility:** Consolidate helper functions currently within `PersonaTest.tsx` into a dedicated utility file.
- **Functions to Move:** `shouldHideRegionCode`, `getRoleImage` (if not part of HeaderBanner exclusively), `getRegionBackground` (if not part of HeaderBanner exclusively), `getRoleCardTitle`, and any other general utility functions related to persona data processing or display logic.
- **Location:** `src/lib/personaUtils.ts`

## 5. Refactoring Steps (High-Level)

1.  **Create Directory:** Create the `src/components/personas/` directory.
2.  **Move Existing Components:** Relocate `DetailedPersonaCard.tsx` and `PersonaDetailsContent.tsx` to the new directory and update their import paths.
3.  **Extract Helper Functions:** Create `src/lib/personaUtils.ts` and move relevant utility functions from `PersonaTest.tsx`, updating callsites.
4.  **Component by Component Extraction:**
    - Start with a relatively isolated component (e.g., `HeaderBanner.tsx` or `PersonaSelector.tsx`).
    - Create the new component file.
    - Identify and move the relevant JSX, state, props, and logic from `PersonaTest.tsx` to the new component.
    - Update `PersonaTest.tsx` to import and render the new component, passing necessary props and handling callbacks.
    - Test thoroughly after each component extraction.
    - Repeat for all new components (`PersonaList.tsx`, `PersonaSummaryCard.tsx`, `PersonaDetailView.tsx`).
5.  **Refine `PersonaTest.tsx`:** Once all child components are extracted, `PersonaTest.tsx` will serve as a container. Clean it up, ensuring its primary responsibilities are state management (if not handled by global state/context or hooks entirely), data fetching orchestration, and rendering of the layout composed of the new child components.

## 6. State Management Considerations

- Evaluate the current state management (`useState`, `useEffect` hooks in `PersonaTest.tsx`).
- Determine if state needs to be lifted to `PersonaTest.tsx` (container) to be shared between new sibling components.
- Consider if existing custom hooks (`usePersona`, `usePersonasByRegion`) adequately manage their respective state or if adjustments are needed.
- For more complex state interactions in the future, a global state management solution (like Zustand, Redux, or React Context with more structure) could be considered, but for now, prop drilling from the container or scoped hooks should suffice.

## 7. Testing

- Each new component should be testable in isolation (e.g., using React Testing Library or Storybook).
- Integration tests should ensure the components work together correctly within the refactored `PersonaTest.tsx` container.

This plan provides a structured approach to refactoring `PersonaTest.tsx`. The order of component extraction can be flexible, but tackling them one by one and testing incrementally is recommended.

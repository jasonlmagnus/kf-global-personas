# Generic Persona Viewer - Implementation Plan (Version 2)

## 1. Introduction

The goal is to evolve the existing application into a generic, multi-tenant platform, enabling rapid deployment of brand-specific persona instances.

This document outlines a revised, multi-phase plan. **The immediate focus is on repairing the application's broken state and correctly establishing the foundational theming engine.** All subsequent phases depend on the successful completion of Phase 1.

---

## 2. Phase 1: Foundational Repair & Theming Engine

**Status: ✅ Complete**

**Goal:** To repair the broken application and correctly implement a stable, theme-driven UI foundation where a central configuration file controls the look, feel, and content of shared components.

**Key Learnings Applied:** This phase is designed to correct previous failures by prioritizing the data layer (the theme config) before the view layer (the components) and verifying each filesystem change.

### Steps:

**2.1. Restore Core Context:**

- **Action:** Re-create the file `src/contexts/ThemeContext.tsx`.
- **Purpose:** This is the brain of the theming system. It will fetch the brand configuration file and use React Context to provide theme data (colors, fonts, etc.) to all other components in the application. Without this, no theming is possible.

**2.2. Restore Core Components:**

- **Action:** Re-create the file `src/components/Footer.tsx`.
- **Purpose:** This will be a generic footer component. It will be designed from the start to consume data from the `ThemeContext` to display the copyright notice and links.

**2.3. Establish the Single Source of Truth:**

- **Action:** Create the brand configuration file at `public/brands/korn-ferry/brand.config.json`.
- **Purpose:** Placing this file in the `/public` directory is critical for allowing the client-side `fetch()` call in the `ThemeContext` to access it successfully. This was a primary point of failure previously. This file will hold all brand-specific data.

**2.4. Implement the Global Layout:**

- **Action:** Modify `src/app/layout.tsx`.
- **Purpose:**
  1. Wrap the entire application in the `<ThemeProvider>` restored in step 2.1. This makes the theme available everywhere.
  2. Implement a robust "sticky footer" CSS layout to ensure the `Footer` component is always correctly positioned at the bottom of the viewport. This will be done in `globals.css` to avoid page-specific style conflicts.

**2.5. Verify Phase 1 Completion:**

- **Action:** Run the application.
- **Expected Outcome:** The application loads **without any console errors**. The hardcoded header will still be present, but for the first time, a theme-driven footer will be visible at the bottom of the page. This proves the data pipeline (`brand.config.json` -> `ThemeContext` -> `Footer`) is working.

---

## 3. Phase 2: Refactor to Generic Components

**Status: ✅ Complete**

**Goal:** Convert all hardcoded shell components to be fully generic and theme-driven.

### Steps:

**3.1. Refactor the Global Navigation:**

- **Action:** Refactor the `src/components/GlobalNav.tsx` file.
- **Purpose:** Remove all hardcoded Korn Ferry logos, titles, and navigation links. The component will be modified to use the `useTheme()` hook to pull the `logoUrl` and `navigation` array from the `ThemeContext`.

**3.2. Make Chatbot Panel Theme-Aware:**

- **Action:** Refactor `src/components/chatbot/ChatbotPanel.tsx`.
- **Purpose:** The chatbot's appearance should match the active brand. This involves:
  1. Adding a `chatbot` configuration object to `brand.config.json` for properties like `headerColor`, `userBubbleColor`, `assistantBubbleColor`, `welcomeMessage`, etc.
  2. Modifying the `ChatbotPanel` component to consume these values from the `ThemeContext`, making its styling dynamic.

**3.3. Verify Phase 2 Completion:**

- **Action:** Run the application.
- **Expected Outcome:** The header and chatbot panel will now be fully generic, displaying styling and content defined in `brand.config.json`. The application shell is now 100% controlled by the theme file.

---

## 4. Phase 3: Core Experience - Data & UI

**Status: ✅ Complete**

**Goal:** To repair the core persona viewing experience by fixing the broken data pipeline and implementing a robust, user-friendly interface for filtering and browsing personas.

**Key Learnings Applied:** This phase addressed a critical disconnect where the application was using multiple, conflicting data sources. The solution involved identifying a single source of truth (the flattened JSONs from the `vector/` directory) and refactoring the entire data pipeline to use it exclusively.

### Steps:

**3.1. Forensic Analysis & Root Cause Identification:**

- **Action:** Analyzed the end-to-end data flow from file system to UI.
- **Finding:** The application was in a half-migrated state. The API logic for fetching _all_ personas was reading from an outdated directory, causing it to send incomplete or "empty" data to the frontend. This was the root cause of the broken persona cards.

**3.2. Unify the Data Source:**

- **Action:** Copied the correct, flattened JSON files from the `vector/` directory into `public/data/`, establishing a single source of truth for all persona data.
- **Purpose:** To ensure all parts of the application consume the exact same data.

**3.3. Refactor the API Data Pipeline:**

- **Action:** Overhauled the `/api/personas` endpoint. Removed all obsolete data-fetching functions and simplified the logic to read directly and exclusively from the `/public/data` directory.
- **Purpose:** To create a single, resilient data pipeline that correctly reads and normalizes persona data from the correct source.

**3.4. Implement Rich Filtering UI:**

- **Action:** Refactored the `/personas` page to create an intuitive filtering experience.
- **Purpose:** This included implementing:
  1.  A grid view (`PersonaSummaryCard`) to display multiple results from a filter selection.
  2.  A seamless transition to a `DetailedPersonaCard` when a user clicks on a summary card.
  3.  A "Back to List" button for easy navigation.

**3.5. Verify Phase 3 Completion:**

- **Action:** Run the application.
- **Expected Outcome:** The persona viewer is now fully functional. Users can filter by role and region, see a grid of matching personas, and click to view details. The data is complete and correct because the underlying data pipeline has been fixed.

---

## 5. Future Phases (Next Steps)

With the application's core UI shell and data viewing experience now stable and complete, the next steps align with the original vision of making the platform fully manageable. As you assumed, the next stages are building the administrative interfaces.

- **Phase 4: Persona Upload & Ingestion UI:** This involves building a user interface that allows an administrator to upload raw persona documents (e.g., Word, PDF). The backend will then trigger ingestion scripts to process these documents, validate them, and convert them into the structured JSON format the application uses, saving them to the `public/data` directory.

- **Phase 5: Interactive Brand Setup UI:** This involves building the admin page that allows a user to create, update, and manage brand configurations. This UI will directly and safely modify the `brand.config.json` files, allowing for the rapid setup of new, themed instances of the persona viewer without needing to touch the code.

---

This revised plan prioritizes stability and verification. Each phase builds upon a confirmed, working foundation.

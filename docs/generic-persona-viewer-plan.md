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

## 4. Future Phases (High-Level)

- **Phase 3: Data Ingestion Pipeline:** Build the previously outlined scripts to process raw documents into the structured JSON our application uses.
- **Phase 4: Interactive Brand Setup UI:** Build the admin page that allows a user to modify the `brand.config.json` through a user-friendly web form.

---

This revised plan prioritizes stability and verification. Each phase builds upon a confirmed, working foundation.

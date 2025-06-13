# Design & Implementation Plan: Multi-Brand Configuration Editor

This document outlines the strategy for implementing a Brand Setup page that allows for the management of multiple, distinct brand configurations.

### **High-Level Goal**

To build a "Brand Setup" page at `/admin/brand-setup` that functions as an **editor for multiple brand configurations**. The user will be able to select a brand and modify its unique logo, colors, and font. The application will dynamically load a specific brand's theme.

---

### **Phase 1: Restore Multi-Brand Architecture**

This phase re-establishes the foundational multi-brand capabilities.

1.  **Restore Folder Structure**: The `public/brands/[brand-name]/` directory will be the single source of truth for all brand assets. Default configurations for "korn-ferry" and "magnus" will be created or verified.
2.  **Restore `ThemeContext` Logic**: The `ThemeContext` will be reverted to fetch a _specific_ brand's configuration from its corresponding directory (e.g., `/brands/magnus/brand.config.json`). The mechanism for determining the active brand will be reinstated.

### **Phase 2: Create a Brand-Aware API**

This phase modifies the API to handle specific brands.

1.  **Refactor API Route**: The `/api/brand/route.ts` endpoint will be modified to be brand-aware.
    - It will now accept a `name` query parameter (e.g., `?name=magnus`).
    - **GET `/api/brand?name=[brand]`**: Reads `brand.config.json` from `public/brands/[brand]/`.
    - **POST `/api/brand?name=[brand]`**: Saves the logo and settings to `public/brands/[brand]/`.

### **Phase 3: Build the Brand Editor UI**

This phase implements the user-facing editor.

1.  **Brand Selector Dropdown**: The `/admin/brand-setup` page will include a brand selector dropdown. This will be populated by listing the sub-directories within `public/brands/`.
2.  **Editor Functionality**:
    - On selecting a brand, the page will `GET` data from the API using the brand's name to populate the editor.
    - The "Save" button will `POST` the updated data back to the API, specifying the correct brand name.

### **Phase 4: Component Theming**

This phase ensures the loaded theme is applied correctly.

1.  **Apply Dynamic Styles**: Application components will use theme colors and fonts from the `ThemeContext` (e.g., `bg-primary`), replacing hard-coded values like `coral` or `blue`.
2.  **Preserve Semantic Colors**: Colors for success (green), error (red), and neutral info (gray) will remain hard-coded to maintain universal UX patterns. Structural styles will also remain unchanged.

# Generic Persona Viewer - Architecture & Implementation Plan

## 1. Introduction

The goal is to evolve the existing Korn Ferry Persona Viewer into a generic, multi-tenant platform. This will enable rapid deployment of new, brand-specific persona instances with custom styling, logos, and data, all managed through a simple configuration and data ingestion pipeline.

This document outlines a three-phase plan to achieve this vision, covering the brand theming engine, the data ingestion pipeline, and the final UI/backend integration.

---

## 2. Phase 1: Brand Configuration & Theming Engine

This phase focuses on making the UI's look and feel dynamically configurable per brand.

### 2.1. Brand Configuration (`brand.config.json`)

We will create a new directory structure to house brand-specific configurations.

```
/brands
  ├── korn-ferry/
  │   └── brand.config.json
  └── [another-brand]/
      └── brand.config.json
```

Each `brand.config.json` will be the single source of truth for a brand's visual identity:

```json
{
  "brandName": "Korn Ferry",
  "logoUrl": "/logos/korn-ferry/kf-logo-white.svg",
  "faviconUrl": "/logos/korn-ferry/favicon.ico",
  "colors": {
    "primary": "#0A523E",
    "secondary": "#FF6B00",
    "accent": "#7AB7F0",
    "text": "#1f2937",
    "background": "#f8f9fa",
    "headerText": "#FFFFFF"
  },
  "typography": {
    "fontFamily": "'Inter', sans-serif",
    "googleFontUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
  },
  "navigation": [
    { "name": "Personas", "path": "/personas" },
    { "name": "Data", "path": "/data" },
    { "name": "Content", "path": "/content" }
  ]
}
```

### 2.2. Dynamic Theming with CSS Variables

The core of the theming engine will be CSS variables. We will refactor `src/app/globals.css` to use variables derived from `brand.config.json`.

```css
/* src/app/globals.css */
:root {
  --brand-primary: #0a523e; /* Default KF Green */
  --brand-secondary: #ff6b00; /* Default KF Orange */
  --brand-text: #1f2937;
  /* ... more variables ... */
}

.btn-primary {
  background-color: var(--brand-primary);
  color: var(--brand-headerText); /* Assuming text on primary bg is light */
}

.app-header {
  background-color: var(--brand-primary);
  color: var(--brand-headerText);
}
```

### 2.3. Theme Loading and Context

- A `ThemeContext` (`src/contexts/ThemeContext.tsx`) will be created.
- On application load, this context will:
  1.  Determine the current brand (e.g., from a subdomain or URL parameter like `?brand=coca-cola`).
  2.  Fetch the corresponding `brand.config.json`.
  3.  Inject the brand's colors and font links into the document's `<head>`.
  4.  Update the CSS variables on the `:root` element dynamically.
- The `GlobalNav` component will be refactored to read the `navigation` array from this context to render its links.

---

## 3. Phase 2: Data Ingestion & Processing Pipeline

This phase focuses on automating the conversion of raw, brand-specific data into the structured JSON format required by the UI and vector store.

### 3.1. Directory Structure

A new `ingestion-scripts/` directory will be created to house the pipeline tools.

```
/ingestion-scripts
  ├── input/                # Drop raw source files here (e.g., brand-personas.docx)
  ├── output/               # Structured JSON files are generated here
  ├── schemas/
  │   └── persona.schema.json # Defines the target JSON structure
  └── process-data.js       # The core processing script
```

### 3.2. The Ingestion Script (`process-data.js`)

This Node.js script will be the heart of the pipeline.

- **Input:** It will take a source file path and a brand name as arguments (`node process-data.js --source ./input/coke.docx --brand Coca-Cola`).
- **Core Logic (LLM-Powered Extraction):**
  1.  The script will read the content of the source file (e.g., using `mammoth.js` for `.docx`).
  2.  It will read the target `persona.schema.json` to understand the desired output structure.
  3.  It will send the extracted text and the JSON schema to an LLM (e.g., GPT-4o) with a carefully engineered prompt.
- **Prompt Engineering Example:**
  > "You are a data processing assistant. Analyze the following text content from a persona document. Identify each distinct persona and extract the required information according to this JSON schema: `[persona.schema.json content]`. Ensure your output is a valid JSON array, with one object per persona. Pay close attention to extracting verbatim quotes for Goal Statements, Motivations, and Pain Points."
- **Output:** The script will save the LLM's structured JSON response into the `ingestion-scripts/output/` directory, named appropriately (e.g., `Coca-Cola_Personas.json`).

### 3.3. Vector Store Preparation

The existing `vector/sync.js` script will be adapted. After the ingestion script runs, the sync script can be pointed at the `ingestion-scripts/output/` directory to automatically split the array of personas into individual files, rename them using the `{brand}_{region}_{role}.json` convention, and place them in a brand-specific sub-directory (e.g., `vector/coca-cola/`).

---

## 4. Phase 3: UI & Backend Integration

This final phase ties the dynamic branding and data pipeline together into a cohesive user experience.

### 4.1. Brand-Aware Data Loading

- The data fetching logic (e.g., `usePersonas.ts`, `/api/personas`) will be updated to be "brand-aware." It will load persona files from the directory corresponding to the active brand (e.g., `public/data/coca-cola/`).

### 4.2. Brand-Specific Chatbot Experience

- The Chat API (`/api/chat/route.ts`) will be modified to:
  1.  Identify the current brand.
  2.  Use a brand-specific Vector Store ID (e.g., `process.env.COCA_COLA_VECTOR_STORE_ID`).
  3.  Dynamically insert the brand name into the Assistant's instructions: "You are an AI assistant specialized in Coca-Cola persona insights..."

### 4.3. Brand Switching (for Demos)

- A simple UI dropdown can be added to the main layout, allowing a user to switch between configured brands.
- Changing the selection will trigger the `ThemeContext` to reload the new `brand.config.json`, refreshing the entire application's theme and data source without a full page reload.

## 5. Conclusion

This architecture transforms the application from a single-purpose tool into a scalable, reusable, and highly flexible platform. It dramatically reduces the time and effort required to onboard new clients or brands, enabling the rapid deployment of customized persona viewers with powerful, brand-specific AI chat capabilities.

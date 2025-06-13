# Persona Ingestion Engine - Integration Plan

## 1. Overview

This document outlines the plan for integrating a new, AI-powered Persona Ingestion Engine into the existing application. The goal is to create a seamless, user-friendly workflow for administrators to generate structured persona JSON files from raw text or documents.

This plan details the full "plumbing" of the feature, from the user's entry point to the final, critical step of saving the persona file.

---

## 2. Core User Experience

The user will be guided through a three-stage wizard, managed by a central state machine within a single-page React component:

1.  **The Briefing:** The user selects a persona template (Simple/Country or Advanced/Global), provides the source text, and enters the required metadata.
2.  **The Creation:** The system provides clear visual feedback while it sends the data to an AI service to be processed and mapped to the correct schema.
3.  **The Review:** The system presents the AI-generated persona for final approval, rendered in a high-fidelity preview.

---

## 3. Frontend Integration Strategy

The new feature will be built as a series of modular React components, cleanly integrated into the existing Next.js application structure.

1.  **Entry Point:**

    - **File:** `src/components/GlobalNav.tsx`
    - **Action:** A link (`<Link href="/admin/upload">`) will be maintained in the main navigation bar, making the feature accessible from anywhere in the application.

2.  **Page & Component Structure:**

    - **New Directory (Pages):** `src/app/admin/`
    - **New Page:** `src/app/admin/upload/page.tsx`. This will serve as the host container for the wizard.
    - **New Directory (Components):** `src/components/admin/upload/`. This will house all the new UI components for the wizard.
    - **New Components:**
      - `PersonaUploadWizard.tsx`: The main, stateful parent component that controls the entire workflow.
      - `InputStage.tsx`: The form for user input.
      - `ProcessingStage.tsx`: The animated "AI is thinking" component.
      - `ReviewStage.tsx`: The final approval screen.
      - `SuccessState.tsx`: The confirmation screen after a successful save.

3.  **Integration with Existing Components:**
    - **The most critical UI integration point.** The `ReviewStage.tsx` component will **import and reuse the existing `src/components/personas/DetailedPersonaCard.tsx` component**. This ensures the preview shown to the admin is 100% identical to what end-users see, guaranteeing visual consistency.

---

## 4. Backend Integration Strategy

The frontend requires two new, secure API endpoints to handle the logic.

1.  **API Structure:**

    - **New Directory (APIs):** `src/app/api/admin/`
    - **New Endpoints:**
      - `generate-persona/route.ts`: A `POST` route to handle the AI processing.
      - `save-persona/route.ts`: A `POST` route to handle saving the final file.

2.  **AI Service Connection:**
    - The `generate-persona` endpoint will be responsible for securely communicating with the chosen LLM provider.
    - It will construct a detailed prompt, including the user's source text and the target JSON schema definition (imported from `src/types/personas.ts`), to ensure the AI returns a valid, structured object.

---

## 5. The Critical Role of the Filename

**This is a foundational concept for the entire application and must be handled with precision.**

The filename is not merely a label; it is the **primary key** that drives the core functionality of the persona browser UI. The filtering and display logic is directly derived from the filename's structure.

1.  **Filename Generation:**

    - In the **Input Stage**, the user will be required to provide two pieces of metadata: `region` and `department`.
    - When the user clicks "Save Persona" in the final step, the `save-persona` API endpoint will use this metadata to construct the filename with the strict format: **`{region}_{department}.json`**. (e.g., `aus_ceo.json`, `global_sales.json`).

2.  **Automatic UI Integration:**
    - The existing `/api/personas` endpoint is already designed to read all files from the `public/data/` directory.
    - During its normalization process, it deconstructs the filename to populate the `region` and `department` properties of the final persona object.
    - The `/personas` page then uses these properties to dynamically populate its "Role" and "Region" dropdown filters.

**Conclusion:** By programmatically enforcing this filename convention during the save process of our new ingestion engine, we ensure that every new, AI-generated persona is **automatically and seamlessly integrated** into the application's core filtering and browsing functionality without any further configuration. The connection is direct and immediate.

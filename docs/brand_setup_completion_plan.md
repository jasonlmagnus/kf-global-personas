# Brand Setup – Completion Plan

> Last updated: <!-- TODO: date will be filled automatically by author on commit -->

This document breaks down the work required to move the **Brand Setup / White-Labelling** feature from its current MVP state to a fully-featured, production-ready capability.

## 0. Framing

|                                  | Current                                 | Target                                                             |
| -------------------------------- | --------------------------------------- | ------------------------------------------------------------------ |
| Default brand shown in UI header | `Korn Ferry`                            | **Magnus** (until session user brand is known)                     |
| Editable fields in wizard        | Logo, primary colour, text colour, font | _All_ properties in `BrandConfig`                                  |
| CRUD on brands                   | Create & Update                         | Create, **Read, Update, Delete, Clone, Rename**                    |
| Instant preview                  | Only a mock "card"                      | Live preview of **full app shell** (header, footer, chatbot, etc.) |
| Validation & UX polish           | Minimal                                 | Robust validation, graceful error states                           |
| Security / RBAC                  | Page-level check                        | Route-level auth; delete/rename protected; per-brand user scoping  |
| Testing                          | Manual                                  | Unit + integration tests for API & UI                              |

## 1. Immediate Fixes (P0)

1. **Default Brand Logic**  
   • Amend `ThemeProvider` (or layout) so that _before_ the session loads, the fallback brand is **magnus** instead of `korn-ferry`.  
   • Add regression test to ensure future changes honour this.

2. **Header Title Binding**  
   • Ensure the header component pulls `theme.brandName` rather than a hard-coded string.

## 2. Feature Expansion (P1 – Wizard MVP → V1)

### 2.1 Add Missing Editable Fields

- Secondary, accent, background, headerText colours
- Favicon upload
- Navigation items (CRUD, drag-and-drop ordering)
- Footer links + copyright name
- Chatbot palette & copy

### 2.2 UI/UX Improvements

- Hot-swap theme after save (no full-page reload).
- Multi-device preview (tabs for Desktop / Tablet / Mobile).
- Inline colour contrast warnings for accessibility.

### 2.3 CRUD Operations on Brands

- **Delete** brand directory (with confirmation + soft-delete backup).
- **Clone** brand (deep copy into new slug).
- **Rename** brand (rename directory & update `brandName` field).

## 3. Hardening & Quality (P2)

### 3.1 Validation & Error Handling

- Schema validation of `BrandConfig` on both client & API (e.g. Zod).
- Reject dangerous filenames / MIME types on upload.
- Better toast notifications instead of `alert()`.

### 3.2 Security / RBAC

- Move privileged API routes (`/api/brand*`, `/api/brands`) behind server-side session role check rather than relying solely on middleware.
- Ensure BRAND_USERs can only read their own brand assets.

### 3.3 Testing

- Jest + React Testing Library for wizard components.
- API route tests with mocked file-system.
- Cypress e2e: create → edit → delete brand flow.

## 4. Stretch Enhancements (P3)

1. **Versioning & Rollback**  
   – Store every brand edit as a commit or timestamped backup.

2. **Global Search & Replace Preview**  
   – Allow admin to see how a colour or font choice affects multiple screens.

3. **Internationalisation of Brand Strings**  
   – Support multi-language brand copy.

---

## 5. Deliverables Checklist

- [ ] Default brand switched to Magnus
- [ ] Header brand name dynamically bound
- [ ] Wizard exposes all BrandConfig fields
- [ ] CRUD operations on brands complete
- [ ] Hot-swap theming without reload
- [ ] Validation & error states implemented
- [ ] RBAC tightened on API
- [ ] Tests (unit, integration, e2e) passing

---

## 6. Suggested Task Breakdown & Sequencing

1. **Task A: Default brand refactor** – 0.5 d
2. **Task B: Header component cleanup** – 0.5 d
3. **Task C: Wizard field expansion** – 2 d
4. **Task D: CRUD endpoints & UI for Delete/Clone/Rename** – 2 d
5. **Task E: Live preview across layout** – 1.5 d
6. **Task F: Validation + error UX** – 1.5 d
7. **Task G: API RBAC strengthening** – 1 d
8. **Task H: Test suite implementation** – 2 d
9. **Task I (stretch): Versioning / backups** – 1 d (optional)

_Total estimated engineering time: ~12 developer-days plus code review & QA._

---

### Next Step

Kick-off **Task A** by updating `ThemeProvider` default brand and adding unit test coverage. Commit only after verifying header now shows Magnus by default.

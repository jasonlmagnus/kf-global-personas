# Korn Ferry Personas Codebase Cleanup Plan

## Current Issues

After reviewing the project structure, I've identified several issues that need addressing:

### 1. Duplicate Data Directories

- Main data directory (`/data/`) and another in source (`/src/data/`) with different content.
- This causes confusion about the "source of truth" for persona data.

### 2. Inconsistent File Structure

- Two separate projects merged together:
  - Main Next.js application
  - Separate `UI - roles` directory that appears to be a separate Vite project

### 3. API Issues

- Multiple 404 errors for global persona requests (`GET /api/personas?region=global&department=ceo 404`)
- Error logs indicate missing files in global region:
  ```
  Error reading file at /Users/jasonryan/Documents/kfpersonas/data/global/sales/sales.json: Error: ENOENT: no such file or directory
  ```

### 4. Build/Run Issues

- Server errors with port conflicts
- Hot reloading failures requiring full reloads
- Tailwind CSS errors:
  ```
  Error: Cannot apply unknown utility class: bg-card
  Error: Cannot apply unknown utility class: text-gray-800
  Error: Cannot apply unknown utility class: text-lg
  ```

### 5. Codebase Navigation Confusion

- Multiple implementations of similar functionality
- Inconsistent file and folder naming
- Mixed content between Next.js app router and potential other frameworks

## Cleanup Plan

### Phase 1: Data Consolidation

1. **Data Directory Cleanup**

   - [x] Choose one authoritative data directory (recommend `/data/`) <!-- Status: DONE - /data/ is primary -->
   - [ ] Remove or update references in `/src/data/personas.ts` to use the main data directory <!-- Status: PENDING - src/data/personas.ts still exists and contains hardcoded data. Needs review. -->
   - [ ] Ensure consistent data structure for all regions <!-- Status: IN PROGRESS - New folder structure helps, ongoing effort. -->
   - [x] Create missing files for global personas mentioned in error logs:
     - [x] `/data/global/sales/sales.json`
     - [x] `/data/global/talent/talent.json`
     - [x] `/data/global/leadership_dev/leadership_dev.json`
     - [x] `/data/global/rewards/rewards.json`

2. **API Handler Fixes**
   - [ ] Update `/src/app/api/personas/route.ts` to properly handle global personas <!-- Status: PARTIALLY DONE - File created, needs detailed review of functionality for global personas. -->
   - [ ] Implement proper error handling for missing files with informative messages <!-- Status: PENDING - Needs code review. -->
   - [ ] Add validation for persona data structure <!-- Status: PENDING - Needs code review. -->

### Phase 2: Project Structure Cleanup

1. **Resolve Duplicate Project**

   - [x] Decide whether to keep or remove the `UI - roles` directory <!-- Status: DONE - Assumed removed as not present in root. -->
   - [x] If keeping, properly integrate it into the main application
   - [x] If removing, ensure all necessary functionality is implemented in the main app

2. **File Structure Reorganization**

   - [ ] Consolidate components into logical categories in `/src/components/` <!-- Status: IN PROGRESS - Some categorization exists (navigation/, ui/). -->
   - [ ] Create consistent naming conventions for all files and directories <!-- Status: IN PROGRESS - Ongoing effort. -->
   - [x] Remove `.DS_Store` files and add to `.gitignore` <!-- Status: DONE - .DS_Store is in .gitignore. -->
   - [x] Organize types in `/src/types/` with clear naming <!-- Status: PARTIALLY DONE - src/types/personas.ts created. -->

3. **Next.js App Router Cleanup**
   - [ ] Review and organize route structure <!-- Status: PARTIALLY DONE - [personaId] route created. -->
   - [x] Fix the `/test` page issues <!-- Status: PARTIALLY DONE - src/app/test/page.tsx created, functionality not fully verified. -->
   - [ ] Ensure all pages use consistent layout patterns <!-- Status: PARTIALLY DONE - Root layout exists. -->

### Phase 3: CSS and Styling Fixes

1. **Tailwind Configuration**

   - [x] Update `tailwind.config.js` to include missing utility classes:
     - [x] Add `bg-card`, `text-gray-800`, `text-lg` to theme <!-- Status: DONE -->
   - [x] Remove conflicting tailwind configurations if multiple exist <!-- Status: DONE - Only one primary config found. -->

2. **Global Styles**
   - [ ] Organize `/src/app/globals.css` by purpose (components, layout, utilities) <!-- Status: PENDING - Needs code review. -->
   - [ ] Remove duplicate or unused styles <!-- Status: PENDING - Needs code review. -->
   - [ ] Document custom CSS classes and their purpose <!-- Status: PENDING - Needs code review. -->

### Phase 4: Development Environment Fixes

1. **Package Scripts**

   - [x] Update `package.json` scripts to properly handle port conflicts <!-- Status: DONE -->
   - [ ] Add pre-commit hooks for linting and formatting <!-- Status: PENDING -->
   - [ ] Improve npm/yarn scripts for better developer experience <!-- Status: IN PROGRESS - Subjective, ongoing. -->

2. **Documentation**
   - [ ] Create README.md with clear setup instructions <!-- Status: PENDING - Root README.md not found. data/global/README.md exists but isn't primary. -->
   - [ ] Document data structure with examples <!-- Status: IN PROGRESS - Ongoing. -->
   - [ ] Add component documentation for reusable UI elements <!-- Status: IN PROGRESS - Ongoing. -->

## Implementation Priority

1. **Critical (Fix immediately)**

   - Fix missing persona data files causing 404 errors
   - Resolve tailwind configuration issues
   - Fix API handler for global personas

2. **High (Next phase)**

   - Consolidate data directories
   - Resolve duplicate project structure
   - Clean up file organization

3. **Medium (After core functionality)**

   - Improve development scripts
   - Enhance error handling
   - Add comprehensive documentation

4. **Low (Polish phase)**
   - Code style consistency
   - Performance optimizations
   - Add tests for critical components

## Technical Debt Considerations

- The current structure suggests rapid prototyping that evolved into a more complex application
- Multiple approaches to similar problems indicate developer changes or experimental features
- Consider a more formal architecture design document for future development

## Next Steps

1. Begin with Phase 1 to ensure core functionality works correctly
2. Communicate changes with team to avoid conflicts during cleanup
3. Create a dedicated branch for cleanup work to avoid disrupting ongoing development
4. Run thorough tests after each phase to ensure no regressions

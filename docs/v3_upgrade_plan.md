# v3 Persona Upgrade Plan

## Overview

Migrate from v1 to v3 persona structure **for Global Personas only** while maintaining architectural best practices and eliminating redundancy.

## ⚠️ **Important Scope**

**This upgrade ONLY affects Global Personas:**

- ✅ **Global Personas** (CEO, CHRO, Sales, Talent, Rewards, Leadership Dev) → v1 → v3 upgrade
- 🔄 **Regional Personas** (AUS, UK, UAE) → No changes, continue using standard template

## Current State

- **Main Interface**: Uses v1 global personas (`ceo.json`) from `data/` directory via API
- **Experimental View**: Uses v3 global personas (`ceo_v3.json`) from `public/` directory via direct fetch
- **Regional Personas**: Continue using existing standard template (no changes needed)
- **Archived**: v2 personas have been moved to `data/archive/v2/` directory
- **Redundancy**: Two different global persona versions (v1 and v3) and serving mechanisms

## Target State

- **Unified Global Interface**: Single interface using v3 global personas
- **Consistent Architecture**: All global personas served via API from `data/` directory
- **Enhanced Structure**: v3's hierarchical organization with content implications for global personas
- **Regional Personas**: Continue unchanged with existing standard template

## Phase 1: Data Migration (Week 1)

### 1.1 Convert v1 to v3 Structure

- [ ] Create conversion script to transform existing v1 personas
- [ ] Update `data/global/*/` files from v1 to v3 format
- [ ] Preserve all existing data while enhancing structure
- [ ] Add metadata, contentImplications, and dataSource fields
- [ ] ✅ **COMPLETED**: v2 files archived to `data/archive/v2/`

### 1.2 Update API Layer

- [ ] Modify `/api/personas/route.ts` to handle v3 structure
- [ ] Update `normalizePersonaData()` function for v3 format
- [ ] Ensure backward compatibility during transition
- [ ] Add v3 validation and error handling

### 1.3 Update Type Definitions

- [ ] Enhance `src/types/personas.ts` with v3 interfaces
- [ ] Update `GlobalPersona` interface to match v3 structure
- [ ] Add new types for v3-specific fields (metadata, sections)

## Phase 2: Component Updates (Week 2)

### 2.1 Update Main Interface Components

- [ ] Modify `PersonaTest.tsx` to handle v3 structure
- [ ] Update `DetailedPersonaCard.tsx` for v3 display
- [ ] Enhance `GlobalPersonaTemplate.tsx` with v3 sections
- [ ] Add content implication displays

### 2.2 Integrate Experimental Features

- [ ] Merge expandable sections from experimental view
- [ ] Add persona selector dropdown to main interface
- [ ] Implement progress tracking and export functionality
- [ ] Preserve advanced UI features from experimental view

### 2.3 Remove Redundancy

- [ ] Remove `ExperimentalGlobalPersonaTemplate.tsx`
- [ ] Clean up experimental view logic in `PersonaTest.tsx`
- [ ] Remove v3 files from `public/data/` directory
- [ ] Update navigation to remove experimental toggle

## Phase 3: Enhancement & Testing (Week 3)

### 3.1 Enhanced Features

- [ ] Add content implication tooltips/panels
- [ ] Implement data source indicators
- [ ] Add version comparison tools
- [ ] Create persona export functionality

### 3.2 Performance Optimization

- [ ] Implement API response caching
- [ ] Add compression for large persona files
- [ ] Optimize component rendering for v3 structure
- [ ] Add loading states for complex v3 data

### 3.3 Testing & Validation

- [ ] Test all persona loading scenarios
- [ ] Validate v3 data structure integrity
- [ ] Ensure regional personas still work
- [ ] Performance testing with v3 structure

## Phase 4: Documentation & Cleanup (Week 4)

### 4.1 Update Documentation

- [ ] Update API documentation for v3 format
- [ ] Create v3 persona creation guide
- [ ] Document content implication usage
- [ ] Update README files

### 4.2 Final Cleanup

- [ ] Remove experimental view code
- [ ] Clean up unused v1 processing logic
- [ ] Archive old v1 files
- [ ] ✅ **COMPLETED**: v2 files already archived to `data/archive/v2/`
- [ ] Update deployment configurations

## Technical Decisions

### Why Keep Personas in `data/` Directory?

1. **Security**: API-level access control and validation
2. **Flexibility**: Server-side processing and transformation
3. **Performance**: Sophisticated caching and compression
4. **Analytics**: Request logging and usage tracking
5. **Future-proofing**: Easy integration with databases/external APIs

### Why Eliminate Experimental View?

1. **Redundancy**: Two interfaces serving same purpose
2. **Maintenance**: Single codebase easier to maintain
3. **User Experience**: Consistent interface for all users
4. **Feature Integration**: Merge best features into main interface

## Migration Script Example

```javascript
// scripts/migrate-v1-to-v3.js
const fs = require("fs");
const path = require("path");

function convertV1ToV3(v1Data) {
  return {
    metadata: {
      version: "3.0",
      type: "global",
      lastUpdated: new Date().toISOString().split("T")[0],
    },
    coreUnderstanding: {
      core: {
        role: v1Data.Role,
        userGoalStatement: v1Data.User_Goal_Statement,
        coreBelief: v1Data.Core_Belief,
        contentImplication: "Frame content around core role and beliefs",
      },
      responsibilities: {
        items: v1Data.Key_Responsibilities || [],
        contentImplication: "Tie assets to specific responsibilities",
      },
      knowledge: {
        items: v1Data.Knowledge_Areas || [],
        contentImplication: "Demonstrate authority in these domains",
      },
    },
    strategicValuePoints: {
      connectionOpportunities: {
        items: v1Data.Connection_Opportunities || [],
        contentImplication:
          "Use these data-backed connection points as primary themes",
      },
      motivations: {
        items: v1Data.Motivations || [],
        contentImplication: "Frame benefits in terms of these key drivers",
      },
      needs: {
        items: v1Data.Needs || [],
        contentImplication: "Address these priority challenges in content",
      },
    },
    // ... continue conversion mapping v1 flat structure to v3 hierarchy
  };
}
```

## Success Metrics

- [ ] All personas load correctly in v3 format
- [ ] No performance degradation
- [ ] Enhanced user experience with v3 features
- [ ] Reduced codebase complexity
- [ ] Improved maintainability

## Rollback Plan

- Keep v1 files as `.bak` during transition
- Maintain feature flags for quick rollback
- Monitor error rates and performance metrics
- Have database backup of current state

## Timeline

- **Week 1**: Data migration and API updates
- **Week 2**: Component updates and integration
- **Week 3**: Enhancement and testing
- **Week 4**: Documentation and cleanup

## Risk Mitigation

- Gradual rollout with feature flags
- Comprehensive testing at each phase
- Backup of all current data
- Monitoring and alerting for issues
- Clear rollback procedures

# v1 vs v3 TSX Layout Comparison

## Overview

This document outlines the key differences between the current v1 layout (`GlobalPersonaTemplate.tsx`) and the experimental v3 layout (`ExperimentalGlobalPersonaTemplate.tsx`).

## ⚠️ **Important Scope Note**

**This comparison and upgrade ONLY affects Global Personas:**

- ✅ **Global Personas** (CEO, CHRO, Sales, Talent, etc.) → v1 → v3 upgrade
- 🔄 **Regional Personas** (AUS, UK, UAE) → Continue using standard template (no changes)

The v3 structure and enhanced UX features are specifically designed for global personas used by the content marketing team.

## 🏗️ **Architectural Differences**

### **v1 Layout (Current)**

- **File**: `src/components/personas/GlobalPersonaTemplate.tsx`
- **Lines of Code**: ~255 lines
- **Complexity**: Simple, straightforward rendering
- **Data Source**: API via props (`persona: GlobalPersona`)
- **Structure**: Flat sections, all visible at once

### **v3 Layout (Experimental)**

- **File**: `src/components/personas/ExperimentalGlobalPersonaTemplate.tsx`
- **Lines of Code**: ~1,183 lines (4.6x larger)
- **Complexity**: Advanced interactive features
- **Data Source**: Direct fetch from public directory
- **Structure**: Hierarchical groups with expand/collapse

---

## 📊 **Data Structure Differences**

### **v1 Data Structure (Flat)**

```typescript
interface GlobalPersona {
  roleOverview?: string;
  goalStatement: string;
  keyResponsibilities: Array<{ Category: string; Description: string }>;
  needs: Array<{ Category: string; Description: string }>;
  motivations: string[];
  emotionalTriggers?: {
    positive: string[];
    negative: string[];
    raw?: string[];
  };
  perceptionGaps?: Array<{
    Area: string;
    Gap: string;
    Business_Impact: string;
    Opportunity: string;
  }>;
  connectionOpportunities?: Array<{
    Area: string;
    Finding: string;
    Leverage_Point: string;
  }>;
  // ... other flat fields
}
```

### **v3 Data Structure (Hierarchical)**

```typescript
interface PersonaData {
  metadata: {version: string; type: string; lastUpdated: string};
  coreUnderstanding: {
    core: {role: string; userGoalStatement: string; coreBelief: string; contentImplication: string};
    responsibilities: {items: Array<{Category: string; Description: string}>; contentImplication: string};
    knowledge: {items: string[]; contentImplication: string};
  };
  strategicValuePoints: {
    connectionOpportunities: {items: Array<{...}>; contentImplication: string};
    motivations: {items: string[]; contentImplication: string};
    needs: {items: Array<{...}>; contentImplication: string};
  };
  painPointsAndChallenges: {
    perceptionGaps: {items: Array<{...}>; contentImplication: string};
    frustrations: {items: string[]; contentImplication: string};
    emotionalTriggers: {items: Array<{...}>; contentImplication: string};
  };
  engagementApproach: {
    behaviors: {items: string[]; contentImplication: string};
    collaborationInsights: {items: string[]; contentImplication: string};
    analogies: {items: string[]; contentImplication: string};
    // ... more structured sections
  };
  supportingResources: {
    referenceSources: Array<{Category: string; Sources: string[]; URLs?: string[]}>;
  };
}
```

---

## 🎨 **UI/UX Feature Differences**

### **v1 Features (Basic)**

| Feature              | Status | Description                     |
| -------------------- | ------ | ------------------------------- |
| Static Sections      | ✅     | All sections always visible     |
| Simple Icons         | ✅     | Basic Lucide icons for sections |
| Basic Styling        | ✅     | Simple cards with borders       |
| Single Persona       | ✅     | Shows one persona via props     |
| No Interactivity     | ❌     | No expand/collapse, no controls |
| No Progress Tracking | ❌     | No indication of completion     |
| No Export            | ❌     | No export functionality         |

### **v3 Features (Advanced)**

| Feature                    | Status | Description                                     |
| -------------------------- | ------ | ----------------------------------------------- |
| **Persona Selector**       | ✅     | Dropdown to switch between personas             |
| **Expandable Groups**      | ✅     | 5 main groups with expand/collapse              |
| **Progress Bar**           | ✅     | Visual progress based on expanded sections      |
| **Expand/Collapse All**    | ✅     | Bulk controls for all sections                  |
| **Export Functionality**   | ✅     | Export persona button (UI ready)                |
| **Content Implications**   | ✅     | Green highlighted boxes with marketing guidance |
| **Data Source Indicators** | ✅     | Shows data source for research-backed items     |
| **Enhanced Styling**       | ✅     | Modern design with color coding                 |
| **Responsive Design**      | ✅     | Better mobile/tablet experience                 |
| **Loading States**         | ✅     | Proper loading and error handling               |

---

## 🎯 **Key Functional Differences**

### **1. Content Marketing Focus**

- **v1**: Generic persona display
- **v3**: Specific "Content Marketing Implications" for each section

### **2. Data Organization**

- **v1**: Flat list of sections
- **v3**: Logical groupings:
  1. **Core Understanding** (foundational info)
  2. **Strategic Value Points** (opportunities & motivations)
  3. **Pain Points & Challenges** (problems to solve)
  4. **Engagement Approach** (how to communicate)
  5. **Supporting Resources** (references & sources)

### **3. User Experience**

- **v1**: Information overload (everything visible)
- **v3**: Progressive disclosure (expand what you need)

### **4. Persona Management**

- **v1**: Single persona per page load
- **v3**: Switch between personas without page reload

---

## 🔧 **Technical Implementation Differences**

### **v1 Implementation**

```typescript
// Simple prop-based component
const GlobalPersonaTemplate: React.FC<{ persona: GlobalPersona }> = ({
  persona,
}) => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Static sections rendered directly */}
      <Section title="Goal Statement">
        <p>{persona.goalStatement}</p>
      </Section>
      {/* ... more static sections */}
    </div>
  );
};
```

### **v3 Implementation**

```typescript
// Complex state-managed component
const ExperimentalGlobalPersonaTemplate = () => {
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>("ceo");
  const [expandedGroups, setExpandedGroups] = useState({
    coreUnderstanding: false,
    strategicValuePoints: false,
    // ... more state
  });

  // Async data loading
  const loadPersonaData = async () => {
    const response = await fetch(
      `/data/global/${selectedPersona}/${selectedPersona}_v3.json`
    );
    // ... error handling and state updates
  };

  // Interactive controls
  const toggleGroup = (group) => {
    /* ... */
  };
  const expandAll = () => {
    /* ... */
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Persona selector dropdown */}
      {/* Progress bar */}
      {/* Expandable group sections */}
    </div>
  );
};
```

---

## 📈 **Content Marketing Enhancements in v3**

### **Content Implications**

Every section in v3 includes a green highlighted box with specific guidance:

```typescript
<div
  className="mt-4 p-3 rounded"
  style={{ background: GREEN_BG, borderLeft: `4px solid ${GREEN_DARK}` }}
>
  <h4 className="font-medium mb-1">Content Marketing Implication</h4>
  <p className="text-gray-800">{section.contentImplication}</p>
</div>
```

### **Data Source Attribution**

Research-backed items show their source:

```typescript
{
  item.dataSource && (
    <span className="text-xs text-gray-500 ml-2">({item.dataSource})</span>
  );
}
```

### **Structured Messaging**

v3 includes dedicated sections for:

- **Messaging Angles**: Specific communication approaches
- **Emotional Triggers**: Detailed trigger → response → implication mapping
- **Problem Solving Methods**: How the persona approaches challenges

---

## 🚀 **Migration Requirements**

### **To Upgrade v1 → v3 (Global Personas Only), Need:**

1. **Data Structure Migration**

   - Convert flat v1 JSON to hierarchical v3 structure **for global personas only**
   - Add `contentImplication` fields to all sections
   - Add `metadata` section with version info
   - **Keep regional personas unchanged** (AUS, UK, UAE use existing structure)

2. **Component Architecture**

   - Create new v3 component for global personas
   - **Keep existing standard template** for regional personas
   - Add persona selector functionality (global personas only)
   - Implement expand/collapse logic
   - Add progress tracking

3. **API Integration**

   - Update API to serve v3 structured data **for global personas**
   - **Maintain existing API** for regional personas
   - Update type definitions for global personas
   - Ensure routing logic distinguishes between global and regional

4. **UI/UX Features**
   - Implement expandable groups (global personas only)
   - Add progress bar
   - Create export functionality
   - Style content implication boxes

---

## 💡 **Recommendations**

### **Keep from v3:**

- ✅ Hierarchical data structure with content implications
- ✅ Expandable groups for better UX
- ✅ Persona selector dropdown
- ✅ Progress tracking
- ✅ Enhanced styling and responsive design

### **Simplify from v3:**

- 🔄 Move back to API-based data loading (not direct fetch)
- 🔄 Reduce component complexity where possible
- 🔄 Maintain consistent architecture with rest of app

### **Enhance beyond v3:**

- 🆕 Add search/filter functionality
- 🆕 Add comparison view between personas
- 🆕 Add bookmark/favorites for sections
- 🆕 Add print-friendly view

---

## 📋 **Summary**

The v3 experimental layout represents a **significant advancement** over v1 **for global personas**:

- **4.6x more code** but with **10x more functionality**
- **Hierarchical data structure** vs flat structure
- **Interactive UX** vs static display
- **Content marketing focus** vs generic display
- **Progressive disclosure** vs information overload

### **Scope Clarification:**

- **Global Personas**: Complete UX transformation with v3 features
- **Regional Personas**: No changes, continue with existing standard template

The upgrade from v1 to v3 is not just a data migration—it's a **complete UX transformation** that makes **global personas** more actionable for content marketing teams, while **regional personas maintain their current proven workflow**.

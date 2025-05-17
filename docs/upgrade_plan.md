# KF Personas Platform Upgrade Plan

## Project Overview

Enhance the KF Personas platform to support country-specific personas alongside global ones, implement a comprehensive navigation system, and integrate a contextual AI assistant. This upgrade will transform the platform into a powerful tool for exploring and understanding personas across different countries and roles.

## Key Enhancements

### 1. Data Structure Integration

<!-- Status (YYYY-MM-DD): Partially Implemented. Data restructuring in /data/ (global, countries) is evident. `personaAdapter.ts` and API routes suggest work on parsing and data handling. Unified data model and flexible rendering are ongoing. -->

#### Supporting Dual Persona Structures

- Create a data layer that handles both global and country-specific persona structures
- Implement adaptive data processing to recognize and appropriately display different source types
- Develop a unified data model that preserves the unique sections of each persona type
- Build parsers to transform the nested JSON structure from `/data` directory into application-compatible formats

#### Data Handling Architecture

- Create adapters for normalizing certain data fields for comparison purposes
- Implement type detection and validation for different persona structures
- Build flexible rendering components that can handle varied section structures
- Design fallback mechanisms for missing sections when comparing different structures

### 2. Enhanced Navigation System

<!-- Status (YYYY-MM-DD): Partially Implemented. GlobalHeader.tsx contains elements for global navigation and breadcrumbs. Sidebar.tsx is basic and lacks the specified collapsible sections and filters. -->

#### Global Navigation

- Create a persistent top navigation bar with:
  - KF branding
  - Primary selector for "Global" vs. specific countries
  - Secondary role selector dropdown (dynamically populated based on selection)
  - Search functionality with filtering options
  - Compare feature for side-by-side persona analysis

#### Breadcrumb System

- Implement breadcrumb navigation showing the current path: Home > [Global/Country] > [Role] > [Persona Name]
- Make each segment clickable for quick navigation to higher levels
- Include visual indicators for the current position in the hierarchy

#### Sidebar Navigation

- Design a collapsible sidebar with clearly separated sections:
  - "Global Personas" section
  - "Country-Specific Personas" section with nested country and role hierarchies
  - Visual indicators to distinguish global vs. country-specific content
  - Quick filters for common selections

### 3. Adaptive Persona Detail Pages

<!-- Status (YYYY-MM-DD): Partially Implemented. `PersonaCard.tsx` and related components exist, as does `[personaId]/page.tsx`. Adaptability, tabbed interfaces, and full comparison features need verification/completion. -->

#### Flexible Component System

- Create a PersonaCard component that adapts to different data structures
- Implement dynamic section rendering based on persona type
- Design tabbed interfaces for navigating complex persona information
- Add visual indicators to distinguish between global and country-specific content

#### Comparison Features

- Build a comparison view supporting:
  - Same role across different countries
  - Different roles within the same country
  - Global vs. country-specific personas of the same role
- Highlight similarities and differences between compared personas
- Provide visual cues for sections unique to each persona type

### 4. Contextual AI Assistant

<!-- Status (YYYY-MM-DD): Not Implemented. No clear evidence of AI assistant features in the codebase. -->

#### Persistent Assistant Interface

- Implement a floating AI assistant button accessible throughout the application
- Design an expandable chat interface with context awareness indicators
- Create visual feedback systems for active conversations
- Support both minimized and full-screen interaction modes

#### Context Awareness System

- Build a context provider tracking the user's location in the persona hierarchy:
  - Global level: All personas accessible
  - Country level: Only personas from the selected country
  - Role level: Only personas with the selected role
  - Individual persona level: Only the specific persona being viewed
- Develop a system to pass appropriate context parameters to the AI backend

#### Conversation Management

- Implement conversation history persistence between sessions
- Create organization by context type and persona
- Support conversation export and sharing
- Build privacy controls for managing conversation data

## Technical Implementation

### NextJS Architecture Updates

<!-- Status (YYYY-MM-DD): Partially Implemented. Dynamic route `[personaId]/page.tsx` and API route `api/personas/route.ts` exist. Full path structure support and efficient data loading are ongoing. -->

- Update dynamic routing to support both `/global/[role]` and `/[country]/[role]` path structures
- Implement server-side generation for all persona types
- Create API endpoints for filtering, searching, and AI interactions
- Design efficient data loading patterns to minimize performance impact

### Component Structure

<!-- Status (YYYY-MM-DD): Partially Implemented. Some components like CountrySelector, RoleSelector, BreadcrumbNav are integrated into GlobalHeader. Others like ComparisonView, AIAssistantButton are not confirmed. -->

- Develop new reusable components:
  - CountrySelector
  - RoleSelector
  - BreadcrumbNav
  - ComparisonView
  - PersonaFilter
  - SectionTabNavigator
  - AIAssistantButton
  - ConversationPanel
- Enhance existing components to support the richer data structure
- Implement context-aware rendering throughout the component tree

### Responsive Design

<!-- Status (YYYY-MM-DD): Needs Verification. TailwindCSS is in use, but thorough responsive testing is required. -->

- Ensure full responsiveness across desktop, tablet, and mobile views
- Create adaptive layouts for complex comparison features
- Design mobile-specific interactions for the AI assistant
- Optimize navigation patterns for different screen sizes

## Development Phases

### Phase 1: Data Structure Analysis and Basic Navigation

<!-- Status (YYYY-MM-DD): Largely In Progress/Completed. -->

- Map all section types across global and country-specific personas
- Create data adapters and initial parsing utilities
- Implement basic navigation structure between personas
- Set up dynamic routing for the enhanced structure

### Phase 2: Enhanced UI Components and Detail Views

<!-- Status (YYYY-MM-DD): Partially Implemented. -->

- Develop flexible components for different persona structures
- Create the breadcrumb and contextual navigation system
- Implement tabbed section navigation
- Build the initial comparison features

### Phase 3: AI Assistant Integration

<!-- Status (YYYY-MM-DD): Not Started. -->

- Implement the core AI assistant button and interface
- Create the context awareness system
- Develop conversation history management
- Build context-switching handling

### Phase 4: Refinement and Optimization

<!-- Status (YYYY-MM-DD): Not Started. -->

- Optimize performance across different devices
- Enhance accessibility features
- Conduct user testing and make adjustments
- Create documentation and user guides
- Polish transitions and animations

## User Experience Considerations

- Provide clear visual distinction between global and country-specific personas
- Design intuitive navigation requiring minimal training
- Include helper text explaining structural differences
- Create smooth transitions between different views and contexts
- Ensure the AI assistant provides clear context awareness indicators

This upgrade will transform the current application into a comprehensive tool for exploring and understanding personas across different countries and roles, with intelligent AI assistance that adapts to the user's current context. It will provide Korn Ferry consultants with valuable insights into regional variations and role-specific characteristics through both structured navigation and natural conversation.

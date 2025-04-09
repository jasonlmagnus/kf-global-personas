KF Personas Platform UI Reference Design
This document provides a detailed reference design for the enhanced KF Personas platform UI, based on the upgrade plan.
Core Layout Structure
The UI follows a consistent layout across the application:
Copy┌────────────────────────────────────────────────────────────────┐
│ Global Header (logo, navigation, search) │
├─────────┬──────────────────────────────────────────────────────┤
│ │ │
│ │ │
│ │ │
│ Sidebar │ Main Content Area │
│ │ │
│ │ │
│ │ │
├─────────┴──────────────────────────────────────────────────────┤
│ Footer │
└────────────────────────────────────────────────────────────────┘
Navigation Components
Global Header
Copy┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐ ┌──────┐ ┌──────────┐ │
│ │ Logo │ │ Global ▼ │ │ Role ▼ │ │ Search │ │ 🔍 │ │ Compare │ │
│ └─────────┘ └─────────────┘ └──────────────┘ └────────────────────┘ └──────┘ └──────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Home > Global > CEO [?] │
└────────────────────────────────────────────────────────────────────────────────────────────┘

Logo: KF branding, links to home page
Global/Country Selector: Dropdown with options for "Global" and available countries
Role Selector: Dynamically populated based on selected country/global
Search Bar: Full-text search across all personas
Compare Button: Activates comparison mode
Breadcrumbs: Shows current navigation path
Help Button [?]: Contextual help for the current view

Sidebar Navigation
Copy┌───────────────────────────┐
│ PERSPECTIVES │
├───────────────────────────┤
│ ▼ GLOBAL │
│ └─ CEO │
│ └─ CHRO │
│ └─ Sales Leader │
│ └─ Talent Leader │
│ └─ Rewards Leader │
│ └─ L&D Leader │
│ │
│ ▼ COUNTRIES │
│ ▼ UAE │
│ └─ CEO │
│ └─ CHRO │
│ └─ Sales Leader │
│ └─ Talent Leader │
│ └─ Rewards Leader │
│ └─ L&D Leader │
│ │
│ ▼ UK │
│ └─ CEO │
│ └─ CHRO │
│ └─ Sales Leader │
│ └─ Talent Leader │
│ └─ Rewards Leader │
│ └─ L&D Leader │
│ │
│ QUICK FILTERS │
├───────────────────────────┤
│ [✓] Show Global │
│ [✓] Show Country-specific │
│ │
│ ROLES: │
│ [✓] CEO │
│ [✓] CHRO │
│ [✓] Sales Leader │
│ [✓] Talent Leader │
│ [✓] Rewards Leader │
│ [✓] L&D Leader │
└───────────────────────────┘

Collapsible Sections: For Global and Country-specific personas
Visual Indicators: Current selection is highlighted
Quick Filters: Toggle visibility of different persona types
Role Filters: Show/hide specific roles

Home Page Dashboard
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ PERSONA EXPLORER │
├────────────────────────────────────────────────────────────────────────────────┤
│ │
│ GLOBAL PERSPECTIVES │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────────┐ │
│ │ CEO │ │ CHRO │ │ Sales Leader │ │ Talent Leader│ │ More... │ │
│ └──────────┘ └──────────┘ └──────────────┘ └──────────────┘ └───────────────┘ │
│ │
│ COUNTRY PERSPECTIVES │
│ │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ [Interactive World Map or Region Selector] │ │
│ │ │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ │
│ FEATURED COUNTRIES │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│ │ │ │ │ │ │ │
│ │ UAE │ │ UK │ │ GLOBAL │ │
│ │ │ │ │ │ │ │
│ └───────────┘ └───────────┘ └───────────┘ │
│ │
│ RECENTLY VIEWED │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│ │ UAE CEO │ │ Global CHRO │ │ UK Sales │ │ UAE Talent │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ │
└────────────────────────────────────────────────────────────────────────────────┘

Global Perspectives: Quick access to global persona roles
Country Selector: Visual representation of available countries
Featured Countries: Highlight specific regions
Recently Viewed: Quick access to previously visited personas

Country Overview Page
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ UAE PERSONAS │
├────────────────────────────────────────────────────────────────────────────────┤
│ │
│ COUNTRY OVERVIEW │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ The United Arab Emirates (UAE) is characterized by: │ │
│ │ • Rapid economic growth and diversification │ │
│ │ • Strong government influence on business │ │
│ │ • Emiratization priorities │ │
│ │ • Hyper-diverse workforce (>200 nationalities) │ │
│ │ • ... │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ │
│ AVAILABLE PERSONAS │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ CEO │ │ CHRO │ │ Sales Leader │ │ Talent Leader│ │ Rewards Leader│ │
│ └──────────┘ └──────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
│ ┌────────────────┐ │
│ │ L&D Leader │ │
│ └────────────────┘ │
│ │
│ COMPARE WITH │
│ ┌────────────────────┐ ┌────────────────────┐ │
│ │ Global Personas │ │ UK Personas │ │
│ └────────────────────┘ └────────────────────┘ │
│ │
└────────────────────────────────────────────────────────────────────────────────┘

Country Overview: Brief description of market characteristics
Available Personas: Grid of role personas for the country
Comparison Options: Quick links to compare with other countries

Persona Detail Page
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ UAE CEO [Compare] [Share] │
├────────────────────────────────────────────────────────────────────────────────┤
│ │
│ Goal Statement │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ "As a CEO operating in the UAE, I strive to drive substantial growth │ │
│ │ aligned with the nation's ambitious economic diversification and │ │
│ │ innovation agenda..." │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ [Needs] [Motivations] [Frustrations] [Responsibilities] [Behaviors] [More] │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│ │
│ Needs │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Strategic Growth Alignment: │ │
│ │ • Strategies to capitalize on strong UAE GDP growth (4-6% projected) │ │
│ │ and non-oil sector opportunities │ │
│ │ • Guidance on leveraging the UAE's status as a global hub for │ │
│ │ international trade and partnerships │ │
│ │ │ │
│ │ Talent Acquisition, Retention & Emiratization: │ │
│ │ • Effective strategies to attract and retain scarce senior leadership │ │
│ │ and specialized technical talent in a highly competitive market │ │
│ │ • Robust plans and support for successfully implementing Emiratization │ │
│ │ programs to meet national quotas and develop local talent │ │
│ │ ... │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ │
│ UAE Differentiation │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Direct Alignment with National Vision: │ │
│ │ CEO goals and company strategy are heavily influenced by and measured │ │
│ │ against explicit government-led economic diversification, innovation, │ │
│ │ and social goals (Emiratization). │ │
│ │ ... │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│ │
└────────────────────────────────────────────────────────────────────────────────┘

Persona Header: Role and country with action buttons
Goal Statement: Prominent display of the persona's objective
Section Tabs: Navigate between different aspects of the persona
Sectioned Content: Organized into collapsible categories
UAE Differentiation: Highlights country-specific aspects

Comparison View
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ COMPARING: UAE CEO vs GLOBAL CEO [Add Another] [Close] │
├────────────────────────────────────────────────────────────────────────────────┤
│ │
│ ┌────────────────────────────┐ ┌────────────────────────────┐ │
│ │ UAE CEO │ │ GLOBAL CEO │ │
│ └────────────────────────────┘ └────────────────────────────┘ │
│ │
│ Goal Statement │
│ ┌────────────────────────────┐ ┌────────────────────────────┐ │
│ │ "As a CEO operating in the │ │ "As a CEO, I need to drive │ │
│ │ UAE, I strive to drive │ │ sustainable growth, lead │ │
│ │ substantial growth aligned │ │ through complex market │ │
│ │ with the nation's ambitious│ │ challenges, and position │ │
│ │ economic diversification..."│ │ the organization for..." │ │
│ └────────────────────────────┘ └────────────────────────────┘ │
│ │
│ Needs │
│ ┌────────────────────────────┐ ┌────────────────────────────┐ │
│ │ Strategic Growth Alignment:│ │ Strategic Growth: │ │
│ │ • UAE GDP growth (4-6%) │ │ • Market expansion │ │
│ │ • Non-oil sector focus │ │ • Innovation pipeline │ │
│ │ • Global hub leverage │ │ • Competitive positioning │ │
│ │ │ │ │ │
│ │ Emiratization: │ │ (No equivalent section) │ │
│ │ • National quotas │ │ │ │
│ │ • Local talent development │ │ │ │
│ └────────────────────────────┘ └────────────────────────────┘ │
│ │
│ [Needs] [Motivations] [Frustrations] [Responsibilities] [Behaviors] [More ▼] │
│ │
└────────────────────────────────────────────────────────────────────────────────┘

Comparison Header: Shows which personas are being compared
Side-by-Side View: Aligned sections for easy comparison
Visual Highlights: Different colors for unique sections
Section Navigation: Tabs to view different aspects
Add Button: Option to add a third persona for comparison

AI Assistant
Minimized State
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ │
│ │
│ │
│ │
│ │
│ │
│ │
│ ┌────┐ │
│ │ AI │ │
│ └────┘ │
└────────────────────────────────────────────────────────────────────────────────┘
Expanded Chat Panel
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ │
│ │
│ │
│ ┌────────────────────────────────────┐ │
│ │ AI Assistant - UAE CEO Context │ │
│ ├────────────────────────────────────┤ │
│ │ │ │
│ │ [AI]: How can I help you understand│ │
│ │ the UAE CEO persona today? │ │
│ │ │ │
│ │ [User]: What are their biggest │ │
│ │ challenges with Emiratization? │ │
│ │ │ │
│ │ [AI]: UAE CEOs face several key │ │
│ │ challenges with Emiratization... │ │
│ │ │ │
│ │ │ │
│ │ │ │
│ │ ┌────────────────────────────────┐ │ │
│ │ │ Ask me about this persona... │ │ │
│ │ └────────────────────────────────┘ │ │
│ │ [Expand] [History] [Clear] │ │
│ └────────────────────────────────────┘ │
│ │
└────────────────────────────────────────────────────────────────────────────────┘
Full-Screen Mode
Copy┌────────────────────────────────────────────────────────────────────────────────┐
│ AI Assistant - UAE CEO Context [Minimize] [Close] │
├────────────────────────────────────────────────────────────────────────────────┤
│ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ [AI]: How can I help you understand the UAE CEO persona today? │ │
│ │ │ │
│ │ [User]: What are their biggest challenges with Emiratization? │ │
│ │ │ │
│ │ [AI]: UAE CEOs face several key challenges with Emiratization: │ │
│ │ │ │
│ │ 1. Difficulty meeting quotas due to skills mismatches │ │
│ │ 2. Higher perceived costs of Emirati talent │ │
│ │ 3. Competition from the public sector for Emirati talent │ │
│ │ 4. Retention hurdles once Emiratis are hired │ │
│ │ │ │
│ │ These challenges are compounded by the strict, increasing quotas and │ │
│ │ potential financial penalties for non-compliance. CEOs must balance │ │
│ │ these regulatory requirements with business needs and skills availability.│ │
│ │ │ │
│ │ Would you like me to elaborate on any specific aspect of these │ │
│ │ challenges? │ │
│ │ │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ │
│ Context: UAE CEO > Emiratization Challenges [Change Context] │
│ │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ Ask a follow-up question... │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ │
│ [Export Conversation] [View History] [Clear Chat] │
│ │
└────────────────────────────────────────────────────────────────────────────────┘

Context Indicator: Shows current conversation context
Chat Interface: Natural conversation with the AI
Suggested Questions: Contextual prompt ideas
Expandable Views: Three states - button, sidebar, full screen
Action Buttons: Export, history, and clear options

Responsive Adaptations
Mobile Layout - Home
Copy┌───────────────────────────┐
│ KF Personas [☰] [🔍] │
├───────────────────────────┤
│ Home > Global │
├───────────────────────────┤
│ │
│ GLOBAL PERSPECTIVES │
│ ┌────────┐ ┌────────┐ │
│ │ CEO │ │ CHRO │ │
│ └────────┘ └────────┘ │
│ ┌────────┐ ┌────────┐ │
│ │ Sales │ │ Talent │ │
│ └────────┘ └────────┘ │
│ │
│ COUNTRIES │
│ ┌────────┐ ┌────────┐ │
│ │ UAE │ │ UK │ │
│ └────────┘ └────────┘ │
│ │
│ RECENTLY VIEWED │
│ - UAE CEO │
│ - Global CHRO │
│ │
│ ┌───┐ │
│ │AI │ │
└───────────────────────────┘
Mobile Layout - Persona Detail
Copy┌───────────────────────────┐
│ KF Personas [☰] [🔍] │
├───────────────────────────┤
│ Home > UAE > CEO │
├───────────────────────────┤
│ │
│ UAE CEO │
│ │
│ Goal Statement │
│ ************\_************ │
│ ************\_************ │
│ ************\_************ │
│ │
│ [Tabs Scroll Horizontally]│
│ [Needs][Motivations][...] │
│ │
│ Needs │
│ ************\_************ │
│ • **********\_\_\_********** │
│ • **********\_\_\_********** │
│ • **********\_\_\_********** │
│ │
│ ┌───┐ │
│ │AI │ │
└───────────────────────────┘
Color System & Visual Language
Color Coding

Global Personas: Blue color scheme

Primary: #0066CC
Secondary: #E5F0FF

UAE Personas: Green color scheme

Primary: #00864E
Secondary: #E6F4EE

UK Personas: Red color scheme

Primary: #C8102E
Secondary: #F9E9EB

Visual Indicators

Global vs Country: Different icon sets and color schemes
Role Indicators: Unique icons for each role type
Context Awareness: Color-coded borders and headers based on current context
AI Assistant: Adapts colors based on current context

Component States
Navigation States

Default: Normal display
Active: Currently selected item (bold, highlighted)
Hover: Subtle highlight effect
Expanded: For dropdown or accordion components

Interactive Elements

Buttons: Default, Hover, Active, Disabled states
Form Controls: Default, Focus, Error states
Cards: Default, Hover, Selected states
AI Assistant: Minimized, Chat Panel, Full Screen states

Typography Hierarchy

Page Titles: 24px, Bold
Section Headings: 20px, Bold
Subsection Headings: 18px, Semi-bold
Card Titles: 16px, Bold
Body Text: 16px, Regular
Supporting Text: 14px, Regular
Labels/Captions: 12px, Medium

Animation Guidelines

Navigation Transitions: Smooth animations between pages (300ms)
Expanding/Collapsing: Accordion-style animations (250ms)
AI Assistant: Subtle entrance/exit animations (350ms)
Loading States: Skeleton loaders for content
Context Switches: Fade transitions between different contexts

Responsive Breakpoints

Mobile: 0-767px
Tablet: 768-1023px
Desktop: 1024px+

This UI reference design provides developers with a comprehensive guide to implement the upgraded KF Personas platform, ensuring consistent user experience across all aspects of the application while supporting the enhanced functionality outlined in the upgrade plan.

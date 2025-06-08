# Korn Ferry Global Personas

## Version History

This directory contains updated global personas based on recent research, structured for marketing and communication purposes.

### Changes from V1 (data/global_v1)

- Original personas (in global_v1) were based on older CEO interviews
- New personas are based on more recent web research
- Enhanced structure with explicit emotional triggers and messaging implications
- Reorganized into role-specific subdirectories (similar to regional personas)

## Structure

Each role has its own subdirectory:

- ceo/
- chro/
- leadership_dev/
- rewards/
- sales/
- talent/

## Emotional Triggers Format

The new personas use a structured approach for emotional triggers:

```json
"Emotional Triggers": [
  {
    "Trigger": "What causes the emotional response",
    "Emotional Response": "How the executive feels",
    "Messaging Implication": "How to craft effective messaging"
  }
]
```

This format is designed to be directly applicable for marketing communications and campaign development.

# Korn Ferry Personas Structure

This directory contains standardized persona files for various roles. All files follow a consistent JSON structure to ensure standardization across the project.

## Standard Field Order

All persona files in this directory follow this exact field order:

1. `Role` - Title of the role
2. `User_Goal_Statement` - Primary goal of the persona
3. `Core_Belief` - Fundamental belief that drives the persona

4. `Key_Responsibilities` - Primary duties and accountabilities
5. `Knowledge_Areas` - Areas of expertise and knowledge domains
6. `Needs` - Critical requirements and pain points to address
7. `Motivations` - What drives this persona in their role
8. `Frustrations` - Challenges and obstacles faced
9. `Behaviors` - Typical actions and work patterns
10. `Emotional_Triggers` - Psychological responses to specific situations
11. `Collaboration_Insights` - How to effectively work with this persona
12. `Analogies` - Metaphors that help understand the role
13. `Reference_Sources` - Resources and information sources

Some files may contain additional fields at the end of the document, but all files must maintain this core structure.

## Directory Structure

Each persona is organized in its own subdirectory:

```
data/global/
├── ceo/
│   └── ceo.json
├── chro/
│   └── chro.json
├── leadership_dev/
│   └── leadership_dev.json
├── rewards/
│   └── rewards.json
├── sales/
│   └── sales.json
└── talent/
    └── talent.json
```

## Standardization Notes

This structure was standardized in August 2023 to ensure consistency across all persona files. All fields use underscore naming convention (e.g., `Key_Responsibilities` instead of camelCase or spaces).

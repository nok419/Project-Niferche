# Project Niferche - Site Map

## Site Structure Overview

Project Niferche is organized into four main sections, each with its own navigation structure and content organization.

```
Project Niferche
├── Home
│   ├── Home Page (/)
│   ├── Announcements (/announcements)
│   ├── Introduction (/introduction)
│   └── Gallery (/gallery)
│
├── Project Niferche
│   ├── Main Page (/project-niferche/top)
│   ├── Main Story (/project-niferche/main-story)
│   │   └── Chapter View (/project-niferche/main-story/:chapterId)
│   ├── Side Story (/project-niferche/side-story)
│   │   └── Story View (/project-niferche/side-story/:storyId)
│   └── Materials (/project-niferche/materials)
│       ├── Material Detail (/project-niferche/materials/:materialId)
│       └── World Materials (/project-niferche/materials/world/:worldId)
│
├── Laboratory
│   ├── Home (/laboratory/home)
│   ├── Parallel (/laboratory/parallel)
│   │   └── Section View (/laboratory/parallel/:section)
│   ├── LCB (/laboratory/lcb)
│   │   └── Section View (/laboratory/lcb/:section)
│   └── Experiments
│       ├── Overview (/laboratory/experiments)
│       ├── Game (/laboratory/experiments/game)
│       └── Interactive (/laboratory/experiments/interactive)
│
└── Demo
    └── World Navigation Demo (/demo/world-navigation)
```

## World-Based Navigation

The site features a unique "world-based" navigation system that organizes content into conceptual worlds:

### Worlds
1. **Hodemei** - First world context
2. **Quxe** - Second world context
3. **Alsarejia** - Third world context
4. **Laboratory** - Experimental section
5. **Common** - Shared/general content

Each world has its own navigation items, styling, and content organization. The WorldNavigation component allows users to navigate between these conceptual spaces.

## Navigation Hierarchy

### Main Navigation
The primary navigation system is implemented in NavigationSystem.tsx and supports:
- Sidebar navigation
- Tab navigation
- Dropdown navigation
- Mobile-responsive collapsible states

### Section-Specific Navigation
Each major section has its own navigation items and structure:

#### Home Navigation
- Home
- Announcements
- Introduction
- Gallery

#### Project Niferche Navigation
- Top
- Main Story (with chapter navigation)
- Side Story (with story listing)
- Materials (with world-based filtering)

#### Laboratory Navigation
- Home
- Parallel (with section navigation)
- LCB (with section navigation)
- Experiments
  - Game
  - Interactive

#### Demo Navigation
- World Navigation Demo

## Page Content Structure

### Home Section
- **Home Page**: Main landing page with overview
- **Announcements**: Updates and news
- **Introduction**: Project introduction and about section
- **Gallery**: Visual gallery with images and media

### Project Niferche Section
- **Main Page**: Overview of Project Niferche
- **Main Story**: Primary narrative content
  - Organized by chapters
  - Supports sequential navigation
- **Side Story**: Supplementary narratives
  - List view of available stories
  - Detail view for individual stories
- **Materials**: Reference materials and world-building content
  - Organized by world contexts
  - Individual material details

### Laboratory Section
- **Home**: Laboratory section overview
- **Parallel**: Content organized in parallel sections
- **LCB**: Linear content blocks section
- **Experiments**: Interactive experimental features
  - Game: Interactive game experience
  - Interactive: Other interactive elements

### Demo Section
- **World Navigation Demo**: Demonstration of the world navigation system

## Special Navigation Features

1. **World Context Awareness**: Navigation adapts based on the current "world" context
2. **Cross-World Navigation**: Intelligent handling of navigation between worlds
3. **Responsive Modes**: Navigation adapts to different screen sizes
4. **Display Variants**: Multiple display modes (icons, cards, tabs) for navigation elements

## Content Display Systems

1. **ContentReader**: For displaying formatted text content
2. **UniversalCard**: For displaying card-based content in various layouts
3. **Gallery Display**: For visual content organization

## User Flow Patterns

### Primary User Flows
1. **Home → Introduction → Project Niferche**: First-time user orientation
2. **Project Niferche Main → Main Story → Chapters**: Story-focused exploration
3. **Project Niferche Main → Materials → World**: World-building exploration
4. **Laboratory Home → Experiments**: Interactive exploration

### Secondary User Flows
1. **Cross-world navigation** via the WorldNavigation component
2. **Content detail exploration** through individual detail pages
3. **Gallery browsing** for visual content
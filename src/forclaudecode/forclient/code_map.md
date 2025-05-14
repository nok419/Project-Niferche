# Project Niferche - Code Map

## Project Overview
Project Niferche is a React-based web application utilizing TypeScript, Vite, and AWS Amplify for backend services.

## Dependencies
- React 18.2.0
- React Router DOM 6.20.0
- AWS Amplify 6.0.0
- TypeScript 5.2.2
- Vite 5.0.0

## Directory Structure

### Root Structure
```
/Project-Niferche/
├── src/                    # Main source code
│   ├── assets/             # Images, static assets
│   ├── components/         # Reusable UI components
│   ├── core/               # Core functionality and shared components
│   ├── forclaudecode/      # Documentation and specifications
│   ├── layout/             # Layout components and systems
│   ├── oldset/             # Legacy code (preserved but not actively used)
│   ├── pages/              # Page components organized by sections
│   ├── styles/             # Global CSS styles
│   ├── test/               # Test files and documentation
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static files served directly
├── amplify/                # AWS Amplify configuration
└── various config files    # TypeScript, Vite, npm configurations
```

## Key Components

### Core Components (`/src/core/components/`)
- **UniversalCard**: Reusable card component with flexible display options
- **ContentReader**: Component for displaying formatted content with various view modes

### Navigation System (`/src/components/navigation/` and `/src/layout/navigation/`)
- **WorldNavigation**: Navigation component supporting different "world" contexts
- **NavigationSystem**: Main navigation handling system with multiple display variants

### Layout System (`/src/layout/`)
- **BaseLayout**: Base layout wrapper for consistent page structure
- **NavigationSystem**: Navigation management for different sections

## Page Structure (`/src/pages/`)

```
/pages/
├── announcements/          # Announcements and news pages
├── demo/                   # Demo and test pages
├── gallery/                # Gallery display pages
├── home/                   # Home and landing pages
├── introduction/           # Introduction and about pages
├── laboratory/             # Interactive laboratory section
├── projectNiferche/        # Main story and materials pages
└── index.ts                # Page exports
```

## Feature Organization

### Core Functionality
- **Hooks** (`/src/core/hooks/`): Custom React hooks for shared functionality
  - `useContent.ts`: Content fetching and management
  - `useNavigation.ts`: Navigation state management
  - `useResponsive.ts`: Responsive design utilities
- **Context** (`/src/core/context/`): React context providers
  - `ThemeContext.tsx`: Application theming system
- **Utils** (`/src/core/utils/`): Utility functions
  - `api.ts`: API interaction utilities

### Authentication & Storage
- AWS Amplify integration for authentication, storage, and API functionality
- Configured through the amplify directory

## State Management
- Combination of React Context API and custom hooks
- Navigation state managed through dedicated hooks
- Content loading handled by specialized hooks

## Styling Approach
- Component-specific CSS files (e.g., `ComponentName.css`)
- Global styles in `/src/styles/`
- Theme configuration in theme contexts and CSS variables

## Key Architectural Patterns
1. **Component Composition**: Building complex UIs from smaller, focused components
2. **Hooks-based Logic**: Extracting reusable logic into custom hooks
3. **Context-based State**: Using React Context for global state management
4. **Route-based Code Organization**: Structuring components by their route/page
5. **World-based Navigation**: Organizing navigation by conceptual "worlds"

## Development Tools
- TypeScript for static typing
- Vite for development server and building
- AWS Amplify for backend services
# Project Niferche - Architecture Patterns

## Core Architecture Patterns

### 1. Component Composition
The application uses React's component composition pattern extensively:
- Building complex UIs from smaller, focused components
- Separating container components from presentational components
- Using component composition for layout and content organization

**Example**: The BaseLayout component wraps page content with consistent navigation and structure.

### 2. Custom Hooks Pattern
Logic is extracted into reusable custom hooks:
- `useContent` - Content fetching and management
- `useNavigation` - Navigation state management
- `useResponsive` - Responsive design utilities

This enables separation of concerns and reusability across different components.

### 3. Context-based State Management
React Context API is used for global state management:
- ThemeContext for application theming
- Previous implementation had SessionContext and BadgeContext

This approach allows for state sharing without prop drilling.

### 4. Route-based Code Organization
The codebase is organized primarily by routes/pages:
- Each major section has its own directory
- Components specific to a route are co-located
- Shared components are lifted to core/components

### 5. World-based Navigation Pattern
The unique "world" navigation concept:
- Content organized by conceptual worlds
- Navigation adapts to current world context
- Cross-world linking with intelligent path mapping

## File Structure Patterns

### Feature-First Organization
The project uses a feature-first organizational structure:
- `/pages` - Page components by feature/section
- `/components` - Shared UI components
- `/core` - Core functionality and components
- `/layout` - Layout systems and wrappers

### Module Pattern with Index Exports
Components are organized with index files for clean imports:
```
/ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.css
  └── index.ts  (re-exports component)
```

### CSS Module Pattern
Each component has its own CSS file with matching name:
- ComponentName.tsx
- ComponentName.css

## API and Data Patterns

### Content Loading Pattern
Content is loaded through specialized hooks:
- Consistent loading states
- Error handling
- Data transformation

### AWS Amplify Integration
Backend services are integrated through AWS Amplify:
- Authentication
- Storage
- API connectivity

## Routing Patterns

### Nested Route Pattern
Routes are organized hierarchically:
```
/section/
  ├── subsection/
  └── :dynamicParam
```

### Layout Route Pattern
Different sections have different layout components:
- BaseLayout as the foundation
- Section-specific layout components

## UI Component Patterns

### Universal Components
Reusable components that adapt to different contexts:
- UniversalCard with multiple display variants
- ContentReader with different view modes

### Responsive Design Pattern
UI adapts to different screen sizes through:
- CSS media queries
- Responsive hook for JavaScript-based adaptations
- Collapsible navigation for mobile

## State Management Patterns

### Combined State Management
A mix of state management approaches:
- Local component state for UI-specific state
- Context for shared/global state
- Custom hooks for complex state logic

## Naming Conventions

### PascalCase Components
All React components use PascalCase naming:
- WorldNavigation
- ContentReader
- BaseLayout

### Consistent File Naming
Files are consistently named:
- Component files match component names
- CSS files match component names
- index.ts files for clean exports

## Testing Approach

Based on the test directory, the project uses:
- Component architecture analysis
- Performance optimization testing
- UI/UX testing

## Project Evolution

The project shows signs of evolution/refactoring:
- Legacy code preserved in /oldset
- New architecture patterns in the current implementation
- Transition from older component organization to newer patterns
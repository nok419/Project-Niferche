# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start the development server
- `npm run build` - Build the project (runs TypeScript compilation and Vite build)
- `npm run preview` - Preview the production build locally
- `npx tsc --noEmit` - Run TypeScript type checking without emitting files

## Code Style Guidelines
- Use TypeScript with strict type checking
- Components use PascalCase naming (e.g., ContentCard)
- Use functional components with arrow function syntax
- Organize imports: React/hooks first, then UI components, then routing
- Use named exports instead of default exports
- Use interfaces with 'I' prefix for component props
- Two space indentation
- Handle errors with try/catch in async functions
- Create error boundaries for React component errors
- Use context-based state management where appropriate
- Follow AWS Amplify patterns for authentication and storage
- Keep components small and focused on a single responsibility
- Organize components by feature in dedicated directories

## Project Structure
- `/src/components` - Reusable UI components
- `/src/pages` - Route-based page components
- `/src/services` - API and external service integrations
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions
- `/src/contexts` - React context providers
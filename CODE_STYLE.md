# Code Style Guide

This document describes the code style conventions for the LinguiCards.Frontend project. Following these guidelines ensures code consistency, readability, and maintainability.

---

## Table of Contents
- [General Principles](#general-principles)
- [TypeScript & Angular](#typescript--angular)
- [SCSS & Stylelint](#scss--stylelint)
- [Commit Messages](#commit-messages)

---

## General Principles
- Write clean, readable, and self-explanatory code.
- Prefer clarity over cleverness.
- Use comments sparingly—prefer self-documenting code.
- Keep functions and components small and focused.
- Use consistent naming conventions.

---

## TypeScript & Angular

### Formatting
- Use 2 spaces for indentation.
- Use single quotes for strings (`'example'`), except in JSON.
- Always use semicolons.
- Use trailing commas in multi-line objects and arrays.
- Prefer `const` and `let` over `var`.

### Naming
- Use `camelCase` for variables, functions, and properties.
- Use `PascalCase` for classes, interfaces, and Angular components.
- File names should be `kebab-case` (e.g., `translation-practice.component.ts`).

### Angular Specific
- Use Angular CLI for generating components, services, etc.
- Use `@Input()` and `@Output()` for component communication.
- Keep component templates clean; move logic to the TypeScript file.
- Use `async` pipes for observables in templates.
- Prefer `OnPush` change detection for performance.
- Group and order imports: Angular, third-party, project, relative.

### Linting
- Use ESLint for TypeScript linting (`npm run lint`).
- Fix lint errors before committing.

---

## SCSS & Stylelint

### Formatting
- Use 2 spaces for indentation.
- Use lowercase for property names and values (except font names, etc.).
- Use hex codes for colors, or CSS variables if available.
- Prefer shorthand properties where possible.
- Use nesting sparingly—avoid deep nesting.
- Use `box-sizing: border-box` for layout consistency.

### Naming
- Use `kebab-case` for class names (e.g., `.translation-practice-container`).
- Use BEM or similar methodology for complex components.

### Structure
- Group related styles together.
- Use variables for colors, spacing, and font sizes if possible.
- Place media queries at the end of the selector block.

### Linting
- Use Stylelint for SCSS linting (`npm run stylelint`).
- Fix lint errors before committing.
- The configuration extends `stylelint-config-standard-scss` and is customized for Angular and modern SCSS.

---

## Commit Messages
- Use clear, descriptive commit messages.
- Use the imperative mood (e.g., "Add feature", "Fix bug").
- Reference issues or tasks if relevant.

---

## Tools
- **ESLint**: TypeScript/Angular linting
- **Stylelint**: SCSS linting
- **Prettier** (optional): For code formatting

---

## Useful Commands
- `npm run lint` — Check TypeScript/Angular code style
- `npm run stylelint` — Check SCSS code style
- `npm run stylelint:fix` — Auto-fix SCSS style issues

---

## Questions?
If you have questions about the code style, ask in the project chat or contact the maintainers. 
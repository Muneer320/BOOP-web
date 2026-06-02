# GitHub Copilot Usage Plan

**Date:** 2026-06-02

---

## Best Targets for Copilot

| Task | Copilot Strength | Example Prompt |
|------|-----------------|----------------|
| **New Components** (PuzzlePreview) | ⭐⭐⭐⭐⭐ | "Create React component that renders a puzzle grid as an HTML table with hover highlighting" |
| **TypeScript Migration** | ⭐⭐⭐⭐⭐ | "Convert this component to TypeScript with proper prop interfaces" |
| **CSS Generation** (dark mode) | ⭐⭐⭐⭐ | "Generate `[data-theme="dark"]` CSS variables for this color palette" |
| **Test Writing** | ⭐⭐⭐⭐⭐ | "Write Jest tests for FileUploader component covering upload, success, error states" |
| **Refactoring** (splitting components) | ⭐⭐⭐⭐ | "Extract form step 1 from PuzzleCreator into separate PuzzleSettings component" |
| **Documentation** | ⭐⭐⭐⭐ | "Generate JSDoc comments for all functions in PuzzleCreator.js" |
| **Custom Hooks** | ⭐⭐⭐⭐ | "Create usePuzzleGeneration hook with loading/error/success states" |

## Repetitive Logic Copilot Can Automate

- Form field patterns (label + input + validation)
- CSS media queries for consistent breakpoints
- API service methods following existing patterns
- Test templates for each component
- Error handling try/catch blocks

## Architecture Code to Generate

- Error boundary component
- Custom hooks (useApi, useGeneration)
- Context splitting (SettingsContext, UploadContext)
- TypeScript interfaces from prop patterns

## Documentation to Generate

- `Backend/README.md` from route handler docstrings
- JSDoc comments for all functions
- Changelog from git history
- API documentation from Pydantic models

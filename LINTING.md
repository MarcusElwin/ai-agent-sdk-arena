# Linting and Formatting Guide

This project uses ESLint and Prettier for code quality and formatting consistency.

## Available Commands

- `npm run lint`: Check for linting issues
- `npm run lint:fix`: Fix linting issues automatically
- `npm run format`: Format all files using Prettier
- `npm run format:check`: Check if files are formatted correctly

## Git Hooks

We use Husky and lint-staged to automatically format and lint code during commits.

When you make a commit, the pre-commit hook will run:
1. ESLint to check and fix JavaScript/TypeScript code issues
2. Prettier to format all staged files

## VS Code Integration

For the best development experience, install the following VS Code extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

The project's VS Code settings are configured to:
- Format on save
- Fix lint issues on save
- Use Prettier as the default formatter

## Configuration Files

- `.eslintrc.json`: ESLint configuration
- `.prettierrc`: Prettier formatting rules
- `.eslintignore`: Files ignored by ESLint
- `.prettierignore`: Files ignored by Prettier
- `.vscode/settings.json`: VS Code integration settings
- `.vscode/extensions.json`: Recommended VS Code extensions
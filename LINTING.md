# Linting and Formatting Guide

This project uses ESLint and Prettier for code quality and formatting consistency in JavaScript/TypeScript code.

## Available Commands

### For Frontend and TypeScript Backend

From the frontend directory:

- `npm run lint`: Check for linting issues
- `npm run lint:fix`: Fix linting issues automatically
- `npm run format`: Format all files using Prettier
- `npm run format:check`: Check if files are formatted correctly

To run these commands on the entire project (including backend TypeScript code), use:

```bash
# Run ESLint on all TypeScript files in the project
npx eslint "**/*.{ts,tsx,js,jsx}" --max-warnings=0

# Format all files in the project
npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"
```

### For Python Backend

For Python code in the backend, we recommend using:

- Black for code formatting
- isort for import sorting
- flake8 for linting

To install these tools:

```bash
pip install black isort flake8
```

To run:

```bash
# Format Python code
black backend/

# Sort imports
isort backend/

# Lint Python code
flake8 backend/
```

## Git Hooks

We use Husky and lint-staged to automatically format and lint code during commits:

1. ESLint to check and fix JavaScript/TypeScript code issues
2. Prettier to format all staged JS/TS/CSS/JSON/MD files

## VS Code Integration

For the best development experience, install the following VS Code extensions:

For JavaScript/TypeScript:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

For Python:

- Python (`ms-python.python`)
- Black Formatter (`ms-python.black-formatter`)
- isort (`ms-python.isort`)
- Flake8 (`ms-python.flake8`)

The project's VS Code settings are configured to:

- Format on save
- Fix lint issues on save
- Use Prettier as the default formatter for JS/TS files

## Configuration Files

- `.eslintrc.json`: ESLint configuration (with different rules for frontend and backend)
- `.prettierrc`: Prettier formatting rules
- `.eslintignore`: Files ignored by ESLint
- `.prettierignore`: Files ignored by Prettier
- `.vscode/settings.json`: VS Code integration settings
- `.vscode/extensions.json`: Recommended VS Code extensions

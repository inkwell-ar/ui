# Pre-commit Hook for Code Formatting

This project uses a pre-commit hook to automatically format code before commits, ensuring consistent code style across the codebase.

## Setup

The pre-commit hook is automatically set up when you run `pnpm install` thanks to the `prepare` script in `package.json`.

## Tools Used

- **Husky**: Git hooks management
- **lint-staged**: Run commands on staged files only
- **Prettier**: Code formatter with Tailwind CSS plugin

## How It Works

1. When you attempt to commit files, the pre-commit hook is triggered
2. `lint-staged` identifies staged files matching the configured patterns
3. Prettier automatically formats these files
4. The formatted files are included in your commit

## File Types Processed

The hook processes these file types:

- JavaScript/TypeScript: `.js`, `.jsx`, `.ts`, `.tsx`
- Stylesheets: `.css`
- Data: `.json`
- Documentation: `.md`
- Images: `.svg`

## Manual Formatting

You can also format files manually using these commands:

```bash
# Format all files
pnpm run format

# Check if files need formatting (without modifying them)
pnpm run format:check
```

## Configuration

### Prettier Configuration (`.prettierrc`)

```json
{
    "plugins": ["prettier-plugin-tailwindcss"],
    "printWidth": 80,
    "singleQuote": true,
    "trailingComma": "es5",
    "useTabs": false,
    "tabWidth": 4,
    "semi": true
}
```

### lint-staged Configuration (`package.json`)

```json
{
    "lint-staged": {
        "*.{js,jsx,ts,tsx,json,css,md,svg}": ["prettier --write"]
    }
}
```

## Benefits

- **Consistent Code Style**: All code follows the same formatting rules
- **Automatic Formatting**: No need to remember to format code manually
- **Reduced Review Time**: Eliminates formatting discussions in code reviews
- **Better Git History**: Clean, consistent commits

## Troubleshooting

If the pre-commit hook fails:

1. Check that all dependencies are installed: `pnpm install`
2. Verify Prettier configuration is valid
3. Run `pnpm run format:check` to see formatting issues
4. Run `pnpm run format` to fix formatting issues manually

## Skipping the Hook (Not Recommended)

In rare cases where you need to skip the pre-commit hook, you can use:

```bash
git commit --no-verify -m "Your commit message"
```

However, this is not recommended as it bypasses the formatting checks.

# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- **Dev server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build`
- **Production server**: `npm run start`
- **Lint**: `npm run lint`

**IMPORTANT:** Do not add Claude to any commit messages

## Neon MCP

When using the Neon MCP tool for any database operations:

- **Project**: Always use the `devstash` project
- **Branch**: Always use the `development` branch
- **NEVER** run any operations against the production branch unless explicitly told to do so
- Before any destructive operation (migrations, deletes, schema changes), confirm the target branch is `development`

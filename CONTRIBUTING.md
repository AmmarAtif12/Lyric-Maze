# Contributing to Lyric Maze

Thanks for your interest in contributing! This document outlines the process and guidelines for contributing to the project.

## How to Contribute

1. **Fork** the repository.
2. **Create a branch** from `main` for your change:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes and commit them (see commit message format below).
4. **Push** your branch and open a **Pull Request** against `main`.
5. Fill out the PR template and wait for a review.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/Lyric-Maze.git
cd Lyric-Maze

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Copy example env files and fill in your values
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start dev servers
cd backend && npm run dev   # terminal 1
cd frontend && npm run dev  # terminal 2
```

## Code Style Guidelines

- Use **ES Modules** (`import`/`export`).
- Follow the existing project formatting (Prettier defaults: single quotes, trailing commas, 2-space indent).
- Keep components small and focused — one component per file.
- Use meaningful variable and function names.
- Add JSDoc comments for public utility functions.

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

```
feat(maze): add procedural maze generation
fix(quiz): handle empty API response gracefully
docs(readme): update setup instructions
```

## Reporting Issues

When opening an issue, please include:

- A clear and descriptive title.
- Steps to reproduce the problem (if applicable).
- Expected vs. actual behavior.
- Screenshots or error logs, if available.
- Your environment (OS, browser, Node.js version).

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Include tests for new functionality when possible.
- Make sure existing tests pass before submitting.
- Reference any related issues in the PR description (e.g., `Closes #42`).

## Code of Conduct

Be respectful and constructive. We are all here to learn and build something fun.

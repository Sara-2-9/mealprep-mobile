# MealPrep

MealPrep is a cross-platform Expo proof of concept that creates a seven-day meal plan from a weekly budget, dietary needs, nutritional goals, and a normalized Esselunga product catalog.

## Technology

- Expo SDK 57, React Native 0.86, and Expo Router
- React Compiler for automatic component and hook memoization
- TypeScript in strict mode
- Bun 1.4.2 for package management, scripts, tests, and the API server
- NativeWind for design tokens and utility styling
- React Native `StyleSheet` for exact Figma geometry and dynamic native styles
- Vercel AI SDK Core with the OpenAI Responses provider and Zod Structured Outputs
- Zod validation at every network boundary

Bun is not the on-device JavaScript runtime. The native application runs through React Native/Hermes; Bun powers development tooling and the protected server endpoint.

## Requirements

- Bun 1.4.2
- Node.js LTS, still required by some Expo commands
- Xcode or Android Studio for native simulators
- The take-home `README.pdf` and original assets stored locally in `blackboard-mobile-engineer-take-home/`

## Setup

```sh
bun install --frozen-lockfile
cp .env.example .env
bun run catalog:build
```

Set the provided API key as `OPENAI_API_KEY` in `.env`. Never use an `EXPO_PUBLIC_` prefix for this value.

Start the Expo client and protected Bun API together:

```sh
bun run ios
```

The `start`, `ios`, `android`, and `web` scripts manage both processes and stop them together. Use `bun run expo:start` only when the API is already running separately.

For a physical device, set `EXPO_PUBLIC_API_BASE_URL` to the development machine's LAN address rather than `localhost`.

## Quality checks

```sh
bun run validate
```

The validation pipeline checks for common secret patterns, runs ESLint and TypeScript, executes unit tests, and invokes Expo Doctor.

To audit React Compiler coverage after changing component structure:

```sh
bunx react-compiler-healthcheck@latest
```

## Commit convention

Every commit uses [Conventional Commits](https://www.conventionalcommits.org/), for example:

```text
feat(meal-plan): add structured generation endpoint
fix(budget): clamp slider values at both bounds
docs(architecture): explain catalog pre-filtering
```

Enable the repository-provided hook after cloning:

```sh
git config core.hooksPath .githooks
```

Pull requests also validate every commit message in CI.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Figma design specification](docs/DESIGN_SPEC.md)
- [Implementation decisions](docs/DECISIONS.md)
- [AI tooling overview](docs/AI_USAGE.md)
- [Project plan](docs/PROJECT_PLAN.md)
- [Security policy](SECURITY.md)

## Confidential inputs

The original take-home directory is intentionally ignored by Git because the PDF contains an API credential and the redistribution rights of the source design/font bundle have not been established. Only the minimum app-ready assets and a normalized catalog are copied into the project.

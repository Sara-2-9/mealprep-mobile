# Implementation Decisions

## Client/server boundary

The brief permits an all-client implementation for simplicity, but the supplied API key cannot be protected inside an installed mobile application. MealPrep therefore uses a small Bun server. The user-facing app remains a standalone Expo application and communicates with a single `/meal-plan` endpoint.

The development scripts start that API together with Expo and stop both processes together. This prevents the final screen from failing simply because Metro was started without its local API dependency. The raw `expo:start` command remains available for cases where the API is already managed externally.

## Vercel AI SDK evaluation

The Expo AI SDK quickstart targets interactive streaming chat and places provider calls behind an API route. MealPrep performs one non-streaming, schema-constrained generation and keeps that call on its Bun server. Adding `@ai-sdk/react` to the mobile bundle would not improve this flow and would risk blurring the credential boundary.

AI SDK Core with `@ai-sdk/openai` is used server-side through `generateText` and `Output.object`. The shared Zod schema is the single source for JSON Schema generation, static output typing, and runtime validation. The OpenAI provider explicitly uses the Responses API with strict JSON Schema mode and response storage disabled. Deterministic checks still verify weekdays, catalog references, and total price because structural validation cannot prove those business invariants.

## NativeWind and exact geometry

NativeWind owns reusable design tokens and utility layout. Exact Figma measurements, dynamic thumb positioning, platform-specific safe areas, and animation values use React Native styles. This hybrid avoids unreadable arbitrary utility strings while retaining a coherent design system.

Third-party native containers such as `SafeAreaView` use explicit React Native styles because utility props were not applied consistently in Expo Go. Local rasterized system emoji assets avoid device-font differences without adding an external asset dependency.

## Source layout and React Compiler

The Expo Router tree contains only route entry points and the root layout. Screen composition lives in `src/screens`; reusable UI, feature hooks, pure domain rules, API adapters, and design tokens have independent boundaries. This keeps navigation discoverable without turning routes into large feature modules.

React Compiler is enabled through Expo's `experiments.reactCompiler` setting. Eligible components and hooks rely on its automatic memoization, so manual memoization is reserved for measured exceptions. The compiler healthcheck currently compiles all application components and reports no incompatible libraries.

## Font delivery

The Expo Font config plugin is the production source of truth because native embedding avoids a blank first render. Runtime loading uses the same explicit Promo PostScript names as a compatibility path for Expo Go and web, where config-plugin embedding is not applied. Splash screen ownership stays at the root layout, outside individual screens.

## Budget meaning

The weekly budget represents the total shelf price of unique product packages needed by the seven recipes. Reused ingredients are charged once. Per-serving figures are informative and are computed from catalog prices rather than model output.

## Dietary interpretation

Allergen exclusions are strict. Vegetarian, vegan, and pescatarian selections additionally exclude incompatible departments. Missing nutrition values remain unknown and cannot qualify a product for a quantitative low/high goal.

## Missing design states

Selected preference cards use an accent border and a light green surface derived from the design palette. Loading, error, retry, and long recipe states were not supplied; they use the same typography, radius, and surface system.

## Supplied LLM credential

The configured key is loaded server-side from the ignored `.env` file. The application does not substitute another key or silently fall back to mock content; upstream failures use the safe error state. After credential rotation, a live AI SDK request completed successfully and passed the shared schema plus all deterministic business checks.

## One additional feature

The best next feature would be a pantry and leftovers tracker. It would reduce waste, prevent already-owned products from being charged against the weekly budget, and make subsequent plans progressively more accurate.

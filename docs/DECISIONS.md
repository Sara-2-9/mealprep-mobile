# Implementation Decisions

## Client/server boundary

The brief permits an all-client implementation for simplicity, but the supplied API key cannot be protected inside an installed mobile application. MealPrep therefore uses a small Bun server. The user-facing app remains a standalone Expo application and communicates with a single `/meal-plan` endpoint.

The development scripts start that API together with Expo and stop both processes together. This prevents the final screen from failing simply because Metro was started without its local API dependency. The raw `expo:start` command remains available for cases where the API is already managed externally.

## Vercel AI SDK evaluation

The Expo AI SDK quickstart targets interactive streaming chat and places provider calls behind an API route. MealPrep performs one non-streaming, schema-constrained generation and already keeps that call on its Bun server. Adding `@ai-sdk/react` to the mobile bundle would not improve this flow and would risk blurring the credential boundary.

AI SDK Core with `@ai-sdk/openai` could replace the server's direct OpenAI SDK call using `generateText` and `Output.object`. That would be worthwhile if MealPrep needs provider portability, streamed partial plans, or AI SDK middleware. It is not adopted yet because it cannot fix authentication: both SDKs send the same supplied OpenAI credential, which the upstream currently rejects with HTTP 401. The existing direct Responses API integration remains smaller and preserves the current validation pipeline.

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

The only supplied key is loaded server-side from the ignored `.env` file. A live request reached OpenAI but was rejected with HTTP 401. The application does not substitute another key or silently fall back to mock content; its safe error state is shown instead. A temporary local fixture was used solely for final-screen visual QA.

## One additional feature

The best next feature would be a pantry and leftovers tracker. It would reduce waste, prevent already-owned products from being charged against the weekly budget, and make subsequent plans progressively more accurate.

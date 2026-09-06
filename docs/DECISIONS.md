# Implementation Decisions

## Client/server boundary

The brief permits an all-client implementation for simplicity, but the supplied API key cannot be protected inside an installed mobile application. MealPrep therefore uses a small Bun server. The user-facing app remains a standalone Expo application and communicates with a single `/meal-plan` endpoint.

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

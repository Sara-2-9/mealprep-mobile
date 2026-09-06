# Implementation Decisions

## Client/server boundary

The brief permits an all-client implementation for simplicity, but the supplied API key cannot be protected inside an installed mobile application. MealPrep therefore uses a small Bun server. The user-facing app remains a standalone Expo application and communicates with a single `/meal-plan` endpoint.

## NativeWind and exact geometry

NativeWind owns reusable design tokens and utility layout. Exact Figma measurements, dynamic thumb positioning, platform-specific safe areas, and animation values use React Native styles. This hybrid avoids unreadable arbitrary utility strings while retaining a coherent design system.

Third-party native containers such as `SafeAreaView` use explicit React Native styles because utility props were not applied consistently in Expo Go. Local rasterized system emoji assets avoid device-font differences without adding an external asset dependency.

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

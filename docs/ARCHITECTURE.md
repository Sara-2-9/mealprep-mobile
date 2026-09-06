# Architecture

## Boundaries

The UI is intentionally separated from business rules:

```text
Expo Router screen
  -> feature hook
    -> domain model / service interface
      -> client API adapter
        -> Bun server
          -> deterministic catalog filter
          -> OpenAI Responses API
          -> schema and budget validation
```

Route components compose presentational UI and call feature hooks. They do not read the product catalog or invoke OpenAI directly. Domain modules contain pure types, schemas, and selection rules. The API key exists only in the Bun process environment.

## Wizard state

`WizardProvider` owns the minimum source of truth: weekly budget, dietary needs, and nutritional goals. Derived values are calculated at use sites rather than duplicated in state. The custom `useMealPlanWizard` hook is the only public state interface.

The slider keeps pointer interaction local and commits clamped values through the hook. Selection helpers treat `none` as mutually exclusive with every concrete preference.

## Meal plan generation

The server validates the request, filters all 3,295 normalized products, and builds a small diverse candidate set. The model can reference only those exact product IDs. Structured Outputs constrain the response to seven meals. After generation, the server rejects unknown IDs and recomputes the basket total from catalog prices. The model is never trusted to calculate money.

## Rendering performance

- Expo Router uses a native stack.
- The large catalog never enters the mobile bundle's initial render path.
- High-frequency drag state is isolated from the navigation tree.
- Shared components use fixed Figma geometry and stable callbacks.
- Decorative motion uses transform and opacity rather than layout animation.
- `expo-image` renders the supplied raster asset.

## Error behavior

The final screen represents loading, success, and recoverable error states. Network requests are aborted on unmount. Invalid structured output, unavailable credentials, impossible preference combinations, and over-budget baskets are surfaced as retryable failures rather than silently replaced with fabricated data.


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

Files in `src/app` are route-only entry points. They delegate rendering to `src/screens`, where screens compose presentational UI and call feature hooks. Screens do not read the product catalog or invoke OpenAI directly. Domain modules contain pure types, schemas, and selection rules. The API key exists only in the Bun process environment.

```text
src/
  app/             route-only Expo Router entries
  screens/         screen composition and navigation wiring
  components/      reusable UI and illustrations
  features/        feature-scoped state and orchestration hooks
  hooks/           application-wide hooks
  domain/          pure schemas, types, and business rules
  services/        client-side API adapters
  design-system/   tokens, typography, and asset mappings
server/             Bun API and catalog orchestration
tests/              cross-boundary unit tests
```

The route layer stays deliberately small so file-based navigation metadata does not become coupled to screen implementation. Styles remain colocated with their owning components; shared primitives and tokens move upward only when reused.

## Wizard state

`WizardProvider` owns the minimum source of truth: weekly budget, dietary needs, and nutritional goals. Derived values are calculated at use sites rather than duplicated in state. The custom `useMealPlanWizard` hook is the only public state interface.

The slider keeps pointer interaction local and commits clamped values through the hook. Selection helpers treat `none` as mutually exclusive with every concrete preference.

## Meal plan generation

The server validates the request, filters all 3,295 normalized products, and builds a small diverse candidate set. The model can reference only those exact product IDs. Structured Outputs constrain the response to seven meals. After generation, the server rejects unknown IDs and recomputes the basket total from catalog prices. The model is never trusted to calculate money.

## Rendering performance

- Expo Router uses a native stack.
- React Compiler automatically memoizes eligible components, hooks, values, and callbacks.
- Manual `useMemo`, `useCallback`, and `memo` are avoided unless profiling demonstrates a compiler escape hatch is required.
- The large catalog never enters the mobile bundle's initial render path.
- High-frequency drag state is isolated from the navigation tree.
- Shared components use fixed Figma geometry and narrowly scoped props.
- Decorative motion uses transform and opacity rather than layout animation.
- `expo-image` renders the supplied raster asset.

## Error behavior

The final screen represents loading, success, and recoverable error states. Network requests are aborted on unmount. Invalid structured output, unavailable credentials, impossible preference combinations, and over-budget baskets are surfaced as retryable failures rather than silently replaced with fabricated data.

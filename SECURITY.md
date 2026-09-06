# Security

## Secrets

The OpenAI API key is a server-only secret. Store it as `OPENAI_API_KEY` in the ignored `.env` file or in the deployment provider's secret manager. Never expose it through `EXPO_PUBLIC_*`, app configuration, source code, screenshots, recordings, or conversation logs.

The original assignment PDF is excluded from Git because it contains the supplied credential. Secret-pattern checks run locally and in CI.

Errors returned by the upstream LLM provider are mapped to safe client messages. Raw provider errors are not returned to the app or written to server logs because they may include credential fragments or request details.

## Reporting

Do not open a public issue for a suspected credential leak. Revoke repository or deployment access where possible and contact the repository owner privately with the affected path and commit identifier.

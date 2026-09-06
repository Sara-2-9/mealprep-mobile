# AI Tooling Overview

AI tools were used as an engineering aid, with every generated artifact reviewed and validated locally.

| Tooling | Purpose | Verification |
| --- | --- | --- |
| Codex | Brief analysis, architecture, implementation, tests, and documentation | TypeScript, tests, Expo Doctor, simulator review |
| PDF inspection workflow | Rendered and reviewed all six pages of the assignment | Visual page-by-page review |
| Figma Desktop | Visual inspection of supplied frames and completed weekly-plan variant | Compared with parsed source geometry |
| Local `.fig` parser | Extracted node sizes, colors, typography, positions, and embedded images | Cross-checked against Figma and thumbnail |
| Official documentation search | Checked Expo 57, Bun, NativeWind, and OpenAI behavior | Sources linked from project documentation |
| Ephemeral local fixture | Exercised the complete weekly-plan presentation after the supplied key returned HTTP 401 | Not committed; validated seven days and day switching in iOS Simulator |

Conversation logs must be exported separately and redacted before delivery. The supplied API credential, local paths containing personal information, and incidental environment data must not appear in those logs.

# Gemini AI Integration

This app can use Gemini for task intelligence features (e.g., summarizing tasks or predicting blockers).

## Model Selection
- Prefer `gemini-1.5-flash` for quick summarization.
- Use `gemini-1.5-pro` for complex reasoning over multiple tasks.

## Implementation Patterns
- Use the `@google/genai` SDK.
- Always use server-side execution for AI features to protect the API key.

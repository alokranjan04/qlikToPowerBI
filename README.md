<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e3f7f4db-c536-4421-86ef-23e332cbb28d

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Architecture Overview

This project is a Next.js-based AI assistant for Power BI. It is built with a client-side chat UI, a server-side API route for request handling, and provider abstractions for multiple large language models.

### Core layers

- `app/page.tsx`
  - Main page component that renders the UI split into a sidebar, chat window, and business context panel.
  - Tracks the selected assistant mode and shared context text.

- `components/layout/sidebar.tsx`
  - Sidebar mode selector for Power BI-specific use cases.
  - Supports multiple assistant modes like `DAX Generator`, `DAX Explainer`, and `Visualization Recommender`.

- `components/chat/chat-window.tsx`
  - Chat interface with message rendering, input textarea, and local storage history.
  - Sends conversations to the server API and displays assistant responses.
  - Uses `react-markdown` to render AI responses as formatted markdown.

- `components/chat/context-panel.tsx`
  - Right-pane editor for pasting business or data model context.
  - Context is included in each request to the AI backend.

### API and provider layer

- `app/api/chat/route.ts`
  - Server-side API route that receives chat messages, mode, and context.
  - Builds a mode-aware system prompt for Power BI guidance.
  - Delegates generation to the configured LLM provider.

- `lib/llm/index.ts`
  - Defines the generic provider interface and message types.
  - Maps provider strings to concrete implementations.

- `lib/llm/providers/gemini.ts`
  - Gemini provider using `@google/genai`.
  - Reads `GEMINI_API_KEY` from environment variables.

- `lib/llm/providers/anthropic.ts`
  - Example Anthropic provider implementation using REST.
  - Requires `ANTHROPIC_API_KEY` when enabled.

- `lib/llm/providers/azure-openai.ts`
  - Stub for Azure OpenAI integration.
  - Intended for future enterprise provider support.

### Styling and config

- `app/globals.css`
  - Imports Tailwind CSS base styles.

- `next.config.ts`
  - Configures standalone output, remote image patterns, and optional HMR disable logic.

- `package.json`
  - Defines dependencies for React, Next.js, Tailwind CSS, and AI provider SDKs.

### Notes

- The app currently defaults to `gemini` if `LLM_PROVIDER` is not explicitly configured.
- Chat history is stored locally per mode for up to 30 days.
- The `context` panel enables richer, data-aware answers by supplying the model with business or schema details.

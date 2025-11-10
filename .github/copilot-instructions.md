# Copilot Instructions for locutor-radio-tatuape-fm

This document provides essential guidelines for AI coding agents to be immediately productive in the `locutor-radio-tatuape-fm` codebase.

## 1. Big Picture Architecture

The application is a React-based web application that simulates a radio player with an AI announcer. It fetches live track information from a Shoutcast server and uses the Gemini API to generate comments about the currently playing music.

- **`src/main.tsx`**: Entry point of the React application.
- **`src/App.tsx`**: Main application component, rendering the `RadioPlayer` and `AIAnnouncer`.
- **`src/components/RadioPlayer.tsx`**: Handles the radio playback and displays the current and recent tracks.
- **`src/components/AIAnnouncer.tsx`**: Manages the AI announcer functionality, including fetching AI comments and text-to-speech.
- **`src/services/trackService.ts`**: Responsible for fetching current and historical track data from the Shoutcast server.
- **`src/services/aiService.ts`**: Interacts with the Gemini API to generate intelligent comments about tracks.
- **`src/services/speechService.ts`**: Provides text-to-speech functionality.

## 2. Data Flow

1.  `RadioPlayer.tsx` and `AIAnnouncer.tsx` periodically call `getShoutcastData()` from `trackService.ts`.
2.  `trackService.ts` fetches data from the Shoutcast server's `played.html` (for current song) and `admin.cgi?mode=viewlog` (for history).
3.  `AIAnnouncer.tsx` uses the current track information to call `generateTrackComment()` from `aiService.ts`.
4.  `aiService.ts` sends a prompt to the Gemini API and returns the generated comment.
5.  `AIAnnouncer.tsx` then uses `speakText()` from `speechService.ts` to vocalize the AI comment.

## 3. Critical Developer Workflows

-   **Build**: The project uses Vite. To build the project, run `npm run build`.
-   **Development**: To start the development server, run `npm run dev`.
-   **Dependencies**: Dependencies are managed via `package.json`. Install them with `npm install`.

## 4. Project-Specific Conventions and Patterns

-   **Shoutcast Integration**: Direct fetching and parsing of HTML/text from Shoutcast URLs. Be mindful of the parsing logic in `trackService.ts` if Shoutcast output format changes.
-   **AI Interaction**: The `aiService.ts` is configured with a specific persona for the AI announcer. Modifications to the AI's tone or content should be done by adjusting the prompt in `generateTrackComment`.
-   **Text-to-Speech**: The `speechService.ts` handles browser-based Web Speech API for announcements.

## 5. External Dependencies

-   **Shoutcast Server**: `http://uk7freenew.listen2myradio.com:16784`
-   **Gemini API**: `https://generativelanguage.googleapis.com` (API Key is stored in `aiService.ts`)
-   **MyTuner Radio Player**: External scripts are loaded dynamically in `RadioPlayer.tsx` for the audio player functionality.

## 6. Key Files and Directories

-   `src/services/trackService.ts`: Shoutcast data fetching and parsing.
-   `src/services/aiService.ts`: Gemini API integration and AI comment generation.
-   `src/services/speechService.ts`: Web Speech API for text-to-speech.
-   `src/components/AIAnnouncer.tsx`: AI announcer UI and logic.
-   `src/components/RadioPlayer.tsx`: Radio player UI and logic.
-   `index.html`: Main HTML file, includes the root div for the React app.
-   `package.json`: Project dependencies and scripts.

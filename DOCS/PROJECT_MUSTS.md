# Svelte Touchpanel UI Template – PROJECT MUSTS

This document provides a comprehensive guide to understanding, building, and extending the Svelte Touchpanel UI Template. It covers the project’s architecture, build process, dependencies, contracts, UX principles, CrComLib integration, utilities, best practices, and common gotchas. Use this as a blueprint for rapid MVP development or onboarding.

---

## 1. Project Overview
- **Purpose:**
  - Modular, scalable Svelte-based UI for AV control, monitoring, and routing on Crestron touchpanels (TS-770 and similar).
  - Hierarchical navigation: Dashboard → Terminal → Zone → Source.
  - Touch-optimized, responsive, and brand-customizable.
- **Stack:**
  - Svelte + TypeScript + Tailwind CSS
  - Svelte stores for state management
  - CH5 CrComLib ready (for Crestron integration)
  - UA brand color palette and shadowbox styling

---

## 2. Project Structure & Key Components
- `src/`
  - `NavigationHeader.svelte` – Top bar with global controls, status, and navigation
  - `TerminalDashboard.svelte` – Grid overview of all terminals/zones
  - `TerminalControl.svelte` – Per-terminal management (subzones, status)
  - `ZoneControl.svelte` – Per-zone AV/mic controls
  - `SourceGrid.svelte` – Categorized source selection
  - `EmergencyPanel.svelte` – Emergency override controls
  - `stores/` – Svelte stores for state
  - `utils/` – Utility functions (e.g., CrComLib wrappers, formatting)
  - `app.css` – Tailwind and custom CSS (including shadowbox)
  - `main.ts` – App entry, router, and initialization
- `public/` – Static assets, UA logo, favicon, etc.

---

## 3. Build & Run Instructions
### Prerequisites
- Node.js (LTS recommended)
- npm or yarn

### Install Dependencies
```
npm install
```

### Run in Development
```
npm run dev
```
- Opens local server (default: http://localhost:5173)
- Hot reload enabled

### Build for Production
```
npm run build
```
- Outputs to `/dist`

### Deploy
- Deploy `/dist` or use SvelteKit/adapter for advanced deployment.

---

## 4. Dependencies
- **Core:**
  - `svelte` (UI framework)
  - `typescript` (type safety)
  - `tailwindcss` (utility-first CSS)
  - `vite` (build tool)
- **Crestron:**
  - `@crestron/ch5-crcomlib` (Crestron device communication)
- **Other:**
  - `@sveltejs/vite-plugin-svelte` (Vite integration)
  - `autoprefixer`, `postcss` (CSS tooling)
  - See `package.json` for full list

---

## 5. Contracts & Data Flow
- **State Management:**
  - Use Svelte stores for global/shared state (e.g., current terminal, selected zone, source selection, emergency status)
  - Stores are reactive and can be imported anywhere
- **Component Contracts:**
  - All major components accept props and dispatch events for parent-child communication
  - Use explicit TypeScript interfaces for props/outputs
- **CrComLib Integration:**
  - All Crestron signal communication is abstracted via utility functions in `utils/crcomlib.ts`
  - Components never call CrComLib directly; always use the utility wrapper for testability and separation
  - Example contract:
    ```typescript
    // utils/crcomlib.ts
    export function sendDigitalSignal(signalName: string, value: boolean) { ... }
    export function subscribeToSignal(signalName: string, callback: (value: any) => void) { ... }
    ```
  - All signal names and mappings are centralized in a config/constants file
- **Routing:**
  - Uses the SourceControl.svelte pattern for navigation/routing
  - Hierarchical navigation: Dashboard → Terminal → Zone → Source

---

## 6. UX Principles & Best Practices
- **Touch-Optimized:**
  - Large hit areas, no hover-only actions, responsive layouts
  - No scrollbars on control panels; all content fits viewport
- **Shadowbox Styling:**
  - Use explicit hex color #0A1C3A for all shadowboxes
  - Box shadow, border, and radius per UA/TS-770 requirements
- **Color Palette:**
  - UA brand colors and project theme colors
  - Theme color palette accessible in Settings > Theme Colors
- **Status Indicators:**
  - Color-coded for system health, emergency, etc.
- **Accessibility:**
  - High contrast, readable fonts, logical tab order
- **Settings Modal:**
  - Tabbed, includes theme palette, system info, etc.
- **Activity Log:**
  - Real-time logging panel for system actions/events

---

## 7. CrComLib & Utilities
- **CrComLib:**
  - All device communication (digital, analog, serial signals) goes through utility wrappers
  - Subscribe/unsubscribe patterns for signals
  - Testability: mock CrComLib for local/dev work
  - Centralize all signal names and mappings
- **Utilities:**
  - Formatting, validation, and helpers in `utils/`
  - Never duplicate logic between components; always use shared utils

---

## 8. Must-Haves, Gotchas, and Best Practices
- **Must-Haves:**
  - All navigation uses the SourceControl.svelte routing pattern
  - Responsive for all TS-770 orientations
  - All shadowboxes use explicit #0A1C3A
  - No scrollbars on control panels
  - All signal names/types are centralized
  - Settings modal with theme palette and copy-to-clipboard
- **Gotchas:**
  - Do NOT call CrComLib directly in components—always use utility wrappers
  - Padding: main display containers must have zero padding (see enforced selectors)
  - Border and shadow must be visible on TS-770 (test on hardware)
  - All color values must be explicit hex, not rgba, for compatibility
  - Remember to mock CrComLib for local/dev without hardware
- **Best Practices:**
  - Use Svelte stores for all shared state
  - Use TypeScript interfaces for all props and events
  - Keep all styling in Tailwind or scoped CSS
  - Document all signal mappings and component contracts
  - Use semantic, accessible markup

---

## 9. Quickstart: From Scratch to MVP
1. **Clone the repo:**
   ```
   git clone <repo-url>
   cd <project>
   npm install
   npm run dev
   ```
2. **Configure Signal Mappings:**
   - Edit `utils/crcomlib.ts` and config/constants for your system
3. **Customize Branding:**
   - Edit theme colors in `app.css` and Settings modal
   - Replace logo/assets in `public/`
4. **Build Your UI:**
   - Use/extend `TerminalDashboard`, `TerminalControl`, `ZoneControl`, etc.
   - Add/modify Svelte stores for new state
   - Add new source types or zones as needed
5. **Integrate with Crestron:**
   - Ensure CrComLib is properly initialized and all signals mapped
   - Test on TS-770 hardware for compatibility
6. **Deploy:**
   - Build and deploy `/dist` as needed

---

## 10. References & Further Reading
- [Svelte Documentation](https://svelte.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Crestron CH5 CrComLib](https://github.com/Crestron/ch5-crcomlib)
- [UA Brand Guidelines](https://brand.arizona.edu/colors)

---

**Keep this file updated as the project evolves!**

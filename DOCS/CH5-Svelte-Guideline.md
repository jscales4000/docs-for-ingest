# CH5-Svelte Integration Guide

## Table of Contents
1. [Project Setup](#project-setup)
2. [Dependencies Installation](#dependencies-installation)
3. [Configuration](#configuration)
4. [Building and Deploying](#building-and-deploying)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

## Project Setup

### Prerequisites
- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Crestron CH5 CLI tools
- Code editor (VS Code recommended)

### Initialize a New Svelte Project
```bash
npm create vite@latest my-ch5-ui -- --template svelte-ts
cd my-ch5-ui
npm install
```

## Dependencies Installation

### Core Dependencies
```bash
# Crestron CH5 Dependencies
npm install @crestron/ch5-crcomlib @crestron/ch5-webxpanel

# UI Framework (Flowbite)
npm install flowbite-svelte flowbite-svelte-icons

# Development Dependencies
npm install -D @sveltejs/vite-plugin-svelte @tsconfig/svelte typescript svelte-check
```

### Configuration Files

#### 1. `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
```

#### 2. `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // University of Arizona Colors
        'uablue': '#0C234B',
        'uared': '#AB0520',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
```

## Configuration

### 1. Update `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>UA Touch Panel</title>
    
    <!-- Crestron CH5 -->
    <script src="./cr-com-lib.js"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### 2. Update `main.ts`
```typescript
import './app.css'
import App from './App.svelte'
import { initialize } from '@crestron/ch5-crcomlib/initialize';

// Initialize Crestron CH5
initialize();

const app = new App({
  target: document.getElementById('app'),
})

export default app
```

## Building and Deploying

### Building the Project
```bash
# Development build
npm run dev

# Production build
npm run build
```

### Creating CH5 Archive
```bash
# Install CH5 CLI if not already installed
npm install -g @crestron/ch5-cli

# Create archive
ch5-cli archive -p my-ch5-ui -d dist/ -o ./ -c ./public/config/contract.cse2j
```

## Troubleshooting

### Panel Border Issues
If your panel is showing an unwanted border, check the following:

1. **Global Styles**
   Ensure your `App.svelte` includes these reset styles:
   ```css
   :global(html), :global(body) {
     margin: 0;
     padding: 0;
     width: 100%;
     height: 100%;
     overflow: hidden;
     border: none !important;
   }
   
   :global(#app) {
     width: 100%;
     height: 100vh;
     margin: 0;
     padding: 0;
     border: none !important;
   }
   
   main {
     margin: 0;
     padding: 0;
     border: none !important;
     outline: none !important;
   }
   ```

2. **Viewport Settings**
   Ensure your viewport meta tag is properly configured:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
   ```

3. **Browser Developer Tools**
   - Right-click on the border and select "Inspect"
   - Check the "Computed" tab to see which CSS rules are being applied
   - Look for any `border`, `outline`, or `box-shadow` properties

## Best Practices

1. **Component Structure**
   - Keep components small and focused
   - Use Svelte stores for state management
   - Follow the CH5 component patterns

2. **Styling**
   - Use Tailwind CSS for utility-first styling
   - Keep component-specific styles in the component file
   - Use CSS variables for theming

3. **Performance**
   - Use `$:` for reactive statements
   - Implement code splitting for larger applications
   - Optimize images and assets

4. **Testing**
   - Write unit tests for critical components
   - Test on actual Crestron hardware when possible
   - Test different screen resolutions

## Additional Resources

- [Crestron CH5 Documentation](https://sdkcon78221.crestron.com/sdk/Content/Topics/CH5/CH5.htm)
- [Svelte Documentation](https://svelte.dev/docs)
- [Flowbite Svelte Documentation](https://flowbite-svelte.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---
*Last Updated: May 19, 2025*

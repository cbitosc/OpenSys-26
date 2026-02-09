# React + JSX + Vite + Tailwind CSS

This template provides a minimal setup to get React working in Vite with HMR, Tailwind CSS for styling, and some ESLint rules.

## Setup

To set up this project locally, follow these steps:

1. Clone or download the repository
2. Navigate to the project directory: `cd opensys-main`
3. Install dependencies: `npm install`

## Running the Project

To run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Building for Production

To build the project for production:

```bash
npm run build
```

## Component Structure

This project follows a modular component structure for easy maintenance and contribution:

```
src/
├── components/
│   ├── Navbar.jsx    # Navigation bar component
│   ├── Hero.jsx      # Hero section with call-to-action
│   ├── About.jsx     # About section with company/team info
│   ├── Events.jsx    # Events section displaying upcoming events
│   ├── Gallery.jsx   # Gallery section showing images/videos
│   └── Footer.jsx    # Footer with contact and social links
└── App.jsx           # Main application component that imports all sections
```

### Component Descriptions

- **Navbar**: Contains navigation links and branding elements
- **Hero**: Features a prominent headline, description, and call-to-action button
- **About**: Provides information about the company, team, or project
- **Events**: Displays upcoming events, dates, and event details
- **Gallery**: Showcases images, videos, or other media content
- **Footer**: Includes contact information, social links, and legal notices

## Contributing Components

To contribute to existing components:

1. Navigate to the `src/components/` directory
2. Locate the component file you want to modify
3. Make your changes following the existing code style
4. Test your changes by running `npm run dev`

To create a new component:

1. Create a new `.jsx` file in the `src/components/` directory
2. Follow the same functional component pattern as existing components
3. Export the component using `export default ComponentName`
4. Import and use the component in `App.jsx` or other components as needed

## Tailwind CSS Setup

This project includes Tailwind CSS for utility-first styling. The following files have been configured:

- `tailwind.config.js` - Tailwind configuration file
- `postcss.config.js` - PostCSS configuration with Tailwind plugin
- `src/index.css` - Main CSS file with Tailwind directives

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`
Builds the app for production to the `dist` folder.

### `npm run lint`
Lints the codebase using ESLint.

### `npm run preview`
Locally preview the production build.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      // Other configs...
      // Other configs...
    ],
    languageOptions: {
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      // other options...
    },
  },
])
```

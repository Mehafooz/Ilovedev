# Dev Tools Shell - Angular Application

A modern, responsive web application built with Angular 18+ that serves as a shell for developer utility tools.

## Project Overview

This is the base shell application for a collection of developer utilities. It provides:

- **Responsive Shell Layout** - Header, Sidebar, Main Content, Footer
- **Client-Side Routing** - Navigate between different sections
- **Modern UI** - Clean, professional design with gradient accents
- **Mobile-Friendly** - Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable shell components
│   │   ├── header/         # Top navigation header
│   │   ├── sidebar/        # Left navigation sidebar
│   │   └── footer/         # Footer component
│   ├── pages/              # Page components
│   │   ├── home/           # Home/landing page
│   │   ├── tools/          # Tools browser page
│   │   └── about/          # About page
│   ├── app.component.*     # Root component
│   ├── app.routes.ts       # Routing configuration
│   └── app.config.ts       # App configuration
├── styles.css              # Global styles
└── index.html              # Main HTML file
```

## Available Tools (Pre-configured)

1. **JSON Formatter** - Format and validate JSON with syntax highlighting
2. **Code Converter** - Convert between different code formats
3. **Regex Tester** - Test and validate regular expressions
4. **Color Picker** - Pick colors and convert between formats (HEX, RGB, HSL)
5. **Base64 Encoder** - Encode and decode Base64 strings
6. **UUID Generator** - Generate UUIDs (v1, v3, v4, v5)

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm (v10+)
- Angular CLI (v18+)

### Installation

1. Navigate to project directory:
```bash
cd /Users/mehafooz/Coding/I_love_dev/Ilovedev
```

2. Install dependencies (already done):
```bash
npm install
```

### Development Server

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200/`

### Build for Production

Build the application for production:

```bash
npm run build
```

Output will be in the `dist/dev-tools-shell` directory.

### Testing

Run unit tests:

```bash
npm test
```

Watch mode:

```bash
npm run watch
```

## Key Features

### ✨ Responsive Design
- Desktop-first design with mobile responsiveness
- Hamburger menu on mobile devices
- Adaptive layout for all screen sizes

### 🎨 Modern UI
- Purple gradient theme
- Clean, intuitive interface
- Smooth transitions and hover effects
- Professional color scheme

### 🛣️ Routing
- Client-side routing with Angular Router
- Home page with feature highlights
- Tools browser page with categorized tools
- About page with project information

### 📱 Mobile Friendly
- Responsive sidebar that collapses on mobile
- Touch-friendly navigation
- Optimized for all device sizes

## Component API

### HeaderComponent
Displays the main application header with branding and navigation.

**Properties:**
- `appTitle` - Application title
- `appSubtitle` - Application subtitle

### SidebarComponent
Left navigation sidebar with all available tools.

**Methods:**
- `toggleSidebar()` - Toggle sidebar open/closed
- `closeSidebar()` - Close the sidebar

**Properties:**
- `isOpen` - Current sidebar state
- `tools` - Array of available tools

### FooterComponent
Application footer with copyright information.

**Properties:**
- `currentYear` - Current year for copyright

## Adding New Tools

To add a new tool to the application:

1. **Create tool component:**
   ```bash
   ng generate component pages/tools/my-tool
   ```

2. **Add tool to sidebar** in `src/app/components/sidebar/sidebar.component.ts`:
   ```typescript
   {
     id: 'my-tool',
     name: 'My Tool',
     icon: '🛠️',
     description: 'Tool description',
     route: '/tools/my-tool'
   }
   ```

3. **Add route** in `src/app/app.routes.ts`:
   ```typescript
   {
     path: 'tools/my-tool',
     component: MyToolComponent
   }
   ```

## Styling

The application uses:
- **CSS3** for styling
- **Flexbox** for layout
- **CSS Grid** for component layouts
- **CSS Variables** for theming (can be extended)

Global styles are in `src/styles.css`
Component-specific styles are in respective `.css` files.

### Color Palette
- Primary: `#667eea` (Electric Blue)
- Secondary: `#764ba2` (Purple)
- Background: `#fafbfc` (Light Gray)
- Text: `#333333` (Dark Gray)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Build Size:** ~71 KB (gzipped)
- **Lazy Loading:** Ready for implementation
- **Tree Shaking:** Enabled by default
- **Minification:** Automatic in production build

## Configuration Files

- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript config
- `package.json` - Dependencies and scripts
- `.editorconfig` - Editor configuration

## Development Tips

### Debug Mode
The application includes source maps for debugging. Open Chrome DevTools to set breakpoints.

### Adding Global Styles
Add utility classes to `src/styles.css` for global styling needs.

### Customizing Theme
Update colors in `src/styles.css` or individual component CSS files.

## Troubleshooting

### Port 4200 already in use
```bash
ng serve --port 4300
```

### Module not found errors
```bash
npm install
```

### Build errors
Clear cache and rebuild:
```bash
rm -rf dist node_modules/.angular
npm run build
```

## Future Enhancements

- [ ] Add tool implementations
- [ ] Add dark mode theme
- [ ] Implement service worker for offline support
- [ ] Add analytics
- [ ] Create user preferences system
- [ ] Add keyboard shortcuts
- [ ] Implement PWA features

## License

See LICENSE file for details.

## Support

For questions or issues, please refer to the Angular documentation or create an issue in your repository.

---

**Built with ❤️ using Angular 18**

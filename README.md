# Breezit - Dynamic Form

Angular dynamic form application with Material Design built with Angular v20.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or newer)
- npm or yarn

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd breezit-angular-form
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dynamic-form/           # Main dynamic form component
│   │   │   ├── dynamic-form.component.ts
│   │   │   ├── dynamic-form.component.scss
│   │   │   └── dynamic-form.component.spec.ts
│   │   └── senior-application/     # Senior application page
│   │       ├── senior-application.component.ts
│   │       ├── senior-application.component.scss
│   │       └── senior-application.component.spec.ts
│   ├── integration/                # Integration tests
│   │   └── form-validation.integration.spec.ts
│   ├── models/
│   │   └── form-data.interface.ts  # TypeScript interfaces
│   ├── services/
│   │   ├── form-data.service.ts    # Form data management
│   │   └── form-data.service.spec.ts
│   ├── app.config.ts               # App configuration
│   ├── app.routes.ts               # Routing configuration
│   ├── app.ts                      # Root component
│   ├── app.html                    # Root component template
│   ├── app.scss                    # Root component styles
│   └── app.spec.ts                 # Root component tests
├── main.ts                         # Application bootstrap
├── index.html                      # HTML template
├── styles.scss                     # Global styles
├── material-theme.scss             # Material Design theme
├── shared-components.scss          # Shared component styles
public/
└── favicon.ico                     # Application favicon
```

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

---

Built with Angular 20 and Material Design

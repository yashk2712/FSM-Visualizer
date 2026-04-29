# FSM Simulator Frontend

React-based user interface for creating, visualizing, and simulating Finite State Machines.

## Quick Start

```bash
npm install
npm start
```

App runs on `http://localhost:3000`

## Project Structure

```
src/
├── App.jsx                      # Main app component
├── index.jsx                    # React entry point
├── index.css                    # Global styles
├── components/
│   ├── Header.jsx               # Top bar with actions
│   ├── StateManager.jsx         # State creation/editing UI
│   ├── TransitionManager.jsx    # Transition editing UI
│   ├── SimulationPanel.jsx      # Input & step-through simulation
│   ├── MachineInfo.jsx          # Machine metadata display
│   ├── GraphVisualization.jsx   # SVG-based FSM graph
│   ├── MachineLibrary.jsx       # Machine selector dropdown
│   └── Header.jsx               # Main header
├── hooks/
│   └── useMachine.js            # Custom hook for machine state management
├── services/
│   └── machineService.js        # API client
└── utils/
    └── (utility functions)
```

## Key Features

### 🎯 Components

#### `App.jsx`
Main container component that:
- Manages machine state and simulation
- Orchestrates all child components
- Handles API calls and error states

#### `StateManager.jsx`
Allows users to:
- Add new states with IDs and optional outputs
- Remove states
- Set initial state
- Edit state outputs (Moore machines)

#### `TransitionManager.jsx`
Enables creating transitions:
- Select from/to states from dropdown
- Specify input symbol
- Add output for Mealy machines
- View and delete existing transitions

#### `SimulationPanel.jsx`
Interactive simulation interface:
- Input string text field
- Step-by-step execution controls
- Display current state, transitions, outputs
- Error messages for invalid inputs

#### `GraphVisualization.jsx`
SVG-based FSM visualization:
- States rendered as circles
- Transitions as arrows
- Auto-arranged in circle layout
- Highlights active transitions during simulation
- Shows Moore outputs in states, Mealy outputs on edges

#### `MachineLibrary.jsx`
Machine selection panel:
- Lists all available machines
- Highlights current selection
- Quick-load functionality

#### `MachineInfo.jsx`
Displays machine metadata:
- Name and type (Moore/Mealy)
- State and transition counts
- Type toggle buttons
- Last updated timestamp

### 🪝 Hooks

#### `useMachine.js`
Custom hook providing:
- Machine state management
- API integration
- CRUD operations for states/transitions
- Simulation execution
- Error handling

Usage:
```javascript
const {
  machine,
  loading,
  error,
  fetchMachine,
  createNewMachine,
  addState,
  removeState,
  addTransition,
  removeTransition,
  setInitialState,
  simulate
} = useMachine();
```

### 🌐 Services

#### `machineService.js`
Axios-based API client:
- Base URL: `http://localhost:5000/api`
- Methods for all CRUD operations
- Automatic error handling
- Request/response interceptors ready

Example:
```javascript
const machines = await machineService.getAllMachines();
const result = await machineService.simulate(machineId, '101');
```

## UI/UX Design

### Layout
- **Left Panel (396px)**: Machine builder controls
- **Center**: Graph visualization (flexible)
- **Right Panel (396px)**: Simulation & machine library
- **Header**: Navigation and actions

### Color Scheme
```css
Primary: Blue (#3b82f6)
Secondary: Purple (#9333ea) - Moore
Tertiary: Orange (#ea580c) - Mealy
Neutral: Slate grays (#64748b, #94a3b8, etc.)
Status: Green (#059669), Red (#dc2626)
```

### Typography
- Font Family: System fonts (-apple-system, Segoe UI, etc.)
- Weights: Regular (400), Medium (500), Bold (700), Semibold (600)
- Sizes: 12px (xs), 13px (sm), 14px (base), 18px (lg), 24px (2xl)

### Spacing & Corners
- Grid: 4px (base unit)
- Padding: 12px (3 units) for components
- Border Radius: 8px (lg), 12px (xl)
- Shadows: Soft (2px 8px 0 rgba(0,0,0,0.08))

## Animations

Using **Framer Motion** for smooth interactions:

```javascript
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

### Animation Patterns
- Component entrance: Fade + translate
- Button hover: Scale (1.05)
- Button tap: Scale (0.95)
- State updates: Smooth opacity fade

## State Management

### Machine State Flow
1. **Load**: `fetchMachine(id)` → API call → `useMachine` hook
2. **Edit**: User updates → `addState/addTransition/etc.` → API call
3. **Simulate**: Input string → `simulate()` → returns steps
4. **Display**: Result displayed in `SimulationPanel` with step navigation

### Local Component State
- Form inputs (controlled components)
- UI visibility (modals, menus)
- Active simulation step index

## Development Workflow

### Running Dev Server
```bash
npm start
```

- Hot module reloading enabled
- Browser automatically refreshes on code changes
- Port: 3000

### Building for Production
```bash
npm run build
```

- Minified production bundle in `build/` directory
- Optimized assets
- Ready to deploy

### Code Quality
- Use ES6+ syntax
- Functional components with hooks
- Props validation (prop-types optional)
- Clear, descriptive variable names
- Comments for complex logic

## API Integration

### Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### API Error Handling
```javascript
try {
  const result = await simulate(inputString);
  if (result.success) {
    // Handle success
  } else {
    setError(result.error);
  }
} catch (err) {
  setError('Network error or server down');
}
```

## Adding New Features

### Add a New Component
1. Create `src/components/MyComponent.jsx`
2. Use functional component with hooks
3. Apply Tailwind classes
4. Add Framer Motion animations
5. Import in `App.jsx` and use

### Add a New Hook
1. Create `src/hooks/useMyHook.js`
2. Implement custom logic
3. Return state and methods
4. Use in components

### Add an API Method
1. Add method in `services/machineService.js`
2. Use axios for HTTP request
3. Handle errors
4. Call from component via `useMachine` hook or directly

## Styling

### Tailwind CSS Classes
- Colors: `bg-blue-600`, `text-slate-900`, `border-slate-200`
- Spacing: `p-4`, `m-2`, `gap-3`
- Layout: `flex`, `grid`, `absolute`
- Shadows: `shadow-soft`, `shadow-lg`
- Responsive: `md:`, `lg:` prefixes

### Custom CSS
Global styles in `index.css`:
- Scrollbar styling
- Focus states
- Smooth transitions
- SVG defaults

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Android

## Performance Tips

1. **Memoization**: Use `useMemo` for expensive calculations
2. **Lazy Loading**: Code-split large components if needed
3. **Graph Rendering**: SVG is lightweight; works for ~100 states
4. **API Caching**: Machines cached in `useMachine` hook

## Troubleshooting

### API Connection Failed
- Check backend is running: `curl http://localhost:5000/api/health`
- Verify `.env` has correct API URL
- Check browser console for CORS errors

### Animations Not Smooth
- Check for heavy re-renders (React DevTools Profiler)
- Reduce animation complexity
- Use `will-change: transform` in CSS for GPU acceleration

### Graph Not Rendering
- Verify states exist in machine
- Check SVG dimensions in `GraphVisualization.jsx`
- Browser console may show SVG errors

### Simulation Not Working
- Ensure initial state is set
- Verify all input symbols have transitions
- Check transitions are correctly from/to states

## Deployment

### Static Build
```bash
npm run build
# Upload 'build/' folder to hosting service
```

### Environment Variables
Set production API URL before building:
```bash
REACT_APP_API_URL=https://api.yourdomain.com npm run build
```

### Hosting Options
- Netlify: Drag & drop `build/` folder
- Vercel: Connect GitHub repo
- GitHub Pages: Configure in `package.json`
- Any static host: Serve files from `build/`

## Further Reading

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com/)

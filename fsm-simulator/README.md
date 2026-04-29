# FSM Simulator - Full-Stack Application

A modern, interactive web application for creating, visualizing, and simulating **Finite State Machines (FSMs)** with support for both **Mealy** and **Moore** machines.

## 🎯 Features

### ✨ Core Functionality
- **Interactive Machine Builder**: Add/edit/delete states and transitions with an intuitive UI
- **Real-time Visualization**: Display FSMs as animated graphs with nodes and edges
- **Step-by-Step Simulation**: Execute input strings and watch transitions happen in real-time
- **Mealy/Moore Support**: Switch between machine types with automatic UI adaptation
- **Machine Library**: Pre-built examples (Traffic Light, Vending Machine, Parity Checker)
- **Save/Load**: Download machines as JSON files
- **Modern UI**: Clean, professional design with Tailwind CSS and Framer Motion animations

### 🔧 Technical Highlights
- **Frontend**: React 18 with functional components and hooks
- **Backend**: Node.js/Express REST API
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth interactions
- **Architecture**: Modular, scalable folder structure with MVC pattern

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd fsm-simulator
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Option 1: Run Both Servers (Recommended)

From the root directory:
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

The application will be available at `http://localhost:3000`
Backend API runs on `http://localhost:5000`

#### Option 2: Just Backend (API Testing)
```bash
cd backend
npm run dev
```

Visit `http://localhost:5000/api/health` to verify the server is running.

---

## 📋 Project Structure

```
fsm-simulator/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Express server entry point
│   │   ├── controllers/
│   │   │   └── machineController.js # Request handlers
│   │   ├── models/
│   │   │   ├── Machine.js           # Machine data model
│   │   │   └── MachineStore.js      # In-memory storage with examples
│   │   ├── services/
│   │   │   └── SimulationService.js # Mealy/Moore simulation logic
│   │   └── routes/
│   │       └── machineRoutes.js     # API route definitions
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.jsx                # React DOM render
│   │   ├── index.css                # Global styles
│   │   ├── components/
│   │   │   ├── Header.jsx           # Top navigation
│   │   │   ├── StateManager.jsx     # State UI
│   │   │   ├── TransitionManager.jsx# Transition UI
│   │   │   ├── SimulationPanel.jsx  # Simulation UI
│   │   │   ├── MachineInfo.jsx      # Machine metadata
│   │   │   ├── GraphVisualization.jsx # SVG graph rendering
│   │   │   ├── MachineLibrary.jsx   # Machine selector
│   │   │   └── Header.jsx           # Header with actions
│   │   ├── hooks/
│   │   │   └── useMachine.js        # Custom React hook for machine state
│   │   ├── services/
│   │   │   └── machineService.js    # API client
│   │   └── utils/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
└── README.md (this file)
```

---

## 💡 Usage Guide

### Creating a Machine

1. Click **"+ New Machine"** in the top-right
2. Enter a name and choose machine type (Moore or Mealy)
3. Add states using the State Manager panel
   - For Moore machines: Add output value per state
   - For Mealy machines: Outputs defined on transitions
4. Set an initial state (green checkmark)
5. Add transitions by specifying: From State → To State + Input (+ Output for Mealy)

### Understanding Machine Types

#### Moore Machine 🟣
- **Output** depends **only** on the current state
- Output is displayed in the state node (e.g., `/stop`, `/go`)
- All transitions with the same input from one state go to the same state

#### Mealy Machine 🟠
- **Output** depends on **both** current state and input
- Output is displayed on transition edges (e.g., `input / output`)
- Same input can produce different outputs depending on current state

### Running a Simulation

1. Enter an **input string** (e.g., `101`, `abc`, `next next next`)
2. Click **"Simulate"**
3. Use **Prev/Next** buttons to step through execution
4. Watch the graph highlight active states and transitions
5. View output at each step

### Working with Examples

The app includes pre-loaded example machines:

- **Traffic Light** (Moore): `red -> yellow -> green -> red`
- **Vending Machine** (Mealy): Demonstrates input/output on transitions
- **Parity Checker** (Mealy): Counts 1's in binary input

Select any example from the **Machine Library** panel on the right.

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Machine CRUD
- `GET /machines` - Get all machines
- `GET /machines/:id` - Get a specific machine
- `POST /machines` - Create a new machine
- `PUT /machines/:id` - Update a machine
- `DELETE /machines/:id` - Delete a machine

#### State Management
- `POST /machines/:id/states` - Add a state
- `DELETE /machines/:id/states` - Remove a state
- `PUT /machines/:id/states/:stateId` - Update state
- `POST /machines/:id/initial-state` - Set initial state

#### Transition Management
- `POST /machines/:id/transitions` - Add a transition
- `DELETE /machines/:id/transitions` - Remove a transition

#### Simulation
- `POST /machines/:id/simulate` - Run simulation on input string

### Example Request

```bash
# Create a Moore machine
curl -X POST http://localhost:5000/api/machines \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My FSM",
    "type": "moore"
  }'

# Add a state
curl -X POST http://localhost:5000/api/machines/{id}/states \
  -H "Content-Type: application/json" \
  -d '{
    "stateId": "q0",
    "output": "initial"
  }'

# Run simulation
curl -X POST http://localhost:5000/api/machines/{id}/simulate \
  -H "Content-Type: application/json" \
  -d '{"input": "101"}'
```

---

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Slate grays with blue/purple accents
- **Typography**: Clean system fonts for legibility
- **Spacing**: Consistent 4px/8px grid
- **Shadows**: Soft, subtle shadows for depth
- **Rounded Corners**: 8-12px border radius

### Layout
- **3-Panel Design**: Builder (left) | Visualization (center) | Simulation (right)
- **Responsive**: Optimized for desktop (tablet support included)
- **Dark Mode Ready**: Easy to add with Tailwind utilities

### Animations
- **Framer Motion**: Smooth component entrance animations
- **State Transitions**: Highlight active states during simulation
- **Hover Effects**: Interactive feedback on buttons and elements

---

## 🧪 Examples

### Example 1: Traffic Light (Moore)

States:
- `red` (output: "stop")
- `yellow` (output: "caution")
- `green` (output: "go")

Transitions:
- `red --next--> green`
- `green --next--> yellow`
- `yellow --next--> red`

Simulation: Input `next, next, next` → Output `stop, caution, go, stop`

### Example 2: Parity Checker (Mealy)

States: `even`, `odd`

Transitions:
- `even --0/0--> even`
- `even --1/0--> odd`
- `odd --0/1--> odd`
- `odd --1/0--> even`

Simulation: Input `101` → Output `010` (parity check)

---

## 🛠️ Development

### Tech Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express, UUID
- **Storage**: In-memory (no database)
- **Build**: Create React App, npm

### Adding Features

#### New Component
1. Create component in `frontend/src/components/`
2. Use Framer Motion for animations
3. Apply Tailwind classes for styling
4. Export from component file

#### New API Endpoint
1. Add route in `backend/src/routes/`
2. Create controller method in `backend/src/controllers/`
3. Update service if needed in `backend/src/services/`

#### New Machine Type
1. Extend `Machine` class in `backend/src/models/Machine.js`
2. Add simulation logic in `SimulationService`
3. Update UI components to show type-specific fields

### Running Tests
```bash
cd backend
npm test

cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Backend not running
- Check if port 5000 is in use: `lsof -i :5000`
- Ensure Node.js version is 16+: `node --version`
- Clear `node_modules` and reinstall: `npm install`

### Frontend not connecting
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check `.env` file has correct API URL
- Browser console may have CORS errors - verify backend CORS settings

### Simulation not working
- Ensure initial state is set (green checkmark in UI)
- Verify all input characters have transitions defined
- Check transitions are from correct states to correct next states

### Machine not saving
- Backend stores machines in memory only (resets on restart)
- Download JSON to save permanently (`⋮ → Download JSON`)
- Machines persist during current session

---

## 📝 Notes

- **No Database**: This app uses in-memory storage. Machines are lost on server restart.
- **For Production**: Replace `MachineStore` with a real database (MongoDB, PostgreSQL, etc.)
- **Export/Import**: Currently supports JSON export only. Import feature can be added.
- **Validation**: Basic validation included; add more for production use.

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🤝 Contributing

Feel free to fork, modify, and enhance this project!

### Ideas for Enhancement:
- [ ] Import machines from JSON
- [ ] Undo/redo functionality
- [ ] Collaborative editing
- [ ] Export as image/PDF
- [ ] Dark mode toggle
- [ ] More example machines
- [ ] Performance optimization for large FSMs
- [ ] Mobile-responsive design improvements
- [ ] Custom styling/themes
- [ ] Machine validation and error checking

---

**Built with ❤️ for FSM learners and educators**

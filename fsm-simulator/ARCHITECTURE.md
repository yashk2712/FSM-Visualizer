# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               React Frontend (Port 3000)                   │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  App.jsx (Main Container)                            │ │  │
│  │  │  ├─ Header (Navigation, New Machine)                │ │  │
│  │  │  ├─ StateManager (Add/Edit States)                 │ │  │
│  │  │  ├─ TransitionManager (Add/Edit Transitions)       │ │  │
│  │  │  ├─ GraphVisualization (SVG FSM Rendering)         │ │  │
│  │  │  ├─ SimulationPanel (Input & Step-through)         │ │  │
│  │  │  ├─ MachineInfo (Metadata)                         │ │  │
│  │  │  └─ MachineLibrary (Load Machines)                 │ │  │
│  │  │                                                      │ │  │
│  │  │  Hooks: useMachine (State Management)               │ │  │
│  │  │  Services: machineService (API Client)              │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↕ HTTP/REST                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Axios (API Client)
                                │
┌─────────────────────────────────────────────────────────────────┐
│                     Express Backend (Port 5000)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Routes (machineRoutes.js)                               │  │
│  │  ├─ POST /machines                                      │  │
│  │  ├─ GET /machines & GET /machines/:id                   │  │
│  │  ├─ PUT /machines/:id                                   │  │
│  │  ├─ DELETE /machines/:id                                │  │
│  │  ├─ POST /machines/:id/states                           │  │
│  │  ├─ POST /machines/:id/transitions                      │  │
│  │  ├─ POST /machines/:id/simulate                         │  │
│  │  └─ ... (other endpoints)                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Controllers (machineController.js)                      │  │
│  │  └─ Handles requests & calls services                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Services                                                 │  │
│  │  ├─ SimulationService (Mealy/Moore simulation logic)     │  │
│  │  └─ (Business logic)                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Models                                                   │  │
│  │  ├─ Machine (FSM data model)                             │  │
│  │  └─ MachineStore (In-memory storage)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Machine

```
1. User clicks "+ New Machine"
   ↓
2. Frontend: Dialog prompts for name & type
   ↓
3. Frontend: POST /api/machines with {name, type}
   ↓
4. Backend Controller: Creates new Machine instance
   ↓
5. Backend Model: New Machine generated with UUID
   ↓
6. Backend Store: Machine saved in memory (MachineStore)
   ↓
7. Response: Machine JSON sent back to frontend
   ↓
8. Frontend: Updated UI with new machine
```

### Adding a State

```
1. User fills "State ID" field in StateManager
   ↓
2. User enters output (if Moore machine)
   ↓
3. User clicks "Add State"
   ↓
4. Frontend: POST /api/machines/:id/states
   ↓
5. Backend Controller: Calls machine.addState()
   ↓
6. Backend Model: State added to machine.states array
   ↓
7. Backend Store: Updated machine stored
   ↓
8. Response: Updated machine sent back
   ↓
9. Frontend: UI refreshed with new state
```

### Running Simulation

```
1. User enters input string (e.g., "101")
   ↓
2. User clicks "Simulate"
   ↓
3. Frontend: POST /api/machines/:id/simulate with {input: "101"}
   ↓
4. Backend Controller: Calls SimulationService.simulate()
   ↓
5. Backend Service: 
   a. Validates initial state exists
   b. Iterates through input string
   c. For each symbol: finds transition, moves to next state
   d. For Moore: outputs current state's output
   e. For Mealy: outputs transition's output
   f. Collects all steps and final output
   ↓
6. Response: {success, steps[], finalState, output}
   ↓
7. Frontend: Displays results in SimulationPanel
   ↓
8. User clicks "Next/Prev" to step through execution
```

## Key Components

### Frontend Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `App.jsx` | Main orchestrator | N/A |
| `Header` | Navigation & actions | machine, onNew, onDelete, onDownload |
| `StateManager` | State CRUD UI | machine, onAdd, onRemove, onSetInitial |
| `TransitionManager` | Transition CRUD UI | machine, onAdd, onRemove |
| `SimulationPanel` | Input & execution | machine, onSimulate, isLoading |
| `GraphVisualization` | SVG FSM rendering | machine, simulationStep |
| `MachineLibrary` | Machine selector | onSelect, currentId |
| `MachineInfo` | Machine details | machine, onToggleType |

### Backend Models

| Model | Purpose | Key Methods |
|-------|---------|-------------|
| `Machine` | FSM data structure | addState, removeState, addTransition, etc. |
| `MachineStore` | In-memory storage | create, read, update, delete, getAll |
| `SimulationService` | Execution engine | simulate, simulateMealy, simulateMoore |

## State Management Strategy

### Frontend
- **Hook-based**: `useMachine` custom hook manages all machine-related state
- **Local State**: Form inputs, UI toggles in individual components
- **API State**: Machine data fetched and cached in hook

### Backend
- **In-Memory**: All machines stored in `MachineStore` Map
- **No Persistence**: Data lost on server restart
- **Single Instance**: All requests use same store instance

## Communication Protocol

### Request Format
```json
{
  "method": "POST",
  "url": "/api/machines/:id/states",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "stateId": "q0",
    "output": "start"
  }
}
```

### Response Format (Success)
```json
{
  "id": "uuid",
  "name": "My FSM",
  "type": "moore",
  "states": [...],
  "transitions": [...],
  "initialState": null,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Response Format (Error)
```json
{
  "error": "Description of error"
}
```

## Scalability Considerations

### Current Limitations
- **In-memory storage**: All data lost on restart
- **No authentication**: Anyone can access/modify machines
- **Single server**: No load balancing or clustering
- **Browser memory**: Large FSMs (100+ states) may impact performance

### To Scale Production

1. **Database**: Replace MachineStore with MongoDB/PostgreSQL
2. **Authentication**: Add JWT/OAuth for user accounts
3. **Caching**: Redis for frequently accessed machines
4. **CDN**: Serve frontend assets from CDN
5. **Microservices**: Separate simulation engine to own service
6. **Load Balancing**: Multiple API instances behind load balancer
7. **WebSockets**: Real-time collaboration features

## Module Dependencies

```
Frontend:
├── React 18 (UI library)
├── Tailwind CSS (styling)
├── Framer Motion (animations)
└── Axios (HTTP client)

Backend:
├── Express (web framework)
├── CORS (cross-origin support)
└── UUID (unique identifiers)

Build Tools:
├── Create React App (frontend build)
├── Webpack (bundler)
├── Babel (JavaScript compiler)
└── Node.js (runtime)
```

## Performance Characteristics

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|-----------------|------------------|-------|
| Add State | O(1) | O(1) | Append to array |
| Remove State | O(n) | O(1) | Filter transitions |
| Add Transition | O(1) | O(1) | Push to array |
| Simulate (Mealy/Moore) | O(m) | O(m) | m = input length |
| Graph Render | O(n+e) | O(n+e) | n = states, e = edges |

## Design Patterns Used

1. **MVC Pattern**: Models, Controllers, Views separated
2. **Service Layer**: Business logic in services
3. **Custom Hooks**: Encapsulate stateful logic
4. **Component Composition**: Reusable components
5. **Fetch Pattern**: All data fetched on demand
6. **Store Pattern**: Centralized data storage (in-memory)

## Extension Points

To add new features:

1. **New Machine Type**: Add to SimulationService
2. **New State Property**: Add to Machine.states model
3. **New Transition Property**: Add to Transition object
4. **New UI Component**: Add to components/ and integrate in App.jsx
5. **New API Endpoint**: Add route, controller, and service method
6. **Database Persistence**: Replace MachineStore class
7. **Authentication**: Add middleware to Express

---

This architecture prioritizes simplicity and clarity for educational purposes while remaining extensible for production use.

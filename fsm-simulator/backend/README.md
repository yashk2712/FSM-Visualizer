# FSM Simulator Backend

REST API server for the FSM Simulator application. Handles all FSM operations including state/transition management and simulation logic.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on `http://localhost:5000`

Entry point: `src/app.js`

## API Documentation

### Health Check
```
GET /api/health
```

### Machines

#### List All Machines
```
GET /api/machines
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "Traffic Light",
    "type": "moore",
    "states": [...],
    "transitions": [...],
    "initialState": "q0",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Machine
```
POST /api/machines
Content-Type: application/json

{
  "name": "My FSM",
  "type": "moore"  // or "mealy"
}
```

#### Get Machine
```
GET /api/machines/:id
```

#### Update Machine
```
PUT /api/machines/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "type": "mealy",
  "states": [...],
  "transitions": [...]
}
```

#### Delete Machine
```
DELETE /api/machines/:id
```

### States

#### Add State
```
POST /api/machines/:id/states
Content-Type: application/json

{
  "stateId": "q0",
  "output": "stop"  // Optional, for Moore machines
}
```

#### Remove State
```
DELETE /api/machines/:id/states
Content-Type: application/json

{
  "stateId": "q0"
}
```

#### Update State
```
PUT /api/machines/:id/states/:stateId
Content-Type: application/json

{
  "output": "new_output",
  "position": { "x": 100, "y": 200 }
}
```

#### Set Initial State
```
POST /api/machines/:id/initial-state
Content-Type: application/json

{
  "stateId": "q0"
}
```

### Transitions

#### Add Transition
```
POST /api/machines/:id/transitions
Content-Type: application/json

{
  "from": "q0",
  "to": "q1",
  "input": "1",
  "output": "x"  // Optional, for Mealy machines
}
```

#### Remove Transition
```
DELETE /api/machines/:id/transitions
Content-Type: application/json

{
  "transitionId": "transition-uuid"
}
```

### Simulation

#### Run Simulation
```
POST /api/machines/:id/simulate
Content-Type: application/json

{
  "input": "101"
}
```

Response (Success):
```json
{
  "success": true,
  "steps": [
    {
      "input": "1",
      "from": "q0",
      "to": "q1",
      "transitionId": "uuid",
      "output": "x"
    },
    ...
  ],
  "finalState": "q1",
  "output": "x0x"
}
```

Response (Error):
```json
{
  "success": false,
  "error": "No transition from state q0 with input '1'",
  "steps": [],
  "partialOutput": "x"
}
```

## Data Models

### Machine
```
{
  id: string (UUID)
  name: string
  type: 'moore' | 'mealy'
  states: State[]
  initialState: string | null
  transitions: Transition[]
  createdAt: Date
  updatedAt: Date
}
```

### State
```
{
  id: string
  output: string | null (Moore machines only)
  position: { x: number, y: number }
}
```

### Transition
```
{
  id: string (UUID)
  from: string (state ID)
  to: string (state ID)
  input: string
  output: string | null (Mealy machines only)
}
```

## In-Memory Storage

The backend uses an in-memory store (`MachineStore`) for persistence:
- Machines are loaded on server startup with 3 pre-built examples
- All changes are kept in memory and lost on server restart
- For production, replace with a real database

### Pre-loaded Examples
1. **Traffic Light** (Moore): Red→Yellow→Green cycle with outputs
2. **Vending Machine** (Mealy): Simple coin/item transaction FSM
3. **Parity Checker** (Mealy): Binary parity checking machine

## Development

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Start production server
npm start
```

## File Structure

```
src/
├── index.js                 # Express app entry point
├── controllers/
│   └── machineController.js # Request handlers
├── models/
│   ├── Machine.js           # FSM data model & methods
│   └── MachineStore.js      # In-memory storage
├── services/
│   └── SimulationService.js # Mealy/Moore simulation engine
└── routes/
    └── machineRoutes.js     # API endpoint definitions
```

## Extending the Backend

### Add a New Route
1. Create a new endpoint in `routes/`
2. Add corresponding controller method in `controllers/`
3. Register route in `index.js`

### Add Database Persistence
1. Install database driver (e.g., `mongoose` for MongoDB)
2. Replace `MachineStore` class with database queries
3. Update error handling as needed

### Add Validation
```javascript
// In controller
if (!stateId || typeof stateId !== 'string') {
  return res.status(400).json({ error: 'Invalid state ID' });
}
```

## Testing

```bash
# Manual API testing with curl
curl http://localhost:5000/api/health

# Or use REST client like Postman, Insomnia, or VS Code REST Client
```

## Performance Notes

- In-memory storage is fast but not scalable
- Consider pagination for large machine lists
- Simulation logic is O(n) where n = input string length
- Graph visualization works well up to ~100 states

## CORS Configuration

Currently allows all origins:
```javascript
app.use(cors());
```

For production, restrict to specific origins:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

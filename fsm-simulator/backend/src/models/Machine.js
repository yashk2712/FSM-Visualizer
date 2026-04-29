import { v4 as uuidv4 } from 'uuid';

export class Machine {
  constructor(name = 'Untitled Machine', type = 'moore') {
    this.id = uuidv4();
    this.name = name;
    this.type = type; // 'moore' or 'mealy'
    this.states = [];
    this.initialState = null;
    this.transitions = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addState(stateId, output = null) {
    if (!this.states.find(s => s.id === stateId)) {
      this.states.push({
        id: stateId,
        output: output, // Only used in Moore machines
        position: { x: 0, y: 0 }
      });
      this.updatedAt = new Date();
    }
  }

  removeState(stateId) {
    this.states = this.states.filter(s => s.id !== stateId);
    this.transitions = this.transitions.filter(
      t => t.from !== stateId && t.to !== stateId
    );
    if (this.initialState === stateId) {
      this.initialState = null;
    }
    this.updatedAt = new Date();
  }

  setInitialState(stateId) {
    if (this.states.find(s => s.id === stateId)) {
      this.initialState = stateId;
      this.updatedAt = new Date();
    }
  }

  addTransition(from, to, input, output = null) {
    // Check if transition already exists
    const exists = this.transitions.some(
      t => t.from === from && t.to === to && t.input === input
    );
    if (!exists) {
      this.transitions.push({
        id: uuidv4(),
        from,
        to,
        input,
        output: output // Only used in Mealy machines
      });
      this.updatedAt = new Date();
    }
  }

  removeTransition(transitionId) {
    this.transitions = this.transitions.filter(t => t.id !== transitionId);
    this.updatedAt = new Date();
  }

  updateState(stateId, output = null, position = null) {
    const state = this.states.find(s => s.id === stateId);
    if (state) {
      if (output !== null) state.output = output;
      if (position) state.position = position;
      this.updatedAt = new Date();
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      states: this.states,
      initialState: this.initialState,
      transitions: this.transitions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(data) {
    const machine = new Machine(data.name, data.type);
    machine.id = data.id;
    machine.states = data.states;
    machine.initialState = data.initialState;
    machine.transitions = data.transitions;
    machine.createdAt = new Date(data.createdAt);
    machine.updatedAt = new Date(data.updatedAt);
    return machine;
  }
}

import { Machine } from '../models/Machine.js';
import { machineStore } from '../models/MachineStore.js';
import { SimulationService } from '../services/SimulationService.js';

export const machineController = {
  // Create a new machine
  create: (req, res) => {
    try {
      const { name = 'Untitled Machine', type = 'moore' } = req.body;
      const machine = new Machine(name, type);
      machineStore.create(machine);
      res.status(201).json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all machines
  getAll: (req, res) => {
    try {
      const machines = machineStore.getAll().map(m => m.toJSON());
      res.json(machines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific machine
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      res.json(machine.toJSON());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a machine
  update: (req, res) => {
    try {
      const { id } = req.params;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }

      const { name, type, states, initialState, transitions } = req.body;
      if (name) machine.name = name;
      if (type) machine.type = type;
      if (states) machine.states = states;
      if (initialState) machine.initialState = initialState;
      if (transitions) machine.transitions = transitions;
      machine.updatedAt = new Date();

      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a machine
  delete: (req, res) => {
    try {
      const { id } = req.params;
      if (!machineStore.read(id)) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machineStore.delete(id);
      res.json({ message: 'Machine deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add a state
  addState: (req, res) => {
    try {
      const { id } = req.params;
      const { stateId, output } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machine.addState(stateId, output);
      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Remove a state
  removeState: (req, res) => {
    try {
      const { id } = req.params;
      const { stateId } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machine.removeState(stateId);
      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Set initial state
  setInitialState: (req, res) => {
    try {
      const { id } = req.params;
      const { stateId } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machine.setInitialState(stateId);
      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Add a transition
  addTransition: (req, res) => {
    try {
      const { id } = req.params;
      const { from, to, input, output } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machine.addTransition(from, to, input, output);
      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Remove a transition
  removeTransition: (req, res) => {
    try {
      const { id } = req.params;
      const { transitionId } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machine.removeTransition(transitionId);
      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a state
  updateState: (req, res) => {
    try {
      const { id } = req.params;
      const { stateId, output, position } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      machine.updateState(stateId, output, position);
      machineStore.update(id, machine);
      res.json(machine.toJSON());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Simulate the machine
  simulate: (req, res) => {
    try {
      const { id } = req.params;
      const { input } = req.body;
      const machine = machineStore.read(id);
      if (!machine) {
        return res.status(404).json({ error: 'Machine not found' });
      }
      const result = SimulationService.simulate(machine, input);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

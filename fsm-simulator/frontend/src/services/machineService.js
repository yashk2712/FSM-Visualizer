import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const machineService = {
  // Fetch all machines
  getAllMachines: () => api.get('/machines'),

  // Fetch a specific machine
  getMachineById: (id) => api.get(`/machines/${id}`),

  // Create a new machine
  createMachine: (name, type) => api.post('/machines', { name, type }),

  // Update a machine
  updateMachine: (id, data) => api.put(`/machines/${id}`, data),

  // Delete a machine
  deleteMachine: (id) => api.delete(`/machines/${id}`),

  // Add a state
  addState: (id, stateId, output) => api.post(`/machines/${id}/states`, { stateId, output }),

  // Remove a state
  removeState: (id, stateId) => api.delete(`/machines/${id}/states`, { data: { stateId } }),

  // Update a state
  updateState: (id, stateId, output, position) => 
    api.put(`/machines/${id}/states/${stateId}`, { output, position }),

  // Set initial state
  setInitialState: (id, stateId) => api.post(`/machines/${id}/initial-state`, { stateId }),

  // Add a transition
  addTransition: (id, from, to, input, output) => 
    api.post(`/machines/${id}/transitions`, { from, to, input, output }),

  // Remove a transition
  removeTransition: (id, transitionId) => 
    api.delete(`/machines/${id}/transitions`, { data: { transitionId } }),

  // Simulate the machine
  simulate: (id, input) => api.post(`/machines/${id}/simulate`, { input }),
};

export default api;

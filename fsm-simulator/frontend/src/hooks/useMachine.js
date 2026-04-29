import { useState, useCallback } from 'react';
import { machineService } from '../services/machineService.js';

export const useMachine = (initialMachineId = null) => {
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMachine = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await machineService.getMachineById(id);
      setMachine(response.data);
    } catch (err) {
      setError(err.message);
      setMachine(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewMachine = useCallback(async (name, type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await machineService.createMachine(name, type);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCurrentMachine = useCallback(async (updates) => {
    if (!machine) return;
    setLoading(true);
    setError(null);
    try {
      const response = await machineService.updateMachine(machine.id, updates);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [machine]);

  const addState = useCallback(async (stateId, output = null) => {
    if (!machine) return;
    try {
      const response = await machineService.addState(machine.id, stateId, output);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [machine]);

  const removeState = useCallback(async (stateId) => {
    if (!machine) return;
    try {
      const response = await machineService.removeState(machine.id, stateId);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [machine]);

  const addTransition = useCallback(async (from, to, input, output = null) => {
    if (!machine) return;
    try {
      const response = await machineService.addTransition(machine.id, from, to, input, output);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [machine]);

  const removeTransition = useCallback(async (transitionId) => {
    if (!machine) return;
    try {
      const response = await machineService.removeTransition(machine.id, transitionId);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [machine]);

  const setInitialState = useCallback(async (stateId) => {
    if (!machine) return;
    try {
      const response = await machineService.setInitialState(machine.id, stateId);
      setMachine(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [machine]);

  const simulate = useCallback(async (input) => {
    if (!machine) return;
    setLoading(true);
    setError(null);
    try {
      const response = await machineService.simulate(machine.id, input);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [machine]);

  return {
    machine,
    setMachine,
    loading,
    error,
    fetchMachine,
    createNewMachine,
    updateCurrentMachine,
    addState,
    removeState,
    addTransition,
    removeTransition,
    setInitialState,
    simulate,
  };
};

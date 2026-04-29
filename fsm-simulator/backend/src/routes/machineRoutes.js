import express from 'express';
import { machineController } from '../controllers/machineController.js';

const router = express.Router();

// CRUD operations
router.post('/', machineController.create);
router.get('/', machineController.getAll);
router.get('/:id', machineController.getById);
router.put('/:id', machineController.update);
router.delete('/:id', machineController.delete);

// State operations
router.post('/:id/states', machineController.addState);
router.delete('/:id/states', machineController.removeState);
router.put('/:id/states/:stateId', machineController.updateState);
router.post('/:id/initial-state', machineController.setInitialState);

// Transition operations
router.post('/:id/transitions', machineController.addTransition);
router.delete('/:id/transitions', machineController.removeTransition);

// Simulation
router.post('/:id/simulate', machineController.simulate);

export default router;

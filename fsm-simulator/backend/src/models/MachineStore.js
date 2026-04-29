import { Machine } from './Machine.js';

export class MachineStore {
  constructor() {
    this.machines = new Map();
    this.initializeExamples();
  }

  initializeExamples() {
    // Example 1: Traffic Light (Moore Machine)
    const trafficLight = new Machine('Traffic Light', 'moore');
    trafficLight.addState('red', 'stop');
    trafficLight.addState('yellow', 'caution');
    trafficLight.addState('green', 'go');
    trafficLight.setInitialState('red');
    trafficLight.addTransition('red', 'green', 'next');
    trafficLight.addTransition('green', 'yellow', 'next');
    trafficLight.addTransition('yellow', 'red', 'next');
    this.machines.set(trafficLight.id, trafficLight);

    // Example 2: Simple Vending Machine (Mealy Machine)
    const vendingMachine = new Machine('Vending Machine', 'mealy');
    vendingMachine.addState('idle');
    vendingMachine.addState('deposit');
    vendingMachine.addState('select');
    vendingMachine.setInitialState('idle');
    vendingMachine.addTransition('idle', 'deposit', 'insertCoin', 'Accept coin');
    vendingMachine.addTransition('deposit', 'select', 'selectItem', 'Item dispensed');
    vendingMachine.addTransition('deposit', 'idle', 'cancel', 'Coin returned');
    vendingMachine.addTransition('select', 'idle', 'complete', 'Transaction done');
    this.machines.set(vendingMachine.id, vendingMachine);

    // Example 3: Parity Checker (Mealy Machine)
    const parityChecker = new Machine('Parity Checker', 'mealy');
    parityChecker.addState('even');
    parityChecker.addState('odd');
    parityChecker.setInitialState('even');
    parityChecker.addTransition('even', 'odd', '1', '0');
    parityChecker.addTransition('even', 'even', '0', '0');
    parityChecker.addTransition('odd', 'even', '1', '0');
    parityChecker.addTransition('odd', 'odd', '0', '1');
    this.machines.set(parityChecker.id, parityChecker);
  }

  create(machine) {
    this.machines.set(machine.id, machine);
    return machine;
  }

  read(id) {
    return this.machines.get(id);
  }

  update(id, machine) {
    if (this.machines.has(id)) {
      this.machines.set(id, machine);
      return machine;
    }
    return null;
  }

  delete(id) {
    return this.machines.delete(id);
  }

  getAll() {
    return Array.from(this.machines.values());
  }

  clear() {
    this.machines.clear();
  }
}

// Singleton instance
export const machineStore = new MachineStore();

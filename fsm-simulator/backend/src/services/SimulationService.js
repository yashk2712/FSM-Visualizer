export class SimulationService {
  /**
   * Simulate a Moore machine
   * Output depends only on the current state
   */
  static simulateMoore(machine, inputString) {
    if (!machine.initialState) {
      return {
        success: false,
        error: 'No initial state defined'
      };
    }

    const steps = [];
    let currentState = machine.initialState;
    const outputs = [];

    for (const input of inputString) {
      // Find transition
      const transition = machine.transitions.find(
        t => t.from === currentState && t.input === input
      );

      if (!transition) {
        return {
          success: false,
          error: `No transition from state ${currentState} with input "${input}"`,
          steps,
          partialOutput: outputs.join('')
        };
      }

      const nextState = transition.to;
      const currentStateObj = machine.states.find(s => s.id === nextState);
      const output = currentStateObj?.output || '';

      steps.push({
        input,
        from: currentState,
        to: nextState,
        transitionId: transition.id,
        output
      });

      outputs.push(output);
      currentState = nextState;
    }

    return {
      success: true,
      steps,
      finalState: currentState,
      output: outputs.join(''),
      finalOutput: machine.states.find(s => s.id === currentState)?.output || ''
    };
  }

  /**
   * Simulate a Mealy machine
   * Output depends on both current state and input
   */
  static simulateMealy(machine, inputString) {
    if (!machine.initialState) {
      return {
        success: false,
        error: 'No initial state defined'
      };
    }

    const steps = [];
    let currentState = machine.initialState;
    const outputs = [];

    for (const input of inputString) {
      // Find transition
      const transition = machine.transitions.find(
        t => t.from === currentState && t.input === input
      );

      if (!transition) {
        return {
          success: false,
          error: `No transition from state ${currentState} with input "${input}"`,
          steps,
          partialOutput: outputs.join('')
        };
      }

      const nextState = transition.to;
      const output = transition.output || '';

      steps.push({
        input,
        from: currentState,
        to: nextState,
        transitionId: transition.id,
        output
      });

      outputs.push(output);
      currentState = nextState;
    }

    return {
      success: true,
      steps,
      finalState: currentState,
      output: outputs.join('')
    };
  }

  /**
   * Main simulation function
   */
  static simulate(machine, inputString) {
    if (machine.type === 'moore') {
      return this.simulateMoore(machine, inputString);
    } else if (machine.type === 'mealy') {
      return this.simulateMealy(machine, inputString);
    } else {
      return {
        success: false,
        error: 'Unknown machine type'
      };
    }
  }
}

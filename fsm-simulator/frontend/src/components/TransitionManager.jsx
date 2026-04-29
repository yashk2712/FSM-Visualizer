import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const TransitionManager = ({ machine, onAddTransition, onRemoveTransition }) => {
  const [fromState, setFromState] = useState('');
  const [toState, setToState] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleAddTransition = (e) => {
    e.preventDefault();
    if (fromState && toState && input) {
      onAddTransition(fromState, toState, input, machine.type === 'mealy' ? output : null);
      setFromState('');
      setToState('');
      setInput('');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Transitions</h3>

      {/* Add Transition Form */}
      <form onSubmit={handleAddTransition} className="space-y-3 bg-slate-50 p-3 rounded-lg">
        <select
          value={fromState}
          onChange={(e) => setFromState(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">From State</option>
          {machine.states && machine.states.map(state => (
            <option key={state.id} value={state.id}>{state.id}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Input (e.g., 0, 1, a, b)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={toState}
          onChange={(e) => setToState(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">To State</option>
          {machine.states && machine.states.map(state => (
            <option key={state.id} value={state.id}>{state.id}</option>
          ))}
        </select>

        {machine.type === 'mealy' && (
          <input
            type="text"
            placeholder="Output (for Mealy machine)"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <button
          type="submit"
          disabled={!fromState || !toState || !input}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Add Transition
        </button>
      </form>

      {/* Transitions List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {machine.transitions && machine.transitions.length > 0 ? (
          machine.transitions.map((transition) => (
            <motion.div
              key={transition.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex-1 text-sm">
                <div className="font-medium text-slate-900">
                  {transition.from} 
                  <span className="mx-2 text-slate-500">→</span>
                  {transition.to}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Input: <span className="font-mono font-semibold">{transition.input}</span>
                  {machine.type === 'mealy' && transition.output && (
                    <> | Output: <span className="font-mono font-semibold">{transition.output}</span></>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemoveTransition(transition.id)}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No transitions yet.</p>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const StateManager = ({ machine, onAddState, onRemoveState, onSetInitial, onUpdateState }) => {
  const [newStateId, setNewStateId] = useState('');
  const [newStateOutput, setNewStateOutput] = useState('');

  const handleAddState = (e) => {
    e.preventDefault();
    if (newStateId.trim()) {
      onAddState(newStateId.trim(), machine.type === 'moore' ? newStateOutput.trim() : null);
      setNewStateId('');
      setNewStateOutput('');
    }
  };

  const handleUpdateOutput = (stateId, output) => {
    onUpdateState(stateId, output);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">States</h3>

      {/* Add State Form */}
      <form onSubmit={handleAddState} className="space-y-3 bg-slate-50 p-3 rounded-lg">
        <input
          type="text"
          placeholder="State ID (e.g., q0, q1)"
          value={newStateId}
          onChange={(e) => setNewStateId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {machine.type === 'moore' && (
          <input
            type="text"
            placeholder="Output (for Moore machine)"
            value={newStateOutput}
            onChange={(e) => setNewStateOutput(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add State
        </button>
      </form>

      {/* States List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {machine.states && machine.states.length > 0 ? (
          machine.states.map((state) => (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-900">{state.id}</span>
                  {state.id === machine.initialState && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">
                      Initial
                    </span>
                  )}
                </div>
                {machine.type === 'moore' && state.output && (
                  <div className="text-xs text-slate-600 mt-1">Output: {state.output}</div>
                )}
              </div>

              <div className="flex gap-2">
                {state.id !== machine.initialState && (
                  <button
                    onClick={() => onSetInitial(state.id)}
                    className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                  >
                    Set Initial
                  </button>
                )}
                {machine.type === 'moore' && (
                  <input
                    type="text"
                    value={state.output || ''}
                    onChange={(e) => handleUpdateOutput(state.id, e.target.value)}
                    placeholder="out"
                    className="w-12 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
                <button
                  onClick={() => onRemoveState(state.id)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No states yet. Add one to get started.</p>
        )}
      </div>
    </div>
  );
};

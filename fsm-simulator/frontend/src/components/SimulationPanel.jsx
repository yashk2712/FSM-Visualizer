import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SimulationPanel = ({ machine, onSimulate, isLoading }) => {
  const [inputString, setInputString] = useState('');
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [error, setError] = useState(null);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setError(null);
    setActiveStep(null);

    if (!machine?.initialState) {
      setError('Please set an initial state first');
      return;
    }

    try {
      const simResult = await onSimulate(inputString);
      setResult(simResult);
      if (simResult.success) {
        setActiveStep(0);
      }
    } catch (err) {
      setError(err.message || 'Simulation failed');
    }
  };

  const handleNextStep = () => {
    if (result?.steps && activeStep !== null && activeStep < result.steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep !== null && activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleReset = () => {
    setInputString('');
    setResult(null);
    setActiveStep(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Simulation</h3>

      {/* Input Form */}
      <form onSubmit={handleSimulate} className="space-y-3 bg-slate-50 p-4 rounded-lg">
        <input
          type="text"
          placeholder={`Enter input string (e.g., 101, abc)`}
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!inputString || isLoading}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running...' : 'Simulate'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Status */}
          <div className={`p-3 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✓ Simulation Successful' : '✗ ' + result.error}
            </p>
          </div>

          {result.success && (
            <>
              {/* Output */}
              <div className="bg-white border border-slate-200 p-3 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">Output</p>
                <p className="font-mono text-sm font-semibold text-slate-900 p-2 bg-slate-50 rounded">
                  {result.output || '(empty)'}
                </p>
              </div>

              {/* Step Navigation */}
              {result.steps && result.steps.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-slate-900">
                      Step {(activeStep ?? 0) + 1} of {result.steps.length}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevStep}
                        disabled={activeStep === 0}
                        className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={activeStep === result.steps.length - 1}
                        className="px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  {/* Current Step Details */}
                  {activeStep !== null && result.steps[activeStep] && (
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-slate-600">Input</p>
                          <p className="font-mono font-semibold text-slate-900">{result.steps[activeStep].input}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">From → To</p>
                          <p className="font-mono font-semibold text-slate-900">
                            {result.steps[activeStep].from} → {result.steps[activeStep].to}
                          </p>
                        </div>
                      </div>
                      {result.steps[activeStep].output !== undefined && (
                        <div>
                          <p className="text-xs text-slate-600">Output</p>
                          <p className="font-mono font-semibold text-slate-900">
                            {result.steps[activeStep].output || '(empty)'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Final State */}
              <div className="bg-white border border-slate-200 p-3 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">Final State</p>
                <p className="font-mono text-sm font-semibold text-slate-900">{result.finalState}</p>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

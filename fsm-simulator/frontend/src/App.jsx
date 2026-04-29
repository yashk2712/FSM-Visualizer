import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header.jsx';
import { StateManager } from './components/StateManager.jsx';
import { TransitionManager } from './components/TransitionManager.jsx';
import { SimulationPanel } from './components/SimulationPanel.jsx';
import { MachineInfo } from './components/MachineInfo.jsx';
import { GraphVisualization } from './components/GraphVisualization.jsx';
import { MachineLibrary } from './components/MachineLibrary.jsx';
import { useMachine } from './hooks/useMachine.js';
import './index.css';

function App() {
  const {
    machine,
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
  } = useMachine();

  const [simulationResult, setSimulationResult] = useState(null);

  // Load initial machine
  useEffect(() => {
    const loadInitialMachine = async () => {
      try {
        // Try to load the first available machine
        const response = await fetch('http://localhost:5000/api/machines');
        const machines = await response.json();
        if (machines.length > 0) {
          fetchMachine(machines[0].id);
        }
      } catch (err) {
        console.error('Failed to load initial machine:', err);
      }
    };

    loadInitialMachine();
  }, [fetchMachine]);

  const handleNewMachine = async () => {
    const name = prompt('Enter machine name:', 'New FSM');
    if (name) {
      const type = window.confirm('Create as Moore machine? (Cancel for Mealy)') ? 'moore' : 'mealy';
      try {
        await createNewMachine(name, type);
        setSimulationResult(null);
      } catch (err) {
        alert('Failed to create machine: ' + err.message);
      }
    }
  };

  const handleDeleteMachine = async () => {
    if (machine && window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await fetch(`http://localhost:5000/api/machines/${machine.id}`, {
          method: 'DELETE',
        });
        setSimulationResult(null);
        // Load another machine
        const response = await fetch('http://localhost:5000/api/machines');
        const machines = await response.json();
        if (machines.length > 0) {
          fetchMachine(machines[0].id);
        }
      } catch (err) {
        alert('Failed to delete machine');
      }
    }
  };

  const handleDownloadJSON = () => {
    if (machine) {
      const dataStr = JSON.stringify(machine, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${machine.name}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleToggleMachineType = async (type) => {
    if (machine && machine.type !== type) {
      try {
        // Reset transitions for different types
        const updatedMachine = {
          ...machine,
          type,
          transitions: machine.transitions.map(t => ({
            ...t,
            output: type === 'mealy' ? t.output : null
          }))
        };
        await updateCurrentMachine(updatedMachine);
        setSimulationResult(null);
      } catch (err) {
        alert('Failed to update machine type');
      }
    }
  };

  const handleSimulate = async (inputString) => {
    try {
      const result = await simulate(inputString);
      setSimulationResult(result);
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleAddState = async (stateId, output) => {
    try {
      await addState(stateId, output);
      setSimulationResult(null);
    } catch (err) {
      alert('Failed to add state: ' + err.message);
    }
  };

  const handleRemoveState = async (stateId) => {
    try {
      await removeState(stateId);
      setSimulationResult(null);
    } catch (err) {
      alert('Failed to remove state: ' + err.message);
    }
  };

  const handleAddTransition = async (from, to, input, output) => {
    try {
      await addTransition(from, to, input, output);
      setSimulationResult(null);
    } catch (err) {
      alert('Failed to add transition: ' + err.message);
    }
  };

  const handleRemoveTransition = async (transitionId) => {
    try {
      await removeTransition(transitionId);
      setSimulationResult(null);
    } catch (err) {
      alert('Failed to remove transition: ' + err.message);
    }
  };

  const handleSetInitialState = async (stateId) => {
    try {
      await setInitialState(stateId);
      setSimulationResult(null);
    } catch (err) {
      alert('Failed to set initial state: ' + err.message);
    }
  };

  const handleUpdateState = async (stateId, output) => {
    if (machine && machine.type === 'moore') {
      try {
        await fetch(`http://localhost:5000/api/machines/${machine.id}/states/${stateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ output }),
        });
        // Refetch the machine
        await fetchMachine(machine.id);
      } catch (err) {
        alert('Failed to update state');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header
        machine={machine}
        onNewMachine={handleNewMachine}
        onDeleteMachine={handleDeleteMachine}
        onDownload={handleDownloadJSON}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Machine Builder */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 bg-white border-r border-slate-200 overflow-y-auto shadow-soft"
        >
          <div className="p-6 space-y-8">
            {machine ? (
              <>
                <MachineInfo machine={machine} onToggleType={handleToggleMachineType} />

                <StateManager
                  machine={machine}
                  onAddState={handleAddState}
                  onRemoveState={handleRemoveState}
                  onSetInitial={handleSetInitialState}
                  onUpdateState={handleUpdateState}
                />

                <TransitionManager
                  machine={machine}
                  onAddTransition={handleAddTransition}
                  onRemoveTransition={handleRemoveTransition}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No machine selected</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Center - Graph Visualization */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-1 p-6 overflow-auto"
        >
          <div className="bg-white rounded-lg shadow-soft h-full p-4">
            {machine ? (
              <GraphVisualization
                machine={machine}
                simulationStep={simulationResult?.steps?.[
                  simulationResult.currentStep ?? 0
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Create or select a machine to visualize</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Sidebar - Simulation & Machine Library */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 bg-white border-l border-slate-200 overflow-y-auto shadow-soft"
        >
          <div className="p-6 space-y-8">
            {machine && (
              <SimulationPanel
                machine={machine}
                onSimulate={handleSimulate}
                isLoading={loading}
              />
            )}

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Machine Library</h3>
              <MachineLibrary
                onSelectMachine={fetchMachine}
                currentMachineId={machine?.id}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}

export default App;

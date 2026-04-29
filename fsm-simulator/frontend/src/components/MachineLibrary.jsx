import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { machineService } from '../services/machineService.js';

export const MachineLibrary = ({ onSelectMachine, currentMachineId }) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await machineService.getAllMachines();
        setMachines(response.data);
      } catch (err) {
        console.error('Failed to fetch machines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  if (loading) {
    return <div className="text-xs text-slate-500">Loading machines...</div>;
  }

  return (
    <div className="space-y-2">
      {machines.length > 0 ? (
        machines.map((machine) => (
          <motion.button
            key={machine.id}
            whileHover={{ x: 4 }}
            onClick={() => onSelectMachine(machine.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              currentMachineId === machine.id
                ? 'bg-blue-100 border-blue-400 shadow-soft'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="font-medium text-sm text-slate-900">{machine.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {machine.type === 'moore' ? '🟣 Moore' : '🟠 Mealy'} • {machine.states?.length || 0} states
            </p>
          </motion.button>
        ))
      ) : (
        <p className="text-xs text-slate-500 text-center py-4">No machines found</p>
      )}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

export const MachineInfo = ({ machine, onToggleType }) => {
  if (!machine) return null;

  return (
    <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
      <div className="space-y-3">
        <div>
          <p className="text-xs text-slate-600 mb-1">Machine Name</p>
          <p className="text-sm font-semibold text-slate-900">{machine.name}</p>
        </div>

        <div>
          <p className="text-xs text-slate-600 mb-1">Machine Type</p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onToggleType('moore')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                machine.type === 'moore'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Moore
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onToggleType('mealy')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                machine.type === 'mealy'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Mealy
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-2 rounded border border-slate-200">
            <p className="text-slate-600">States</p>
            <p className="text-lg font-semibold text-slate-900">{machine.states?.length || 0}</p>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <p className="text-slate-600">Transitions</p>
            <p className="text-lg font-semibold text-slate-900">{machine.transitions?.length || 0}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Updated: {new Date(machine.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

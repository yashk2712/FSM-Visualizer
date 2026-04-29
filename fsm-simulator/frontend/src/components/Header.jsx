import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Header = ({ machine, onNewMachine, onDeleteMachine, onDownload }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white shadow-soft">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FSM Simulator</h1>
          {machine && (
            <p className="text-sm text-slate-600 mt-1">{machine.name}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewMachine}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + New Machine
          </motion.button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ⋮
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50"
              >
                <button
                  onClick={() => {
                    onDownload();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-100 first:rounded-t-lg"
                >
                  Download JSON
                </button>
                {machine && (
                  <button
                    onClick={() => {
                      onDeleteMachine();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg border-t border-slate-200"
                  >
                    Delete Machine
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

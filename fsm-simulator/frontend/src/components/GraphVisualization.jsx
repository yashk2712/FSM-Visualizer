import React, { useEffect, useState } from 'react';

export const GraphVisualization = ({ machine, simulationStep }) => {
  const [nodePositions, setNodePositions] = useState({});

  // Auto-arrange states in a circle
  useEffect(() => {
    if (machine?.states) {
      const positions = {};
      const count = machine.states.length;
      const radius = 120;
      const centerX = 300;
      const centerY = 250;

      machine.states.forEach((state, index) => {
        const angle = (index / count) * 2 * Math.PI;
        positions[state.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });

      setNodePositions(positions);
    }
  }, [machine?.states]);

  if (!machine || !machine.states || machine.states.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-300">
        <p className="text-slate-500 text-sm">Add states to visualize the FSM</p>
      </div>
    );
  }

  const canvasWidth = 600;
  const canvasHeight = 500;

  return (
    <svg width={canvasWidth} height={canvasHeight} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>

      {/* Render transitions (edges) */}
      {machine.transitions && machine.transitions.map((transition) => {
        const fromPos = nodePositions[transition.from];
        const toPos = nodePositions[transition.to];

        if (!fromPos || !toPos) return null;

        const isActive = simulationStep?.transitionId === transition.id;

        if (transition.from === transition.to) {
          // Self-loop
          const loopRadius = 40;
          return (
            <g key={transition.id}>
              <path
                d={`M ${fromPos.x + 30} ${fromPos.y}
                   Q ${fromPos.x + loopRadius} ${fromPos.y - loopRadius}
                     ${fromPos.x + 30} ${fromPos.y - loopRadius * 2}`}
                fill="none"
                stroke={isActive ? '#3b82f6' : '#cbd5e1'}
                strokeWidth={isActive ? 3 : 2}
                markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              />
              <text
                x={fromPos.x + loopRadius + 20}
                y={fromPos.y - loopRadius}
                fontSize="12"
                fill={isActive ? '#3b82f6' : '#475569'}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {transition.input}
              </text>
            </g>
          );
        }

        // Regular edge
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const offsetDist = 35;

        const x1 = fromPos.x + (dx / dist) * offsetDist;
        const y1 = fromPos.y + (dy / dist) * offsetDist;
        const x2 = toPos.x - (dx / dist) * offsetDist;
        const y2 = toPos.y - (dy / dist) * offsetDist;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        return (
          <g key={transition.id}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isActive ? '#3b82f6' : '#cbd5e1'}
              strokeWidth={isActive ? 3 : 2}
              markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
            />
            <text
              x={midX}
              y={midY - 8}
              fontSize="12"
              fill={isActive ? '#3b82f6' : '#475569'}
              fontWeight={isActive ? 'bold' : 'normal'}
              textAnchor="middle"
            >
              {transition.input}
            </text>
            {machine.type === 'mealy' && transition.output && (
              <text
                x={midX}
                y={midY + 8}
                fontSize="11"
                fill={isActive ? '#3b82f6' : '#94a3b8'}
                textAnchor="middle"
                fontStyle="italic"
              >
                /{transition.output}
              </text>
            )}
          </g>
        );
      })}

      {/* Render states (nodes) */}
      {machine.states && machine.states.map((state) => {
        const pos = nodePositions[state.id];
        if (!pos) return null;

        const isInitial = state.id === machine.initialState;
        const isActive = simulationStep?.to === state.id || simulationStep?.from === state.id;

        return (
          <g key={state.id}>
            {/* Initial state arrow */}
            {isInitial && (
              <g>
                <line
                  x1={pos.x - 60}
                  y1={pos.y}
                  x2={pos.x - 35}
                  y2={pos.y}
                  stroke="#059669"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )}

            {/* Node circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="30"
              fill={isActive ? '#dbeafe' : '#ffffff'}
              stroke={
                isActive ? '#3b82f6' : isInitial ? '#059669' : '#cbd5e1'
              }
              strokeWidth={isActive ? 3 : isInitial ? 2 : 2}
            />

            {/* Double circle for final states (if needed) */}
            {state.isFinal && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill="none"
                stroke="#059669"
                strokeWidth="1"
              />
            )}

            {/* State ID */}
            <text
              x={pos.x}
              y={pos.y - 5}
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              fill={isActive ? '#3b82f6' : '#1e293b'}
            >
              {state.id}
            </text>

            {/* Moore output */}
            {machine.type === 'moore' && state.output && (
              <text
                x={pos.x}
                y={pos.y + 12}
                fontSize="10"
                textAnchor="middle"
                fill="#666"
                fontStyle="italic"
              >
                /{state.output}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

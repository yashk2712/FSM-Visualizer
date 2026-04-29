import React, { useEffect, useState, useMemo } from 'react';

export const GraphVisualization = ({ machine, simulationStep }) => {
  const [nodePositions, setNodePositions] = useState({});

  // Auto-arrange states in a circle
  useEffect(() => {
    if (machine?.states) {
      const positions = {};
      const count = machine.states.length;
      const radius = 160; // Increased radius to give more space for edges
      const centerX = 300;
      const centerY = 250;

      machine.states.forEach((state, index) => {
        const angle = (index / count) * 2 * Math.PI - Math.PI / 2; // Start from top
        positions[state.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });

      setNodePositions(positions);
    }
  }, [machine?.states]);

  // Group transitions by source and target
  const groupedTransitions = useMemo(() => {
    if (!machine?.transitions) return [];
    
    const groups = {};
    machine.transitions.forEach(t => {
      const key = `${t.from}-${t.to}`;
      if (!groups[key]) {
        groups[key] = {
          from: t.from,
          to: t.to,
          transitions: [],
          hasReverse: false
        };
      }
      groups[key].transitions.push(t);
    });

    // Check for reverse edges
    Object.values(groups).forEach(group => {
      const reverseKey = `${group.to}-${group.from}`;
      if (groups[reverseKey] && group.from !== group.to) {
        group.hasReverse = true;
      }
    });

    return Object.values(groups);
  }, [machine?.transitions]);

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
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>

      {/* Render grouped transitions (edges) */}
      {groupedTransitions.map((group) => {
        const fromPos = nodePositions[group.from];
        const toPos = nodePositions[group.to];

        if (!fromPos || !toPos) return null;

        // Check if any transition in this group is active
        const isActiveGroup = simulationStep && group.transitions.some(t => t.id === simulationStep.transitionId);
        
        // Combine labels
        const labelText = group.transitions.map(t => {
          if (machine.type === 'mealy' && t.output) {
            return `${t.input}/${t.output}`;
          }
          return t.input;
        }).join(', ');

        const key = `${group.from}-${group.to}`;

        if (group.from === group.to) {
          // Self-loop
          const loopRadius = 35;
          return (
            <g key={key}>
              <path
                d={`M ${fromPos.x + 15} ${fromPos.y - 25}
                   C ${fromPos.x + loopRadius} ${fromPos.y - loopRadius * 2.5},
                     ${fromPos.x - loopRadius} ${fromPos.y - loopRadius * 2.5},
                     ${fromPos.x - 15} ${fromPos.y - 25}`}
                fill="none"
                stroke={isActiveGroup ? '#3b82f6' : '#94a3b8'}
                strokeWidth={isActiveGroup ? 3 : 2}
                markerEnd={isActiveGroup ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              />
              <rect
                x={fromPos.x - (labelText.length * 4) - 4}
                y={fromPos.y - loopRadius * 2 - 12}
                width={labelText.length * 8 + 8}
                height="20"
                fill="rgba(255, 255, 255, 0.85)"
                rx="4"
              />
              <text
                x={fromPos.x}
                y={fromPos.y - loopRadius * 2 + 2}
                fontSize="13"
                fill={isActiveGroup ? '#3b82f6' : '#475569'}
                fontWeight={isActiveGroup ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {labelText}
              </text>
            </g>
          );
        }

        // Regular edge
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Node radius is 30, use 35 as offset to start/end slightly outside the circle
        const nodeRadius = 35; 
        
        // Direction vector
        const dirX = dx / dist;
        const dirY = dy / dist;

        // Normal vector for curve
        const normalX = -dirY;
        const normalY = dirX;

        // If there's a reverse edge, we curve it significantly. If not, just a slight curve for aesthetics.
        const curveOffset = group.hasReverse ? 45 : 20;
        
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;

        const cx = midX + normalX * curveOffset;
        const cy = midY + normalY * curveOffset;

        // Calculate intersection of quadratic bezier curve with the target circle
        // We do a simple approximation by pulling the end point towards cx, cy
        const endDx = toPos.x - cx;
        const endDy = toPos.y - cy;
        const endDist = Math.sqrt(endDx * endDx + endDy * endDy);
        
        const x2 = toPos.x - (endDx / endDist) * nodeRadius;
        const y2 = toPos.y - (endDy / endDist) * nodeRadius;

        const startDx = fromPos.x - cx;
        const startDy = fromPos.y - cy;
        const startDist = Math.sqrt(startDx * startDx + startDy * startDy);

        const x1 = fromPos.x - (startDx / startDist) * nodeRadius;
        const y1 = fromPos.y - (startDy / startDist) * nodeRadius;


        // Text positioning (on the control point)
        const textOffset = group.hasReverse ? curveOffset + 15 : curveOffset + 15;
        const labelX = midX + normalX * textOffset;
        const labelY = midY + normalY * textOffset;

        return (
          <g key={key}>
            <path
              d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
              fill="none"
              stroke={isActiveGroup ? '#3b82f6' : '#94a3b8'}
              strokeWidth={isActiveGroup ? 3 : 2}
              markerEnd={isActiveGroup ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
            />
            <rect
              x={labelX - (labelText.length * 4) - 4}
              y={labelY - 10}
              width={labelText.length * 8 + 8}
              height="20"
              fill="rgba(255, 255, 255, 0.85)"
              rx="4"
            />
            <text
              x={labelX}
              y={labelY + 4}
              fontSize="13"
              fill={isActiveGroup ? '#3b82f6' : '#475569'}
              fontWeight={isActiveGroup ? 'bold' : 'normal'}
              textAnchor="middle"
            >
              {labelText}
            </text>
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
                  x1={pos.x - 70}
                  y1={pos.y}
                  x2={pos.x - 35}
                  y2={pos.y}
                  stroke="#059669"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={pos.x - 55}
                  y={pos.y - 10}
                  fontSize="12"
                  fill="#059669"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  start
                </text>
              </g>
            )}

            {/* Node circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="30"
              fill={isActive ? '#dbeafe' : '#ffffff'}
              stroke={
                isActive ? '#3b82f6' : isInitial ? '#059669' : '#94a3b8'
              }
              strokeWidth={isActive ? 3 : isInitial ? 2 : 2}
              className="transition-colors duration-300"
            />

            {/* Double circle for final states */}
            {state.isFinal && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r="24"
                fill="none"
                stroke={isActive ? '#3b82f6' : isInitial ? '#059669' : '#94a3b8'}
                strokeWidth={isActive ? 2 : 1}
              />
            )}

            {/* State ID */}
            <text
              x={pos.x}
              y={machine.type === 'moore' && state.output ? pos.y - 2 : pos.y + 4}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              fill={isActive ? '#1d4ed8' : '#1e293b'}
            >
              {state.id}
            </text>

            {/* Moore output */}
            {machine.type === 'moore' && state.output && (
              <>
                <line
                  x1={pos.x - 20}
                  y1={pos.y + 6}
                  x2={pos.x + 20}
                  y2={pos.y + 6}
                  stroke={isActive ? '#93c5fd' : '#cbd5e1'}
                  strokeWidth="1"
                />
                <text
                  x={pos.x}
                  y={pos.y + 18}
                  fontSize="11"
                  textAnchor="middle"
                  fill={isActive ? '#1d4ed8' : '#64748b'}
                  fontWeight="bold"
                >
                  {state.output}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

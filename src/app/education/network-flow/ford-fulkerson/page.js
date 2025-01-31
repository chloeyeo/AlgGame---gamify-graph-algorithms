"use client";

import React from "react";
import EducationPageStructure from "@/components/EducationPageStructure";

// Helper functions
const isEdgeInPath = (edge, path) => {
  if (!path || path.length < 2) return false;
  for (let i = 0; i < path.length - 1; i++) {
    if (
      (edge.source === path[i] && edge.target === path[i + 1]) ||
      (edge.source === path[i + 1] && edge.target === path[i])
    ) {
      return true;
    }
  }
  return false;
};

const findPath = (source, sink, edges, flows) => {
  const visited = new Set();
  const path = [];

  const dfs = (node) => {
    if (node === sink) return true;
    visited.add(node);

    for (const edge of edges) {
      const neighbor =
        edge.source === node
          ? edge.target
          : edge.target === node
          ? edge.source
          : null;

      if (!neighbor || visited.has(neighbor)) continue;

      const residualCapacity =
        edge.source === node
          ? edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0)
          : flows.get(`${edge.target}-${edge.source}`) || 0;

      if (residualCapacity > 0) {
        path.push(neighbor);
        if (dfs(neighbor)) return true;
        path.pop();
      }
    }
    return false;
  };

  path.push(source);
  if (dfs(source)) return path;
  return null;
};

const calculateBottleneck = (path, edges, flows) => {
  let bottleneck = Infinity;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const edge = edges.find(
      (e) =>
        (e.source === current && e.target === next) ||
        (e.source === next && e.target === current)
    );

    if (edge) {
      let residualCapacity;
      if (edge.source === current) {
        residualCapacity =
          edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0);
      } else {
        residualCapacity = flows.get(`${edge.target}-${edge.source}`) || 0;
      }
      bottleneck = Math.min(bottleneck, residualCapacity);
    }
  }

  return bottleneck;
};

const updateFlows = (path, bottleneck, flows) => {
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const forwardKey = `${current}-${next}`;
    const backwardKey = `${next}-${current}`;

    const existingForwardFlow = flows.get(forwardKey) || 0;
    const existingBackwardFlow = flows.get(backwardKey) || 0;

    if (existingBackwardFlow > 0) {
      flows.set(backwardKey, existingBackwardFlow - bottleneck);
    } else {
      flows.set(forwardKey, existingForwardFlow + bottleneck);
    }
  }
};

const calculateNodeFlows = (nodes, edges) => {
  return nodes.map((node) => {
    const inFlow = edges
      .filter((e) => e.target === node.id)
      .reduce((sum, e) => sum + (e.flow || 0), 0);

    const outFlow = edges
      .filter((e) => e.source === node.id)
      .reduce((sum, e) => sum + (e.flow || 0), 0);

    return {
      ...node,
      inFlow,
      outFlow,
    };
  });
};

const generateSteps = (initialNodes, initialEdges) => {
  const steps = [];
  const flows = new Map();

  // Initialize flows
  initialEdges.forEach((e) => flows.set(`${e.source}-${e.target}`, 0));

  // Initial state
  steps.push({
    graphState: {
      nodes: calculateNodeFlows(initialNodes, initialEdges),
      edges: initialEdges.map((edge) => ({
        ...edge,
        flow: 0,
        highlight: false,
        residualCapacity: edge.capacity,
      })),
      currentPath: [],
      currentEdge: null,
      maxFlow: 0,
    },
    explanation:
      "Initial state: All flows are zero. Looking for augmenting path.",
    pseudoCodeLines: [1],
  });

  let iteration = 1;
  let path = findPath("E", "C", initialEdges, flows);

  while (path) {
    // First show the found path with all edges in blue
    const pathEdges = initialEdges.map((edge) => ({
      ...edge,
      flow: flows.get(`${edge.source}-${edge.target}`) || 0,
      highlight: isEdgeInPath(edge, path),
      residualCapacity:
        edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0),
    }));

    steps.push({
      graphState: {
        nodes: calculateNodeFlows(initialNodes, pathEdges),
        edges: pathEdges,
        currentPath: path,
        currentEdge: null,
        maxFlow: steps[steps.length - 1].graphState.maxFlow,
      },
      explanation: `Iteration ${iteration}: Found augmenting path ${path.join(
        " → "
      )}`,
      pseudoCodeLines: [2, "a"],
    });

    // Calculate bottleneck for this path
    const bottleneck = calculateBottleneck(path, initialEdges, flows);

    // Then consider each edge in the path one by one
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];

      const currentEdges = initialEdges.map((edge) => ({
        ...edge,
        flow: flows.get(`${edge.source}-${edge.target}`) || 0,
        highlight: isEdgeInPath(edge, path),
        residualCapacity:
          edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0),
      }));

      steps.push({
        graphState: {
          nodes: calculateNodeFlows(initialNodes, currentEdges),
          edges: currentEdges,
          currentPath: path,
          currentEdge: { source: current, target: next },
          maxFlow: steps[steps.length - 1].graphState.maxFlow,
        },
        explanation: `Updating flow along edge ${current} → ${next}`,
        pseudoCodeLines: [2, "c"],
      });

      // Update the flow for this edge
      const edgeKey = `${current}-${next}`;
      const currentFlow = flows.get(edgeKey) || 0;
      flows.set(edgeKey, currentFlow + bottleneck);
    }

    // Show final state after updating all edges in this path
    const updatedEdges = initialEdges.map((edge) => ({
      ...edge,
      flow: flows.get(`${edge.source}-${edge.target}`) || 0,
      highlight: isEdgeInPath(edge, path),
      residualCapacity:
        edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0),
    }));

    steps.push({
      graphState: {
        nodes: calculateNodeFlows(initialNodes, updatedEdges),
        edges: updatedEdges,
        currentPath: path,
        currentEdge: null,
        maxFlow: steps[steps.length - 1].graphState.maxFlow + bottleneck,
      },
      explanation: `Updated all flows along path. Current maximum flow: ${
        steps[steps.length - 1].graphState.maxFlow + bottleneck
      }`,
      pseudoCodeLines: [2],
    });

    // Find next path
    path = findPath("E", "C", initialEdges, flows);
    iteration++;
  }

  // Final state
  const finalEdges = initialEdges.map((edge) => ({
    ...edge,
    flow: flows.get(`${edge.source}-${edge.target}`) || 0,
    highlight: false,
    residualCapacity:
      edge.capacity - (flows.get(`${edge.source}-${edge.target}`) || 0),
  }));

  steps.push({
    graphState: {
      nodes: calculateNodeFlows(initialNodes, finalEdges),
      edges: finalEdges,
      currentPath: [],
      currentEdge: null,
      maxFlow: steps[steps.length - 1].graphState.maxFlow,
    },
    explanation: `Algorithm complete. Maximum flow: ${
      steps[steps.length - 1].graphState.maxFlow
    }`,
    pseudoCodeLines: [3],
  });

  return steps;
};

const generateRandomGraph = (nodeCount = 5) => {
  // Fixed nodes for this specific layout
  const nodes = [
    { id: "A" },
    { id: "B" },
    { id: "C" },
    { id: "D" },
    { id: "E" },
  ];

  // Updated edges to ensure all nodes connect to source (E) and sink (C)
  const edges = [
    { source: "E", target: "D", capacity: 10, flow: 0 },
    { source: "E", target: "A", capacity: 8, flow: 0 },
    { source: "E", target: "B", capacity: 12, flow: 0 },
    { source: "D", target: "C", capacity: 15, flow: 0 },
    { source: "A", target: "C", capacity: 7, flow: 0 }, // New edge
    { source: "B", target: "C", capacity: 9, flow: 0 }, // New edge
    { source: "D", target: "B", capacity: 6, flow: 0 }, // New intermediate edge
    { source: "A", target: "B", capacity: 5, flow: 0 }, // New intermediate edge
  ];

  return { nodes, edges };
};

const NODE_TYPES = {
  SOURCE: { color: "#90EE90" }, // Light green
  SINK: { color: "#FFB6C1" }, // Light pink
  NORMAL: { color: "#FFFFFF" }, // White
};

const EDGE_TYPES = {
  CURRENT_PATH: { color: "#4169E1" }, // Royal blue
  CURRENT_EDGE: { color: "#FF69B4" }, // Hot pink
  NORMAL: { color: "#000000" }, // Black
};

const getEdgeStyle = (edge, graphState) => {
  // Check if this specific edge is the current edge being considered
  const isCurrentEdge =
    graphState?.currentEdge &&
    edge.source === graphState.currentEdge.source &&
    edge.target === graphState.currentEdge.target;

  // Check if this edge is part of the current path
  const isInPath = edge.highlight;

  if (isCurrentEdge) {
    // Current edge being considered - pink and bold
    return {
      color: EDGE_TYPES.CURRENT_EDGE.color,
      marker: "url(#arrowhead-current)",
      width: "3",
    };
  } else if (isInPath) {
    // Part of current path - blue and bold
    return {
      color: EDGE_TYPES.CURRENT_PATH.color,
      marker: "url(#arrowhead-highlighted)",
      width: "3",
    };
  } else {
    // Not part of current path - black and thin
    return {
      color: EDGE_TYPES.NORMAL.color,
      marker: "url(#arrowhead)",
      width: "1.5", // Reduced from 2 to 1.5
    };
  }
};

const FordFulkersonGraphVisualisation = ({ graphState }) => {
  // Adjust node positions to be even more compact vertically
  const nodePositions = {
    E: { x: 400, y: 60 }, // Moved up from y: 80
    D: { x: 200, y: 140 }, // Moved up from y: 160
    A: { x: 600, y: 140 }, // Moved up from y: 160
    B: { x: 400, y: 220 }, // Moved up from y: 240
    C: { x: 200, y: 260 }, // Moved up from y: 280
  };

  const getFlowLabel = (edge) => {
    const flow = edge.flow || 0;
    const capacity = edge.capacity || "undefined";
    return `${flow}/${capacity}`;
  };

  const drawArrowPath = (source, target) => {
    // Calculate the direction vector
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize the vector
    const unitX = dx / length;
    const unitY = dy / length;

    // Calculate start and end points (shortened to make room for arrow)
    const shortenBy = 30;
    const startX = source.x + shortenBy * unitX;
    const startY = source.y + shortenBy * unitY;
    const endX = target.x - shortenBy * unitX;
    const endY = target.y - shortenBy * unitY;

    // Calculate arrow points
    const arrowLength = 10;
    const arrowWidth = 6;

    // Arrow head points
    const tipX = endX;
    const tipY = endY;
    const leftX = endX - arrowLength * unitX + arrowWidth * unitY;
    const leftY = endY - arrowLength * unitY - arrowWidth * unitX;
    const rightX = endX - arrowLength * unitX - arrowWidth * unitY;
    const rightY = endY - arrowLength * unitY + arrowWidth * unitX;

    return {
      line: `M ${startX} ${startY} L ${endX} ${endY}`,
      arrow: `M ${leftX} ${leftY} L ${tipX} ${tipY} L ${rightX} ${rightY}`,
    };
  };

  return (
    <svg width="800" height="300">
      {" "}
      {/* Reduced height from 320 to 300 */}
      <defs>
        {/* Larger, more visible arrow markers */}
        <marker
          id="arrowhead"
          viewBox="0 0 16 16"
          refX="16"
          refY="8"
          markerWidth="12"
          markerHeight="12"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" fill="#64748b" />
        </marker>
        <marker
          id="arrowhead-highlighted"
          viewBox="0 0 16 16"
          refX="16"
          refY="8"
          markerWidth="12"
          markerHeight="12"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" fill="#4169E1" />
        </marker>
        <marker
          id="arrowhead-current"
          viewBox="0 0 16 16"
          refX="16"
          refY="8"
          markerWidth="12"
          markerHeight="12"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" fill="#FF69B4" />
        </marker>
      </defs>
      {/* Move legend higher up */}
      <g transform="translate(20, 10)">
        {" "}
        {/* Adjusted from (50, 20) to (20, 10) */} {/* Node Types */}
        <g transform="translate(0, 0)">
          <circle
            cx="10"
            cy="0"
            r="10"
            fill={NODE_TYPES.SOURCE.color}
            stroke="#64748b"
          />
          <text x="25" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            source node
          </text>
        </g>
        <g transform="translate(0, 25)">
          <circle
            cx="10"
            cy="0"
            r="10"
            fill={NODE_TYPES.SINK.color}
            stroke="#64748b"
          />
          <text x="25" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            sink node
          </text>
        </g>
        <g transform="translate(0, 50)">
          <circle
            cx="10"
            cy="0"
            r="10"
            fill={NODE_TYPES.NORMAL.color}
            stroke="#64748b"
          />
          <text x="25" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            internal node
          </text>
        </g>
        {/* Edge Types with arrows */}
        <g transform="translate(0, 75)">
          <line
            x1="0"
            y1="0"
            x2="40"
            y2="0"
            stroke={EDGE_TYPES.CURRENT_PATH.color}
            strokeWidth="3"
            markerEnd="url(#arrowhead-highlighted)"
          />
          <text x="50" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            current path
          </text>
        </g>
        <g transform="translate(0, 100)">
          <line
            x1="0"
            y1="0"
            x2="40"
            y2="0"
            stroke={EDGE_TYPES.CURRENT_EDGE.color}
            strokeWidth="3"
            markerEnd="url(#arrowhead-current)"
          />
          <text x="50" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            current edge
          </text>
        </g>
        {/* Flow Labels */}
        <g transform="translate(0, 125)">
          <text x="0" y="5" fill="#2563eb" fontSize="14" fontWeight="600">
            in/out: node flow
          </text>
        </g>
      </g>
      {/* Draw edges with arrows */}
      {(graphState?.edges || []).map((edge, idx) => {
        const source = nodePositions[edge.source];
        const target = nodePositions[edge.target];
        const style = getEdgeStyle(edge, graphState);
        const paths = drawArrowPath(source, target);

        return (
          <g key={`edge-${idx}`}>
            {/* Line */}
            <path
              d={paths.line}
              stroke={style.color}
              strokeWidth={style.width}
              fill="none"
            />
            {/* Arrow head */}
            <path d={paths.arrow} fill={style.color} stroke="none" />
            {/* Flow/Capacity label - always horizontal */}
            <g
              transform={`translate(${(source.x + target.x) / 2}, ${
                (source.y + target.y) / 2
              })`}
            >
              <text
                textAnchor="middle"
                dominantBaseline="text-before-edge"
                fill="#1a365d"
                fontSize="18"
                fontWeight="700"
                dy="-12"
              >
                {getFlowLabel(edge)}
              </text>
            </g>
          </g>
        );
      })}
      {/* Draw nodes with closer in/out labels */}
      {Object.entries(nodePositions).map(([id, pos]) => {
        const node = graphState?.nodes?.find((n) => n.id === id);
        const isHighlighted = graphState?.currentPath?.includes(id);
        const nodeType =
          id === "E"
            ? NODE_TYPES.SOURCE
            : id === "C"
            ? NODE_TYPES.SINK
            : NODE_TYPES.NORMAL;

        return (
          <g key={`node-${id}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="25"
              fill={nodeType.color}
              stroke={isHighlighted ? EDGE_TYPES.CURRENT_PATH.color : "#64748b"}
              strokeWidth={isHighlighted ? "3" : "2"}
            />

            {/* Node label */}
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#000"
              fontSize="16"
              fontWeight="500"
            >
              {id}
            </text>

            {/* Flow labels moved closer to node */}
            <text
              x={pos.x + 30} // Reduced from 45 to 30
              y={pos.y - 10}
              textAnchor="start"
              fill="#2563eb"
              fontSize="14"
              fontWeight="600"
            >
              {`in: ${node?.inFlow || 0}`}
            </text>
            <text
              x={pos.x + 30} // Reduced from 45 to 30
              y={pos.y + 10}
              textAnchor="start"
              fill="#2563eb"
              fontSize="14"
              fontWeight="600"
            >
              {`out: ${node?.outFlow || 0}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const FordFulkersonEducationPage = () => {
  const conceptText = {
    introduction: `The Ford-Fulkerson method is a fundamental algorithm for solving the maximum flow problem in a flow network. It works by repeatedly finding augmenting paths from source to sink through any available path-finding strategy. While the basic Ford-Fulkerson method allows for any path-finding approach, a notable improvement called the Edmonds-Karp algorithm specifically uses Breadth-First Search (BFS) to find the shortest augmenting paths.`,
    keyCharacteristics: [
      "Can use any strategy to find augmenting paths (DFS, random, etc.)",
      "Maintains both network and residual graphs",
      "Iteratively increases flow along found paths",
      "Terminates when no augmenting path exists",
      "Runtime varies based on path selection strategy",
      "Edmonds-Karp variation uses BFS for O(VE²) complexity guarantee",
      "Flow Equilibrium: At each node (except source and sink), inflow equals outflow",
    ],
    applications: [
      "Network routing optimization",
      "Bandwidth allocation in telecommunications",
      "Supply chain management",
      "Traffic flow systems",
      "Pipeline distribution networks",
    ],
  };

  const pseudocode = `FORD-FULKERSON Algorithm:
1. Initialize all flows to zero
2. While there exists an augmenting path from source to sink:
   a. Find augmenting path
   b. Calculate bottleneck capacity
   c. Update flows along the path
3. Return total flow when no path exists`;

  // Create initial graph state
  const initialGraph = generateRandomGraph();
  const initialSteps = generateSteps(initialGraph.nodes, initialGraph.edges);

  return (
    <EducationPageStructure
      title="Ford-Fulkerson Algorithm"
      conceptText={conceptText}
      pseudocode={pseudocode}
      generateSteps={() => initialSteps}
      generateNewGraph={generateRandomGraph}
      GraphVisualisationComponent={FordFulkersonGraphVisualisation}
      initialGraphState={initialGraph}
      explanationPosition="top"
    />
  );
};

export default FordFulkersonEducationPage;

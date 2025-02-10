export const isEdgeInPath = (edge, path) => {
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

export const findPath = (source, sink, edges, flows) => {
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

export const calculateBottleneck = (path, edges, flows) => {
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

export const FordFulkersonGraphVisualisation = ({ graphState }) => {
  const drawArrowPath = (source, target) => {
    // Calculate the direction vector
    console.log("target:", target);
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
    <svg width="100%" height="100%" viewBox="0 0 700 500">
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 16 16"
          refX="8"
          refY="8"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" fill="#64748b" />
        </marker>
        <marker
          id="arrowhead-highlighted"
          viewBox="0 0 16 16"
          refX="8"
          refY="8"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" fill="#4169E1" />
        </marker>
        <marker
          id="arrowhead-current"
          viewBox="0 0 16 16"
          refX="8"
          refY="8"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 16 8 L 0 16 z" fill="#FF69B4" />
        </marker>
      </defs>
      <g transform="translate(30, 12)">
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
        <g transform="translate(0, 75)">
          <line
            x1="0"
            y1="0"
            x2="30"
            y2="0"
            stroke={EDGE_TYPES.CURRENT_PATH.color}
            strokeWidth="2"
            markerEnd="url(#arrowhead-highlighted)"
          />
          <text x="40" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            current path
          </text>
        </g>
        <g transform="translate(0, 100)">
          <line
            x1="0"
            y1="0"
            x2="30"
            y2="0"
            stroke={EDGE_TYPES.CURRENT_EDGE.color}
            strokeWidth="2"
            markerEnd="url(#arrowhead-current)"
          />
          <text x="40" y="5" fill="#1a365d" fontSize="14" fontWeight="600">
            current edge
          </text>
        </g>
        <g transform="translate(0, 125)">
          <text x="0" y="5" fill="#2563eb" fontSize="14" fontWeight="600">
            in/out: node flow
          </text>
        </g>
      </g>
      <g transform="translate(0, 0)">
        {(graphState?.edges || []).map((edge, idx) => {
          const source = graphState?.nodes?.find((n) => n.id === edge.source);
          const target = graphState?.nodes?.find((n) => n.id === edge.target);
          const style = getEdgeStyle(edge);
          const paths = drawArrowPath(source, target);

          return (
            <g key={`edge-${idx}`}>
              <path
                d={paths.line}
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                fill="none"
              />
              <path d={paths.arrow} fill={style.stroke} stroke="none" />
              <g
                transform={`translate(${(source.x + target.x) / 2}, ${
                  (source.y + target.y) / 2
                })`}
              >
                <rect
                  x="-20"
                  y="-20"
                  width="40"
                  height="25"
                  fill="white"
                  fillOpacity="0.7"
                  rx="4"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#1a365d"
                  fontSize="16"
                  fontWeight="700"
                >
                  {getEdgeLabel(edge)}
                </text>
              </g>
            </g>
          );
        })}
        {(graphState?.nodes || []).map(({ id, ...pos }) => {
          const node = graphState?.nodes?.find((n) => n.id === id);
          const isHighlighted = graphState?.currentPath?.includes(id);
          // const nodeType =
          //   id === "E"
          //     ? NODE_TYPES.SOURCE
          //     : id === "C"
          //     ? NODE_TYPES.SINK
          //     : NODE_TYPES.NORMAL;
          const nodeType =
            id === "S"
              ? NODE_TYPES.SOURCE
              : id === "T"
              ? NODE_TYPES.SINK
              : NODE_TYPES.NORMAL;

          return (
            <g key={`node-${id}`}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill={nodeType.color}
                stroke={
                  isHighlighted ? EDGE_TYPES.CURRENT_PATH.color : "#64748b"
                }
                strokeWidth={isHighlighted ? "3" : "2"}
              />
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
              <text
                x={pos.x}
                y={pos.y - 35}
                textAnchor="middle"
                fill="#2563eb"
                fontSize="14"
                fontWeight="600"
              >
                {`in: ${node?.inFlow || 0}`}
              </text>
              <text
                x={pos.x}
                y={pos.y + 35}
                textAnchor="middle"
                fill="#2563eb"
                fontSize="14"
                fontWeight="600"
              >
                {`out: ${node?.outFlow || 0}`}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export const generateRandomGraph = (nodeCount = 6, edgeDensity = 0.4) => {
  const nodes = [];
  const width = 700;
  const height = 560;
  const padding = 100;
  const centerX = width / 2;
  const centerY = height / 2;

  // Place source and sink with more spacing
  nodes.push({ id: "S", x: padding, y: centerY });
  nodes.push({ id: "T", x: width - padding, y: centerY });

  // Generate other nodes in a semi-random circular layout
  const innerNodes = nodeCount - 2;
  for (let i = 0; i < innerNodes; i++) {
    // Base angle for even distribution + random offset
    const baseAngle = (2 * Math.PI * i) / innerNodes;
    const randomOffset = (Math.random() - 0.5) * (Math.PI / innerNodes);
    const angle = baseAngle + randomOffset;

    // Randomize radius within a range to prevent nodes from forming perfect circle
    const minRadius = (height - 2 * padding) / 2.5;
    const maxRadius = (height - 2 * padding) / 2;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);

    nodes.push({
      id: String.fromCharCode(65 + i),
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  // Generate edges
  const edges = [];
  const maxCapacity = 15;

  // Helper function to add edge if it doesn't exist
  const addEdge = (source, target) => {
    if (
      !edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
      )
    ) {
      edges.push({
        source,
        target,
        capacity: Math.floor(Math.random() * maxCapacity) + 1,
        flow: 0,
      });
    }
  };

  /** to generate a graph with a guaranteed path from source to sink
   * i.e. all nodes are connected to the source and the sink
   */

  // Step 1: Ensure every node is reachable from source
  const nonSourceSinkNodes = nodes
    .filter((n) => n.id !== "S" && n.id !== "T")
    .map((n) => n.id);

  // Randomly connect source to some nodes
  const numSourceConnections = Math.max(
    2,
    Math.floor(nonSourceSinkNodes.length / 2)
  );
  const shuffledForSource = [...nonSourceSinkNodes].sort(
    () => Math.random() - 0.5
  );
  shuffledForSource.slice(0, numSourceConnections).forEach((nodeId) => {
    addEdge("S", nodeId);
  });

  // Step 2: Ensure every node can reach sink
  const numSinkConnections = Math.max(
    2,
    Math.floor(nonSourceSinkNodes.length / 2)
  );
  const shuffledForSink = [...nonSourceSinkNodes].sort(
    () => Math.random() - 0.5
  );
  shuffledForSink.slice(0, numSinkConnections).forEach((nodeId) => {
    addEdge(nodeId, "T");
  });

  // Step 3: Connect intermediate nodes
  nonSourceSinkNodes.forEach((node1, i) => {
    nonSourceSinkNodes.forEach((node2, j) => {
      if (i !== j && Math.random() < edgeDensity) {
        addEdge(node1, node2);
      }
    });
  });

  // Step 4: Ensure connectivity by creating paths from source to sink
  const unconnectedToSource = nonSourceSinkNodes.filter(
    (id) => !edges.some((e) => e.source === "S" && e.target === id)
  );

  const unconnectedToSink = nonSourceSinkNodes.filter(
    (id) => !edges.some((e) => e.source === id && e.target === "T")
  );

  // Connect any unconnected nodes through intermediate nodes
  unconnectedToSource.forEach((id) => {
    const connectedNode = nonSourceSinkNodes.find((n) =>
      edges.some((e) => e.source === "S" && e.target === n)
    );
    if (connectedNode) addEdge(connectedNode, id);
  });

  unconnectedToSink.forEach((id) => {
    const connectedNode = nonSourceSinkNodes.find((n) =>
      edges.some((e) => e.source === n && e.target === "T")
    );
    if (connectedNode) addEdge(id, connectedNode);
  });
  return { nodes, edges };
};

export const NODE_TYPES = {
  SOURCE: { color: "#90EE90" }, // Light green
  SINK: { color: "#FFB6C1" }, // Light pink
  NORMAL: { color: "#FFFFFF" }, // White
};

export const EDGE_TYPES = {
  CURRENT_PATH: { color: "#4169E1" }, // Royal blue
  CURRENT_EDGE: { color: "#FF69B4" }, // Hot pink
  NORMAL: { color: "#000000" }, // Black
};

export const getEdgeStyle = (edge) => ({
  stroke:
    edge.state === "current path"
      ? "#4285F4" // Blue for current path
      : edge.currentEdge
      ? "#E91E63" // Pink for current edge (matching legend)
      : "#999", // Default gray
  strokeWidth: edge.state === "current path" || edge.currentEdge ? 2 : 1,
  strokeDasharray: edge.state === "current path" ? "5,5" : "none",
});

export const calculateNodeFlows = (nodes, edges) => {
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

export const getEdgeLabel = (edge) => {
  const flow = edge.flow || 0;
  // Always show flow/capacity format
  return `${Math.abs(flow)}/${edge.capacity}`;
};

export const generateEdgeFlowOptions = (totalFlow) => {
  const currentEdge = getCurrentEdgeFromPath();
  if (!currentEdge) return [];

  const edge = graphState.edges.find(
    (e) =>
      (e.source === currentEdge.source && e.target === currentEdge.target) ||
      (e.source === currentEdge.target && e.target === currentEdge.source)
  );

  if (!edge) return [];

  const currentFlow = edge.flow || 0;
  const capacity = edge.capacity || 0;

  // Calculate the correct new flow value
  const correctFlow = Math.min(currentFlow + totalFlow, capacity);

  // Generate options including the correct flow value
  const options = [
    correctFlow,
    Math.max(0, correctFlow - 2),
    Math.min(capacity, Math.max(0, correctFlow + 2)),
    currentFlow,
  ];

  // Ensure capacity is always included as an option if it's the correct answer
  if (correctFlow === capacity && !options.includes(capacity)) {
    options.push(capacity);
  }

  return [...new Set(options)]
    .filter((flow) => flow >= 0 && flow <= capacity)
    .sort((a, b) => a - b);
};

"use client";

import EducationPageStructure from "@/components/EducationPageStructure";

const astarConceptText = {
  introduction:
    "A* (A-star) is a graph traversal and path search algorithm that combines features of uniform-cost search and pure heuristic search to efficiently find the optimal path between a start node and a goal node in a weighted graph.",
  keyCharacteristics: [
    "Uses a best-first search approach",
    "Employs both the actual cost from the start (g(n)) and a heuristic estimate to the goal (h(n))",
    "Evaluates nodes based on f(n) = g(n) + h(n)",
    "Guarantees the optimal path if the heuristic is admissible and consistent",
    "More efficient than Dijkstra's algorithm in many cases due to heuristic guidance",
  ],
  applications: [
    "Pathfinding in video games and robotics",
    "Route planning in GPS navigation systems",
    "Solving puzzles and problems in artificial intelligence",
    "Logistics and supply chain optimization",
  ],
};

const astarPseudocode = `function A_Star(start, goal, h):
    openSet := {start}
    cameFrom := an empty map
    gScore := map with default value of Infinity
    gScore[start] := 0
    fScore := map with default value of Infinity
    fScore[start] := h(start)

    while openSet is not empty:
        current := node in openSet with the lowest fScore value
        if current = goal:
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        for each neighbor of current:
            tentative_gScore := gScore[current] + d(current, neighbor)
            if tentative_gScore < gScore[neighbor]:
                cameFrom[neighbor] := current
                gScore[neighbor] := tentative_gScore
                fScore[neighbor] := gScore[neighbor] + h(neighbor)
                if neighbor not in openSet:
                    openSet.Add(neighbor)`;

const roundToTwo = (num) => {
  if (num === Infinity) return "∞";
  if (isNaN(num)) return "∞";
  return Number(Math.round(num + "e2") + "e-2");
};

const generateAStarSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const gScore = new Map();
  const fScore = new Map();
  const cameFrom = new Map();
  const openSet = new Set([initialNodes[0].id]);

  // Calculate heuristic (Manhattan distance to last node)
  const goalNode = initialNodes[initialNodes.length - 1];
  const calculateHeuristic = (node) => {
    return Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);
  };

  // Initialize scores
  initialNodes.forEach((node) => {
    gScore.set(node.id, node.id === initialNodes[0].id ? 0 : Infinity);
    const h = calculateHeuristic(node);
    fScore.set(node.id, node.id === initialNodes[0].id ? h : Infinity);
  });

  // Initial state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        g: roundToTwo(gScore.get(node.id)),
        h: roundToTwo(calculateHeuristic(node)),
        f: roundToTwo(fScore.get(node.id)),
        recentlyUpdated: false,
      })),
      edges,
      currentNode: null,
    },
    explanation:
      "Initial state: Start node initialized with g=0, others with Infinity",
    pseudoCodeLines: [2],
  });

  // Initialize maps
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        g: roundToTwo(gScore.get(node.id)),
        h: roundToTwo(calculateHeuristic(node)),
        f: roundToTwo(fScore.get(node.id)),
        recentlyUpdated: false,
      })),
      edges,
      currentNode: null,
    },
    explanation: "Initializing distance maps",
    pseudoCodeLines: [4, 5, 6, 7],
  });

  while (openSet.size > 0) {
    // Finding current node
    let current = null;
    let lowestFScore = Infinity;

    openSet.forEach((nodeId) => {
      if (fScore.get(nodeId) < lowestFScore) {
        lowestFScore = fScore.get(nodeId);
        current = nodeId;
      }
    });

    if (
      (current === goalNode.id && visited.size === initialNodes.length - 1) ||
      !current ||
      fScore.get(current) === Infinity
    ) {
      // Goal reached or no path possible
      visited.add(current);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            g: roundToTwo(gScore.get(node.id)),
            h: roundToTwo(calculateHeuristic(node)),
            f: roundToTwo(fScore.get(node.id)),
            recentlyUpdated: false,
            current: node.id === current,
          })),
          edges,
          currentNode: current,
        },
        explanation:
          current === goalNode.id
            ? "Goal reached! A* algorithm complete."
            : "No path to goal possible!",
        pseudoCodeLines: current === goalNode.id ? [10, 11] : [31, 32],
      });
      break;
    }

    openSet.delete(current);
    visited.add(current);

    // Process current node
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
          g: roundToTwo(gScore.get(node.id)),
          h: roundToTwo(calculateHeuristic(node)),
          f: roundToTwo(fScore.get(node.id)),
          recentlyUpdated: false,
          current: node.id === current,
        })),
        edges,
        currentNode: current,
      },
      explanation: `Removing node ${current} from open set and adding to closed set`,
      pseudoCodeLines: [12, 13],
    });

    // Before processing neighbors
    steps.push({
      graphState: {
        nodes: initialNodes.map((node) => ({
          ...node,
          visited: visited.has(node.id),
          g: roundToTwo(gScore.get(node.id)),
          h: roundToTwo(calculateHeuristic(node)),
          f: roundToTwo(fScore.get(node.id)),
          recentlyUpdated: false,
          current: node.id === current,
        })),
        edges,
        currentNode: current,
      },
      explanation: `Finding neighbors of node ${current}`,
      pseudoCodeLines: [14],
    });

    // Process neighbors
    const neighbors = edges
      .filter((edge) => edge.source === current || edge.target === current)
      .map((edge) => ({
        id: edge.source === current ? edge.target : edge.source,
        weight: edge.weight,
      }));

    for (const neighbor of neighbors) {
      const tentativeGScore = gScore.get(current) + neighbor.weight;

      if (tentativeGScore < gScore.get(neighbor.id)) {
        cameFrom.set(neighbor.id, current);
        gScore.set(neighbor.id, tentativeGScore);
        const h = calculateHeuristic(
          initialNodes.find((n) => n.id === neighbor.id)
        );
        fScore.set(neighbor.id, tentativeGScore + h);
        openSet.add(neighbor.id);

        steps.push({
          graphState: {
            nodes: initialNodes.map((node) => ({
              ...node,
              visited: visited.has(node.id),
              g: roundToTwo(gScore.get(node.id)),
              h: roundToTwo(calculateHeuristic(node)),
              f: roundToTwo(fScore.get(node.id)),
              recentlyUpdated: node.id === neighbor.id,
              current: node.id === current,
            })),
            edges,
            currentNode: current,
          },
          explanation: `Calculating new path to ${neighbor.id} through ${current}`,
          pseudoCodeLines: [15],
        });

        steps.push({
          graphState: {
            nodes: initialNodes.map((node) => ({
              ...node,
              visited: visited.has(node.id),
              g: roundToTwo(gScore.get(node.id)),
              h: roundToTwo(calculateHeuristic(node)),
              f: roundToTwo(fScore.get(node.id)),
              recentlyUpdated: node.id === neighbor.id,
              current: node.id === current,
            })),
            edges,
            currentNode: current,
          },
          explanation: `Updated node ${neighbor.id}: g=${roundToTwo(
            tentativeGScore
          )}, f=${roundToTwo(fScore.get(neighbor.id))}`,
          pseudoCodeLines: [16, 17, 18, 19, 20],
        });

        // When adding new node to openSet
        if (!openSet.has(neighbor.id)) {
          steps.push({
            graphState: {
              nodes: initialNodes.map((node) => ({
                ...node,
                visited: visited.has(node.id),
                g: roundToTwo(gScore.get(node.id)),
                h: roundToTwo(calculateHeuristic(node)),
                f: roundToTwo(fScore.get(node.id)),
                recentlyUpdated: node.id === neighbor.id,
                current: node.id === current,
              })),
              edges,
              currentNode: current,
            },
            explanation: `Adding new node ${neighbor.id} to open set`,
            pseudoCodeLines: [21],
          });
        }
      }
    }

    // At the end, before returning steps
    if (current === goalNode.id) {
      // Reconstruct and highlight path
      const path = [];
      let currentPath = current;
      while (currentPath) {
        path.unshift(currentPath);
        currentPath = cameFrom.get(currentPath);
      }

      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            g: roundToTwo(gScore.get(node.id)),
            h: roundToTwo(calculateHeuristic(node)),
            f: roundToTwo(fScore.get(node.id)),
            recentlyUpdated: false,
            current: node.id === current,
            inPath: path.includes(node.id),
          })),
          edges,
          currentNode: current,
        },
        explanation: "Reconstructing shortest path from start to goal",
        pseudoCodeLines: [22, 23],
      });
    }
  }

  return steps;
};

export default function AStarEducationPage() {
  return (
    <EducationPageStructure
      title="A* Algorithm"
      conceptText={astarConceptText}
      pseudocode={astarPseudocode}
      generateSteps={generateAStarSteps}
    />
  );
}

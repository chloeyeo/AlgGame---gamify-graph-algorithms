"use client";

import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false, distance: 0, recentlyUpdated: false },
    { id: "B", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "C", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "D", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "E", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "F", visited: false, distance: Infinity, recentlyUpdated: false },
    { id: "G", visited: false, distance: Infinity, recentlyUpdated: false },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 3 },
    { source: "B", target: "E", weight: 1 },
    { source: "C", target: "F", weight: 5 },
    { source: "D", target: "G", weight: 2 },
    { source: "E", target: "G", weight: 3 },
    { source: "F", target: "G", weight: 1 },
  ],
  currentNode: null,
};

// Helper function to find the unvisited node with the smallest distance
const findUnvisitedNodeWithSmallestDistance = (nodes) => {
  let smallestDistance = Infinity;
  let nodesWithSmallestDistance = [];

  nodes.forEach((node) => {
    if (!node.visited) {
      if (node.distance < smallestDistance) {
        smallestDistance = node.distance;
        nodesWithSmallestDistance = [node.id];
      } else if (node.distance === smallestDistance) {
        nodesWithSmallestDistance.push(node.id);
      }
    }
  });

  return {
    nodeId: nodesWithSmallestDistance[0] || null,
    tiedNodes: nodesWithSmallestDistance,
  };
};

// Helper function to get neighboring nodes and their weights
const getNeighbors = (nodeId, edges) => {
  return edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => ({
      id: edge.target,
      weight: edge.weight,
    }));
};

// Helper function to update distances of neighboring nodes
const updateNeighborDistances = (currentNodeId, nodes, edges) => {
  const currentNode = nodes.find((n) => n.id === currentNodeId);
  const neighbors = getNeighbors(currentNodeId, edges);

  return nodes.map((node) => {
    if (node.visited) return node;

    const neighborInfo = neighbors.find((n) => n.id === node.id);
    if (neighborInfo) {
      const newDistance = currentNode.distance + neighborInfo.weight;
      if (newDistance < node.distance) {
        return {
          ...node,
          distance: newDistance,
          recentlyUpdated: true,
        };
      }
    }
    return { ...node, recentlyUpdated: false };
  });
};

export default function DijkstraGamePage() {
  const isValidMove = (currentState, selectedNodeId) => {
    const newState = {
      ...currentState,
      nodes: [...currentState.nodes],
      edges: [...currentState.edges],
    };

    // Handle first move - must start from node A
    if (currentState.currentNode === null) {
      if (selectedNodeId !== "A") {
        return {
          newState: currentState,
          validMove: false,
          nodeStatus: "invalid_start",
        };
      }

      // Initialize starting node A and update its neighbors
      newState.currentNode = "A";
      newState.nodes = updateNeighborDistances(
        "A",
        newState.nodes.map((node) =>
          node.id === "A" ? { ...node, visited: true } : node
        ),
        newState.edges
      );

      return {
        newState,
        validMove: true,
        nodeStatus: "start",
        extra: {
          updatedNodes: newState.nodes
            .filter((node) => node.recentlyUpdated)
            .map((node) => ({
              id: node.id,
              distance: node.distance,
            })),
        },
      };
    }

    // Get the correct next node according to Dijkstra's algorithm
    const { nodeId: correctNextNode, tiedNodes } =
      findUnvisitedNodeWithSmallestDistance(currentState.nodes);

    // If no unvisited nodes remain, the game is complete
    if (correctNextNode === null) {
      return {
        newState: currentState,
        validMove: false,
        nodeStatus: "game_complete",
      };
    }

    // Check if selected node is correct
    if (selectedNodeId !== correctNextNode) {
      const selectedNode = currentState.nodes.find(
        (n) => n.id === selectedNodeId
      );
      const correctNode = currentState.nodes.find(
        (n) => n.id === correctNextNode
      );

      // Add null checks to prevent accessing properties of undefined nodes
      if (!selectedNode || !correctNode) {
        return {
          newState: currentState,
          validMove: false,
          nodeStatus: "error",
          extra: {
            message: "Invalid node selection",
          },
        };
      }

      // Check if selected node has same distance but wasn't chosen due to tie-breaking
      const isTiedNode =
        tiedNodes.length > 1 && tiedNodes.includes(selectedNodeId);

      return {
        newState: currentState,
        validMove: false,
        nodeStatus: isTiedNode ? "wrong_node_tied" : "wrong_node",
        extra: {
          selectedDistance: selectedNode.distance,
          correctDistance: correctNode.distance,
          selectedId: selectedNodeId,
          correctId: correctNextNode,
          tiedNodes: isTiedNode ? tiedNodes : null,
        },
      };
    }

    // Mark the selected node as visited and update its neighbors
    newState.currentNode = selectedNodeId;
    newState.nodes = updateNeighborDistances(
      selectedNodeId,
      newState.nodes.map((node) =>
        node.id === selectedNodeId ? { ...node, visited: true } : node
      ),
      newState.edges
    );

    return {
      newState,
      validMove: true,
      nodeStatus: "correct",
      extra: {
        updatedNodes: newState.nodes
          .filter((node) => node.recentlyUpdated)
          .map((node) => ({
            id: node.id,
            distance: node.distance,
          })),
      },
    };
  };

  const getNodeStatus = (graphState, nodeId) => {
    const node = graphState.nodes.find((n) => n.id === nodeId);
    if (!node) return "unknown";
    if (node.visited) return "visited";
    if (node.recentlyUpdated) return "updated";
    return "unvisited";
  };

  const getScore = (nodeStatus) => {
    const scoreMap = {
      start: 10,
      correct: 15,
      wrong_node: -5,
      wrong_node_tied: -5,
      invalid_start: -10,
      error: 0,
    };
    return scoreMap[nodeStatus] || 0;
  };

  const getMessage = (nodeStatus, nodeId, extra) => {
    const messages = {
      start: () => {
        let message = `Perfect! We start at node A with distance 0.`;
        if (extra?.updatedNodes?.length > 0) {
          message += `\n\nI've updated the distances of A's neighbors:`;
          extra.updatedNodes.forEach((node) => {
            message += `\n• Node ${node.id}: new distance = ${node.distance}`;
          });
        }
        message += `\n\nNext, look for the unvisited node with the smallest current distance.`;
        return message;
      },

      correct: () => {
        let message = `Excellent choice! Node ${nodeId} had the smallest distance among unvisited nodes.`;
        if (extra?.updatedNodes?.length > 0) {
          message += `\n\nI've updated the distances of ${nodeId}'s unvisited neighbors:`;
          extra.updatedNodes.forEach((node) => {
            message += `\n• Node ${node.id}: new distance = ${node.distance}`;
          });
        } else {
          message += "\n\nNo neighbor distances needed updating this time.";
        }
        message +=
          "\n\nNow, find the next unvisited node with the smallest current distance!";
        return message;
      },

      wrong_node: () =>
        `Not quite! You selected node ${extra.selectedId} with distance ${extra.selectedDistance}, 
         but node ${extra.correctId} has a smaller distance (${extra.correctDistance}). 
         In Dijkstra's algorithm, we always choose the unvisited node with the smallest current distance. 
         Try again!`,

      wrong_node_tied: () =>
        `Almost! While node ${extra.selectedId} does have the same distance (${extra.selectedDistance}) as node ${extra.correctId}, 
         when there are ties, we consistently choose the first node in alphabetical order to break the tie. 
         In this case, that means we should choose node ${extra.correctId} first.
         \n\nThis is an implementation detail - in a real Dijkstra's algorithm implementation, 
         we could choose any of the tied nodes and still get correct results.`,

      invalid_start: `We must start at node A! In Dijkstra's algorithm, we always begin at the source node, 
         which has an initial distance of 0. All other nodes start with infinite distance. 
         Please click node A to begin.`,

      error: "An error occurred. Please try again.",

      game_complete: `Congratulations! You've successfully completed Dijkstra's algorithm! 
                     You've found the shortest path distances from node A to all other nodes in the graph.`,
    };

    return typeof messages[nodeStatus] === "function"
      ? messages[nodeStatus]()
      : messages[nodeStatus] || messages.error;
  };

  const isGameComplete = (graphState) => {
    return graphState.nodes.every((node) => node.visited);
  };

  return (
    <GamePageStructure
      title="Dijkstra's Algorithm Game"
      initialGraphState={initialGraphState}
      isValidMove={isValidMove}
      getNodeStatus={getNodeStatus}
      getScore={getScore}
      getMessage={getMessage}
      isGameComplete={isGameComplete}
    />
  );
}

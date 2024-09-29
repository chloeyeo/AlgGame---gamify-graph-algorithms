import GamePageStructure from "@/components/GamePageStructure";

const initialGraphState = {
  nodes: [
    { id: "A", visited: false },
    { id: "B", visited: false },
    { id: "C", visited: false },
    { id: "D", visited: false },
    { id: "E", visited: false },
    { id: "F", visited: false },
    { id: "G", visited: false },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "D" },
    { source: "B", target: "E" },
    { source: "C", target: "F" },
    { source: "D", target: "G" },
  ],
  currentNode: null,
};

function DFSGamePage() {
  return (
    <GamePageStructure
      title="DFS Traversal Game"
      initialGraphState={initialGraphState}
    />
  );
}

export default DFSGamePage;

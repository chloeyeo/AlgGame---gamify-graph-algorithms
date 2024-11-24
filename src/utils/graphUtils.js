export const getNetworkFlowNodePositions = () => ({
  S: { x: 100, y: 250 },
  A: { x: 300, y: 100 },
  B: { x: 500, y: 100 },
  C: { x: 300, y: 400 },
  D: { x: 500, y: 400 },
  T: { x: 700, y: 250 },
});

export const getDefaultNodes = () => [
  { id: "A", x: 300, y: 50 },
  { id: "B", x: 200, y: 200 },
  { id: "C", x: 400, y: 200 },
  { id: "D", x: 130, y: 350 },
  { id: "E", x: 270, y: 350 },
  { id: "F", x: 470, y: 350 },
  { id: "G", x: 80, y: 500 },
];

export const getDFSGameNodes = [
  {
    // Graph A
    A: { x: 300, y: 50 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 130, y: 350 },
    E: { x: 270, y: 350 },
    F: { x: 470, y: 350 },
    G: { x: 80, y: 500 },
  },
  {
    // Caterpillar (Graph B)
    A: { x: 600, y: 200 },
    B: { x: 100, y: 200 },
    C: { x: 200, y: 200 },
    D: { x: 300, y: 200 },
    E: { x: 400, y: 200 },
    F: { x: 100, y: 300 },
    G: { x: 200, y: 300 },
    H: { x: 300, y: 300 },
  },
  {
    // Star (Graph C)
    A: { x: 300, y: 250 },
    B: { x: 300, y: 150 },
    C: { x: 400, y: 250 },
    D: { x: 300, y: 350 },
    E: { x: 200, y: 250 },
    F: { x: 400, y: 350 },
  },
  {
    // Diamond (Graph D)
    A: { x: 300, y: 100 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 300, y: 300 },
    E: { x: 250, y: 300 },
    F: { x: 350, y: 300 },
    G: { x: 450, y: 300 },
  },
  {
    // Cycle (Graph E)
    A: { x: 300, y: 100 },
    B: { x: 400, y: 175 },
    C: { x: 400, y: 275 },
    D: { x: 300, y: 350 },
    E: { x: 200, y: 275 },
    F: { x: 200, y: 175 },
  },
  {
    // Disconnected (Graph F)
    A: { x: 50, y: 200 },
    B: { x: 150, y: 200 },
    C: { x: 250, y: 200 },
    D: { x: 400, y: 200 },
    E: { x: 500, y: 200 },
    F: { x: 600, y: 200 },
  },
  {
    // Complete graph (Graph G)
    A: { x: 300, y: 100 },
    B: { x: 200, y: 200 },
    C: { x: 400, y: 200 },
    D: { x: 300, y: 300 },
    E: { x: 250, y: 300 },
    F: { x: 350, y: 300 },
    G: { x: 450, y: 300 },
  },
];

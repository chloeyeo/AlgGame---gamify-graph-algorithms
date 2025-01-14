class Node {
  constructor({
    id,
    x = 0,
    y = 0,
    visited = false,
    backtracked = false,
    distance = Infinity,
    weight = 0,
    recentlyUpdated = false,
    current = false,
    component = null,
    levelMap = {},
  }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.visited = visited;
    this.backtracked = backtracked;
    this.distance = distance;
    this.weight = weight;
    this.recentlyUpdated = recentlyUpdated;
    this.current = current;
    this.component = component;
    this.levelMap = levelMap;
    this.adjacentNodes = new Set();
  }

  addAdjacentNode(nodeId) {
    this.adjacentNodes.add(nodeId);
  }

  removeAdjacentNode(nodeId) {
    this.adjacentNodes.delete(nodeId);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setVisited(visited) {
    this.visited = visited;
  }

  setBacktracked(backtracked) {
    this.backtracked = backtracked;
  }

  setCurrent(current) {
    this.current = current;
  }

  setDistance(distance) {
    this.distance = distance;
  }

  setComponent(component) {
    this.component = component;
  }

  reset() {
    this.visited = false;
    this.backtracked = false;
    this.distance = Infinity;
    this.recentlyUpdated = false;
    this.current = false;
    this.component = null;
    this.levelMap = {};
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      visited: this.visited,
      backtracked: this.backtracked,
      distance: this.distance,
      weight: this.weight,
      recentlyUpdated: this.recentlyUpdated,
      current: this.current,
      component: this.component,
      levelMap: this.levelMap,
    };
  }
}

export default Node;

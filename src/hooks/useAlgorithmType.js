export const useAlgorithmType = (pathname) => {
  if (!pathname) {
    return {
      isDijkstraPage: false,
      isAStarPage: false,
      isKruskalsPage: false,
      isPrimsPage: false,
      isDFSPage: false,
      isFordFulkersonPage: false,
      isEdmondsKarpPage: false,
    };
  }

  const path = String(pathname || "");

  return {
    isDijkstraPage: path.includes("dijkstras"),
    isAStarPage: path.includes("astar"),
    isKruskalsPage: path.includes("kruskals"),
    isPrimsPage: path.includes("prims"),
    isDFSPage: path.includes("dfs"),
    isFordFulkersonPage: path.includes("ford-fulkerson"),
    isEdmondsKarpPage: path.includes("edmonds-karp"),
  };
};

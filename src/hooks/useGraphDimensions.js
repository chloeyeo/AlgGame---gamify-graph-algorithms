export const useGraphDimensions = (pathname) => {
  const path = String(pathname || ""); // Convert to string and provide default value

  const isEdmondsKarpPage = path.includes("edmonds-karp");
  const isFordFulkersonPage = path.includes("ford-fulkerson");
  const isKruskalsPage = path.includes("kruskals");

  const viewBoxWidth =
    isEdmondsKarpPage || isFordFulkersonPage ? 800 : isKruskalsPage ? 800 : 600;
  const viewBoxHeight = isEdmondsKarpPage || isFordFulkersonPage ? 500 : 600;

  return { viewBoxWidth, viewBoxHeight };
};

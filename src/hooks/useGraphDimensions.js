export const useGraphDimensions = (isFordFulkersonPage, isKruskalsPage) => {
  const viewBoxWidth = isFordFulkersonPage ? 800 : isKruskalsPage ? 800 : 800;
  const viewBoxHeight = isFordFulkersonPage ? 500 : 600;

  return { viewBoxWidth, viewBoxHeight };
};

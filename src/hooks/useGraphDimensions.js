export const useGraphDimensions = (isFordFulkersonPage, isKruskalsPage) => {
  const viewBoxWidth = isFordFulkersonPage ? 600 : isKruskalsPage ? 800 : 800;
  const viewBoxHeight = isFordFulkersonPage ? 380 : 600;

  return { viewBoxWidth, viewBoxHeight };
};

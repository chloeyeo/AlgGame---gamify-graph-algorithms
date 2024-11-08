export const useGraphDimensions = (
  isEdmondsKarpPage,
  isFordFulkersonPage,
  isKruskalsPage
) => {
  const viewBoxWidth =
    isEdmondsKarpPage || isFordFulkersonPage ? 800 : isKruskalsPage ? 800 : 1200;
  const viewBoxHeight = isEdmondsKarpPage || isFordFulkersonPage ? 500 : 600;

  return { viewBoxWidth, viewBoxHeight };
};

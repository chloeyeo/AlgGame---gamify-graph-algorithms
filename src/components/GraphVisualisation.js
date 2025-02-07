import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  memo,
} from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { useAlgorithmType } from "@/hooks/useAlgorithmType";
import { COLORS } from "@/constants/colors";
import { useGraphDimensions } from "@/hooks/useGraphDimensions";
import Legend from "@/components/Legend/Legend";
import {
  getDefaultNodes,
  getDFSGameNodes,
  getNetworkFlowNodePositions,
  getDijkstraNodes,
  getKruskalEducationGraphNodes,
  getNodesForGraph,
} from "@/utils/graphUtils";
import { usePathname } from "next/navigation";
import Edges from "@/components/Edges/Edge";
import Nodes from "@/components/Nodes/Node";
import { useRouter } from "next/navigation";

// Memoized Legend component
const MemoizedLegend = memo(
  ({
    svg,
    isDFSPage,
    isAStarPage,
    isDijkstraPage,
    isFordFulkersonPage,
    isKruskalsPage,
    isPrimsPage,
  }) => {
    return Legend({
      svg,
      isDFSPage,
      isAStarPage,
      isDijkstraPage,
      isFordFulkersonPage,
      isKruskalsPage,
      isPrimsPage,
    });
  }
);
MemoizedLegend.displayName = "MemoizedLegend";

const GraphVisualisation = ({
  graphState,
  onNodeClick,
  isGraphA,
  graphIndex = 0,
}) => {
  const [render, setRender] = useState(0);
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const svgRef = useRef(null);
  const divRef = useRef(null);
  const pathname = usePathname();
  const {
    isAStarPage,
    isDFSPage,
    isBFSPage,
    isDijkstraPage,
    isFordFulkersonPage,
    isKruskalsPage,
    isPrimsPage,
  } = useAlgorithmType(pathname);

  const { viewBoxWidth, viewBoxHeight } = useGraphDimensions(
    isFordFulkersonPage,
    isKruskalsPage
  );

  // get width and height of svg
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const router = useRouter();

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Initialize SVG first
    let xOffset = -(viewBoxWidth + 100) / 10;
    if (isKruskalsPage) {
      xOffset = -80;
    }

    svg
      .attr("viewBox", `${xOffset} -30 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", "100%")
      .attr("height", "100%");

    // Now it's safe to get dimensions
    const bbox = svg.node()?.getBoundingClientRect();
    if (bbox) {
      setWidth(bbox.width);
      setHeight(bbox.height);
    }
  }, [viewBoxWidth, viewBoxHeight, isKruskalsPage]);

  useEffect(() => {
    if (!graphState) return;

    const svg = d3.select(svgRef.current);

    // First render - add legend
    if (render === 0) {
      <MemoizedLegend
        svg={svg}
        isDFSPage={isDFSPage}
        isAStarPage={isAStarPage}
        isDijkstraPage={isDijkstraPage}
        isFordFulkersonPage={isFordFulkersonPage}
        isKruskalsPage={isKruskalsPage}
        isPrimsPage={isPrimsPage}
      />;
    }

    // Remove all elements except legend and its children
    svg.selectAll("g:not(.legend, .legend *)").remove();

    setRender(render + 1);

    let nodes = graphState.nodes.map((node) => ({
      ...node,
      x: node.x || 0,
      y: node.y || 0,
    }));

    const links = graphState.edges;

    Edges.draw(svg, links, nodes, graphState, {
      isKruskalsPage,
      isPrimsPage,
      isDijkstraPage,
      isAStarPage,
      isFordFulkersonPage,
      isDFSPage,
      isBFSPage,
      COLORS,
      onNodeClick,
      graphIndex,
    });

    Nodes.draw(svg, nodes, graphState, {
      isFordFulkersonPage,
      isDijkstraPage,
      isAStarPage,
      isDFSPage,
      isBFSPage,
      isKruskalsPage: pathname.includes("kruskals"),
      isPrimsPage: pathname.includes("prims"),
      COLORS,
      onNodeClick,
      graphIndex,
    });
  }, [
    graphState,
    isGraphA,
    selectedAlgorithm,
    onNodeClick,
    COLORS,
    isAStarPage,
    isDFSPage,
    isBFSPage,
    isDijkstraPage,
    isKruskalsPage,
    isPrimsPage,
    pathname,
  ]);

  const getNodeColor = (node) => {
    if (node.id === graphState.activeNeighbor) return "#FFE082"; // Highlight checking neighbor
    if (node.id === graphState.currentNode) return "#4CAF50"; // Current - Green
    if (node.backtracked) return "#FFA726"; // Backtracked - Orange
    if (node.visited) return "#42A5F5"; // Visited - Blue
    return "#FFFFFF"; // Unvisited - White
  };

  const getTextColor = (node) => {
    // Text should be white for all colored nodes, black for unvisited (white) nodes
    const bgColor = getNodeColor(node);
    return bgColor === "#FFFFFF" ? "#000000" : "#FFFFFF";
  };

  return (
    <div
      ref={divRef}
      className="w-full h-full flex justify-center items-center overflow-auto no-scrollbar"
    >
      <div className="px-4 w-fit h-full overflow-hidden overflow-x-auto no-scrollbar">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default GraphVisualisation;

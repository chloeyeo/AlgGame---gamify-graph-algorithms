import * as d3 from "d3";

const Nodes = {
  draw: (
    svg,
    nodes,
    graphState,
    {
      isFordFulkersonPage,
      isDijkstraPage,
      isAStarPage,
      isDFSPage,
      isBFSPage,
      COLORS,
      onNodeClick,
    }
  ) => {
    // Draw nodes
    const nodeGroups = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      });

    nodeGroups
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", isFordFulkersonPage ? 25 : 35)
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return COLORS.CURRENT_NODE;
        if (node && node.backtracked) return COLORS.BACKTRACKED_NODE;
        if (node && node.visited) return COLORS.VISITED_NODE;
        if (node && node.recentlyUpdated) return COLORS.UPDATED_NODE;
        if (isFordFulkersonPage) {
          return d.id === "S"
            ? COLORS.SOURCE_NODE
            : d.id === "T"
            ? COLORS.SINK_NODE
            : COLORS.UNVISITED_NODE;
        }
        return COLORS.UNVISITED_NODE;
      })
      .attr("stroke", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return COLORS.CURRENT_NODE;
        if (node && node.backtracked) return COLORS.BACKTRACKED_NODE;
        if (node && node.visited) return COLORS.VISITED_NODE;
        if (isFordFulkersonPage) {
          return graphState.currentPath?.includes(d.id)
            ? COLORS.FLOW_PATH
            : "#64748b";
        }
        return COLORS.UNVISITED_BORDER;
      })
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease");

    // Enhanced node labels
    nodeGroups
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.id)
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return getTextColor(node, graphState, COLORS);
      });

    if (isFordFulkersonPage) {
      nodeGroups.attr("fill", "#000").text((d) => d.id);
    }

    if (isDijkstraPage) {
      nodeGroups
        .append("text")
        .attr("class", "distance-label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 47)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => {
          const node = graphState.nodes.find((n) => n.id === d.id);
          return node.distance === Infinity ? "∞" : node.distance;
        })
        .attr("font-size", "20px")
        .attr("fill", COLORS.DISTANCE_LABEL)
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px")
        .attr("paint-order", "stroke");
    }

    if (isAStarPage) {
      nodeGroups.each(function (d) {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (
          node &&
          (node.f !== undefined || node.g !== undefined || node.h !== undefined)
        ) {
          d3.select(this)
            .append("text")
            .attr("class", "astar-label")
            .attr("x", d.x)
            .attr("y", d.y + 45)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(
              `f=${node.f === Infinity ? "∞" : node.f}
               g=${node.g === Infinity ? "∞" : node.g}
               h=${node.h === Infinity ? "∞" : node.h}`.trim()
            )
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", COLORS.DISTANCE_LABEL)
            .attr("stroke", "white")
            .attr("stroke-width", "1px")
            .attr("paint-order", "stroke");
        }
      });
    }

    if (isFordFulkersonPage) {
      nodeGroups
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 25)
        .attr("fill", (d) => {
          if (d.id === "S") return COLORS.SOURCE_NODE;
          if (d.id === "T") return COLORS.SINK_NODE;
          return graphState.currentPath?.includes(d.id)
            ? COLORS.FLOW_PATH
            : COLORS.UNVISITED_NODE;
        })
        .attr("stroke", (d) =>
          graphState.currentPath?.includes(d.id) ? COLORS.FLOW_PATH : "#64748b"
        )
        .attr("stroke-width", 2);

      // Add text labels for nodes
      nodeGroups
        .append("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("class", "text-sm font-medium")
        .text((d) => d.id);
    }
  },
};

const getTextColor = (node, graphState, COLORS) => {
  if (node.id === graphState.currentNode) return "#FFFFFF"; // Current - Green bg
  if (node.backtracked) return "#FFFFFF"; // Backtracked - Orange bg
  if (node.visited) return "#FFFFFF"; // Visited - Blue bg
  return "#000000"; // Unvisited - White bg
};

export default Nodes;

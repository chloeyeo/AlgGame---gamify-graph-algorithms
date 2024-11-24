import { COLORS } from "@/constants/colors";

const Legend = ({
  svg,
  isAStarPage,
  isDFSPage,
  isDijkstraPage,
  isEdmondsKarpPage,
  isFordFulkersonPage,
  isKruskalsPage,
  isPrimsPage,
}) => {
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(-80, 10)");

  const getLegendItems = () => {
    let commonItems = [];

    // Only add Current Node for non-Kruskal's and non-Prim's algorithms
    if (!isKruskalsPage && !isPrimsPage) {
      commonItems.push({ color: COLORS.CURRENT_NODE, text: "Current Node" });
    }

    // Add other common items
    commonItems.push(
      { color: COLORS.VISITED_NODE, text: "Visited Node" },
      {
        isUnvisited: true,
        text: "Unvisited Node",
      }
    );

    if (isFordFulkersonPage || isEdmondsKarpPage) {
      commonItems = [
        { color: COLORS.SOURCE_NODE, text: "Source Node" },
        { color: COLORS.SINK_NODE, text: "Sink Node" },
        { color: COLORS.FLOW_PATH, text: "Current Flow Path" },
        { isText: true, text: "Edge numbers show flow/capacity" },
      ];
    }

    if (isDFSPage) {
      commonItems.push({
        color: COLORS.BACKTRACKED_NODE,
        text: "Backtracked Node",
      });
    }

    if (isDijkstraPage || isAStarPage) {
      commonItems.push({
        color: COLORS.UPDATED_NODE,
        text: "Recently Updated Node",
      });
    }

    if (isKruskalsPage || isPrimsPage) {
      commonItems.push({ color: COLORS.EDGE_MST, text: "MST Edge" });
    }

    if (isDijkstraPage || isAStarPage || isKruskalsPage || isPrimsPage) {
      commonItems.push({
        isText: true,
        text: "Edge numbers represent weights",
      });
    }

    if (isDijkstraPage) {
      commonItems.push({
        isText: true,
        text: "Node values show shortest distance from start",
      });
    }

    if (isAStarPage) {
      commonItems.push({
        isText: true,
        text: "Node values show f, g, and h costs",
      });
    }

    return commonItems;
  };

  const legendItems = getLegendItems();

  legendItems.forEach((item, i) => {
    const legendItem = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 25})`);

    if (item.isText) {
      legendItem
        .append("text")
        .attr("x", 0)
        .attr("y", 15)
        .text(item.text)
        .attr("fill", "#000")
        .attr("font-size", "12px")
        .attr("font-style", "italic");
    } else if (item.isUnvisited) {
      // outer black box
      legendItem
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 1);

      // Add inner white rectangle with red border
      legendItem
        .append("rect")
        .attr("x", 2)
        .attr("y", 2)
        .attr("width", 16)
        .attr("height", 16)
        .attr("fill", COLORS.UNVISITED_NODE)
        .attr("stroke", COLORS.UNVISITED_BORDER)
        .attr("stroke-width", 2);

      // Add text next to rectangle
      legendItem
        .append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text(item.text)
        .attr("fill", "#000")
        .attr("font-size", "12px");
    } else {
      // Add colored rectangle
      legendItem
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", item.color)
        .attr("stroke", "#000")
        .attr("stroke-width", 1);

      // Add text next to rectangle
      legendItem
        .append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text(item.text)
        .attr("fill", "#000")
        .attr("font-size", "12px");
    }
  });
  return null; // This component only handles D3 rendering
};

export default Legend;

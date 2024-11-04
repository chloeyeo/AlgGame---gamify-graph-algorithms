import { useEffect } from "react";
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
  const getLegendItems = () => {
    let items = [];

    if (!isKruskalsPage && !isPrimsPage) {
      items.push({ color: COLORS.CURRENT_NODE, text: "Current Node" });
    }

    items.push(
      { color: COLORS.VISITED_NODE, text: "Visited Node" },
      { isUnvisited: true, text: "Unvisited Node" }
    );

    if (isFordFulkersonPage || isEdmondsKarpPage) {
      items = [
        { color: COLORS.SOURCE_NODE, text: "Source Node" },
        { color: COLORS.SINK_NODE, text: "Sink Node" },
        { color: COLORS.FLOW_PATH, text: "Current Flow Path" },
        { isText: true, text: "Edge numbers show flow/capacity" },
      ];
    }

    if (isDFSPage) {
      items.push({
        color: COLORS.BACKTRACKED_NODE,
        text: "Backtracked Node",
      });
    }

    if (isDijkstraPage || isAStarPage) {
      items.push({
        color: COLORS.UPDATED_NODE,
        text: "Recently Updated Node",
      });
    }

    if (isKruskalsPage || isPrimsPage) {
      items.push({ color: COLORS.EDGE_MST, text: "MST Edge" });
    }

    if (isDijkstraPage || isAStarPage || isKruskalsPage || isPrimsPage) {
      items.push({
        isText: true,
        text: "Edge numbers represent weights",
      });
    }

    if (isDijkstraPage) {
      items.push({
        isText: true,
        text: "Node values show shortest distance from start",
      });
    }

    if (isAStarPage) {
      items.push({
        isText: true,
        text: "Node values show f, g, and h costs",
      });
    }

    return items;
  };

  useEffect(() => {
    if (!svg) return;

    const items = getLegendItems();

    items.forEach((item, i) => {
      const legendItem = svg
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
        // Outer black box
        legendItem
          .append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-width", 1);

        // Inner white rectangle with red border
        legendItem
          .append("rect")
          .attr("x", 2)
          .attr("y", 2)
          .attr("width", 16)
          .attr("height", 16)
          .attr("fill", COLORS.UNVISITED_NODE)
          .attr("stroke", COLORS.UNVISITED_BORDER)
          .attr("stroke-width", 2);

        // Text next to rectangle
        legendItem
          .append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(item.text)
          .attr("fill", "#000")
          .attr("font-size", "12px");
      } else {
        // Colored rectangle
        legendItem
          .append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", item.color)
          .attr("stroke", "#000")
          .attr("stroke-width", 1);

        // Text next to rectangle
        legendItem
          .append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(item.text)
          .attr("fill", "#000")
          .attr("font-size", "12px");
      }
    });

    // Cleanup function
    return () => {
      svg.remove();
    };
  }, [
    svg,
    isDijkstraPage,
    isAStarPage,
    isKruskalsPage,
    isPrimsPage,
    isDFSPage,
    isFordFulkersonPage,
    isEdmondsKarpPage,
  ]);

  return null; // This component only handles D3 rendering
};

export default Legend;

const Legend = ({ svg, isDFSPage }) => {
  const legendData = [
    { color: "#4CAF50", text: "Current Node" },
    { color: "#42A5F5", text: "Visited Node" },
    { color: "#FFFFFF", text: "Unvisited Node" },
    { color: "#FFA726", text: "Backtracked Node" },
  ];

  const draw = (svg) => {
    const legendGroup = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(10, 10)");

    const entries = legendGroup
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    // Add colored rectangles
    entries
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d) => d.color)
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Add text labels
    entries
      .append("text")
      .attr("x", 30)
      .attr("y", 15)
      .text((d) => d.text)
      .attr("font-size", "12px");
  };

  return null; // This component doesn't render anything directly
};

export default Legend;

import React, { useEffect } from "react";
import * as d3 from "d3";

const GraphVisualisation = () => {
  useEffect(() => {
    const svg = d3
      .select("#graph")
      .attr("viewBox", "0 0 600 600")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", "100%");

    const nodes = [
      { id: "A", x: 300, y: 50 },
      { id: "B", x: 200, y: 200 },
      { id: "C", x: 400, y: 200 },
      { id: "D", x: 150, y: 350 },
      { id: "E", x: 250, y: 350 },
      { id: "F", x: 450, y: 350 },
      { id: "G", x: 100, y: 500 },
    ];

    const links = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
      { source: "B", target: "E" },
      { source: "C", target: "F" },
      { source: "D", target: "G" },
    ];

    // Draw links with thicker stroke
    svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", (d) => nodes.find((n) => n.id === d.source).x)
      .attr("y1", (d) => nodes.find((n) => n.id === d.source).y)
      .attr("x2", (d) => nodes.find((n) => n.id === d.target).x)
      .attr("y2", (d) => nodes.find((n) => n.id === d.target).y)
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    // Draw nodes with toggleable color
    const circles = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 35)
      .attr("fill", "white")
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    // Add labels with toggleable color
    const labels = svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.id)
      .style("font-size", "18px")
      .style("fill", "black"); // Initial text color

    // Add click event for toggling background and text color
    circles.on("click", function (event, d) {
      const circle = d3.select(this);
      const currentColor = circle.attr("fill");
      const newColor = currentColor === "white" ? "blue" : "white";
      const newTextColor = newColor === "blue" ? "white" : "black";

      // Update circle color
      circle.attr("fill", newColor);

      // Update corresponding text color
      labels.filter((n) => n.id === d.id).style("fill", newTextColor);
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <svg id="graph" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default GraphVisualisation;

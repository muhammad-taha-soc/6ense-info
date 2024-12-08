import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const DonutChart = () => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 480 });

  const data = [
    { label: "Creator", bgColor: "#008FFB", value: 5 },
    { label: "Marketing", bgColor: "#58FFC5", value: 10 },
    { label: "Catalyst Network", bgColor: "#FEB019", value: 10 },
    { label: "Team", bgColor: "#FF4560", value: 10 },
    { label: "DeX Liquidity", bgColor: "#775DD0", value: 25 },
    { label: "Future Allocation and Special Projects", bgColor: "#67bbf7", value: 10 },
    { label: "Rewards", bgColor: "#58FFC5", value: 20 },
    { label: "Planto group", bgColor: "#FEB019", value: 10 }
  ];

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const pie = d3.pie().value(d => d.value).sort(null);
  const arc = d3.arc().innerRadius(0);
  const outerArc = d3.arc();

  // Adjust chart size dynamically
  useEffect(() => {
    const handleResize = () => {
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      setDimensions({ width, height });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2;

    arc.outerRadius(radius - 10).innerRadius(radius - 70);  // Adjust for donut effect
    outerArc.innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    // Clear any existing content in the SVG element before adding new content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();  // Remove existing elements

    // Set the viewBox to make it responsive
    svg.attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Draw the slices
    const slices = g.selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("d", arc)
      .attr("fill", (d, i) => d.data.bgColor)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Add the outer labels (without percentage)
    const outerText = g.selectAll(".outer-label")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("class", "outer-label")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(d => d.data.label);  // Just use label without percentage

    // Function to compute the middle angle of a slice for correct label placement
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Position the outer labels correctly
    outerText.transition().duration(1000)
      .attr("transform", function (d) {
        const pos = outerArc.centroid(d); // Position the label on the outer arc
        const angle = midAngle(d);
        pos[0] = radius * (angle < Math.PI ? 1 : -1); // Adjust label alignment based on angle
        return `translate(${pos})`;
      })
      .style("text-anchor", function (d) {
        return midAngle(d) < Math.PI ? "start" : "end"; // Place label on left or right
      });

    // Draw polylines connecting slices to outer labels
    const polylines = g.selectAll(".polyline")
      .data(pie(data))
      .enter()
      .append("polyline")
      .attr("class", "polyline")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Transition polylines
    polylines.transition().duration(1000)
      .attr("points", function (d) {
        const pos = outerArc.centroid(d);
        const angle = midAngle(d);
        pos[0] = radius * 0.95 * (angle < Math.PI ? 1 : -1); // Adjust polyline to connect from slice center to label position
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    // Add labels inside the slices (inner labels)
    const innerText = g.selectAll(".inner-label")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("class", "inner-label")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")  // White text color for inner labels
      .style("font-size", "12px")  // Adjust font size for readability
      .text(d => `${d.data.value}%`);  // Show percentage inside slice

    // Position the inner labels correctly
    innerText.transition().duration(1000)
      .attr("transform", function (d) {
        const pos = arc.centroid(d);  // Position the label in the center of each slice
        return `translate(${pos})`;
      });
  }, [data, dimensions]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DonutChart;

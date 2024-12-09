import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// Define a breakpoint for mobile view
const MOBILE_BREAKPOINT = 600; // in pixels

const DonutChart = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
  const arcGenerator = d3.arc();
  const outerArcGenerator = d3.arc();

  // Use ResizeObserver to track container size
  useEffect(() => {
    const container = containerRef.current;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  // Determine if the current view is mobile
  const isMobile = dimensions.width < MOBILE_BREAKPOINT;

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return; // Skip if dimensions are not set

    const { width, height } = dimensions;
    const padding = isMobile ? 60 : 150; // Increased padding for desktop to prevent label cutoff

    // Define the SVG viewBox with added padding
    const totalWidth = width + padding * 2;
    const totalHeight = height + padding * 2;

    const radius = Math.min(width, height) / 2 * 0.8; // Adjusted to fit within new padding

    arcGenerator
      .innerRadius(radius * 0.6) // 60% of radius for donut thickness
      .outerRadius(radius);

    outerArcGenerator
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("overflow", "visible"); // Ensure overflow is visible

    // Append a group with translation to account for padding
    const g = svg.append("g")
      .attr("transform", `translate(${totalWidth / 2}, ${totalHeight / 2})`);

    // Draw the slices
    const slices = g.selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("d", arcGenerator)
      .attr("fill", d => d.data.bgColor)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Function to compute the middle angle of a slice for correct label placement
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    if (!isMobile) {
      // Add the outer labels (without percentage)
      const outerText = g.selectAll(".outer-label")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("class", "outer-label")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", Math.min(width, height) / 50 + "px") // Adjust font size for responsiveness
        .text(d => d.data.label);

      // Position the outer labels correctly
      outerText
        .attr("transform", function (d) {
          const pos = outerArcGenerator.centroid(d);
          const angle = midAngle(d);
          pos[0] = radius * 1.3 * (angle < Math.PI ? 1 : -1); // Adjusted multiplier for better spacing
          pos[1] = pos[1] + (angle < Math.PI ? -10 : 10); // Slight vertical adjustment
          return `translate(${pos})`;
        })
        .style("text-anchor", function (d) {
          return midAngle(d) < Math.PI ? "start" : "end";
        });

      // Draw polylines connecting slices to outer labels
      g.selectAll(".polyline")
        .data(pie(data))
        .enter()
        .append("polyline")
        .attr("class", "polyline")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("points", function (d) {
          const posA = arcGenerator.centroid(d); // Slice center
          const posB = outerArcGenerator.centroid(d); // Outer arc
          const angle = midAngle(d);
          const posC = [
            radius * 1.25 * (angle < Math.PI ? 1 : -1),
            outerArcGenerator.centroid(d)[1]
          ]; // Label position
          return [posA, posB, posC];
        });
    }

    // Add labels inside the slices (inner labels)
    const innerText = g.selectAll(".inner-label")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("class", "inner-label")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", Math.min(width, height) / 50 + "px") // Responsive font size
      .text(d => `${d.data.value}%`);

    // Position the inner labels correctly
    innerText
      .attr("transform", function (d) {
        return `translate(${arcGenerator.centroid(d)})`;
      });

  }, [data, dimensions, isMobile, arcGenerator, outerArcGenerator]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        position: 'relative',
        boxSizing: 'border-box', // Ensure padding and margins are handled correctly
        padding: '10px' // Optional: Add padding to prevent overflow
      }}
    >
      <svg ref={svgRef}></svg>
      {isMobile && (
        <div style={{
          marginTop: '5px', // Reduced margin to minimize gap
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {data.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '3px 8px' // Reduced margins to eliminate gaps
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: item.bgColor,
                  marginRight: '6px', // Reduced margin to tighten spacing
                  flexShrink: 0 // Prevents the square from shrinking
                }}
              ></div>
              <span style={{ fontSize: '12px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonutChart;

import React from "react";
import { motion } from "framer-motion";

const AnimatedTetrahedron = () => {
  const nodeRadius = 15;
  const lineColor = "#2196F3";
  const canvasSize = 300;

  const nodePositions = [
    { x: canvasSize / 2, y: 50 },
    { x: 75, y: canvasSize - 100 },
    { x: canvasSize - 75, y: canvasSize - 100 },
    { x: canvasSize / 2, y: canvasSize - 50 },
  ];

  const connections = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  const nodeColors = [
    ["#FF6B6B", "#FF8E8E"],
    ["#4ECB71", "#70E899"],
    ["#4A90E2", "#6BA8E5"],
    ["#FFD93D", "#FFE066"],
  ];

  return (
    <svg
      width={canvasSize}
      height={canvasSize}
      viewBox={`0 0 ${canvasSize} ${canvasSize}`}
    >
      {connections.map(([startIndex, endIndex], lineIndex) => (
        <motion.line
          key={`line-${lineIndex}`}
          x1={nodePositions[startIndex].x}
          y1={nodePositions[startIndex].y}
          x2={nodePositions[endIndex].x}
          y2={nodePositions[endIndex].y}
          stroke={lineColor}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {nodePositions.map((pos, index) => (
        <motion.g
          key={`node-${index}`}
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <defs>
            <radialGradient
              id={`gradient-${index}`}
              cx="30%"
              cy="30%"
              r="70%"
              fx="30%"
              fy="30%"
            >
              <stop offset="0%" stopColor={nodeColors[index][0]} />
              <stop offset="100%" stopColor={nodeColors[index][1]} />
            </radialGradient>
          </defs>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={nodeRadius}
            fill={`url(#gradient-${index})`}
          />
        </motion.g>
      ))}
    </svg>
  );
};

export default AnimatedTetrahedron;

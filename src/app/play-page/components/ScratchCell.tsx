"use client";

import React, { useRef, useEffect, useState } from "react";

interface ScratchCellProps {
  id: string;
  value: number;
  onRevealed: () => void;
}

export const ScratchCell: React.FC<ScratchCellProps> = ({
  id,
  value,
  onRevealed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const revealThreshold = 50;
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const scratchRadius = 15; // Radius of the scratch "finger" in pixels

  const gridSize = 20; // Number of cells in each dimension for tracking
  const scratchGrid = useRef<boolean[][]>([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const isDrawing = useRef(false);

  // Initialize the canvas and set up the scratch overlay
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Reset scratched area tracking - create a fresh grid
    scratchGrid.current = Array(gridSize)
      .fill(0)
      .map(() => Array(gridSize).fill(false));
    setPercentScratched(0);
    setIsRevealed(false);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#5253aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "destination-out";

    setCanvasInitialized(true);
  };

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [value]);

  const updateScratchedArea = (centerX: number, centerY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridX = Math.floor((centerX / canvas.width) * gridSize);
    const gridY = Math.floor((centerY / canvas.height) * gridSize);

    const cellSize = canvas.width / gridSize;
    const gridRadius = Math.ceil(scratchRadius / cellSize);

    for (
      let y = Math.max(0, gridY - gridRadius);
      y <= Math.min(gridSize - 1, gridY + gridRadius);
      y++
    ) {
      for (
        let x = Math.max(0, gridX - gridRadius);
        x <= Math.min(gridSize - 1, gridX + gridRadius);
        x++
      ) {
        // Calculate distance from center to determine if cell is within radius
        const centerGridX = gridX + 0.5;
        const centerGridY = gridY + 0.5;
        const distSquared =
          Math.pow(x - centerGridX, 2) + Math.pow(y - centerGridY, 2);

        // Mark cells within the radius
        if (distSquared <= gridRadius * gridRadius) {
          scratchGrid.current[y][x] = true;
        }
      }
    }

    // Count scratched cells and calculate percentage
    let scratchedCount = 0;
    const totalCells = gridSize * gridSize;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (scratchGrid.current[y][x]) {
          scratchedCount++;
        }
      }
    }

    const percentage = (scratchedCount / totalCells) * 100;
    setPercentScratched(Math.min(percentage, 100));

    // Check if threshold is reached
    if (percentage >= revealThreshold && !isRevealed) {
      setIsRevealed(true);
      onRevealed();
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = getPointerPosition(e);
    lastPosition.current = { x: offsetX, y: offsetY };

    // Update scratched area at start position
    updateScratchedArea(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasInitialized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { offsetX, offsetY } = getPointerPosition(e);

    // Draw scratch line
    ctx.lineWidth = scratchRadius * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // Calculate distance between last point and current point
    const dx = offsetX - lastPosition.current.x;
    const dy = offsetY - lastPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Add points along the line with distance-based sampling
    if (distance > 0) {
      const steps = Math.max(1, Math.floor(distance / (scratchRadius / 2)));
      for (let i = 0; i <= steps; i++) {
        const pointX = lastPosition.current.x + (dx * i) / steps;
        const pointY = lastPosition.current.y + (dy * i) / steps;

        // Update scratched area at each point
        updateScratchedArea(pointX, pointY);
      }
    }

    lastPosition.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  return (
    <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden">
      {/* Number display (becomes visible as user scratches) */}
      <div className="absolute inset-0 flex items-center justify-center text-5xl font-extrabold z-0">
        {value}
      </div>

      {/* Scratch overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10 touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Progress indicator (optional) */}
      <div className="absolute bottom-1 right-1 text-xs z-20 bg-white/50 px-1 rounded">
        {Math.floor(percentScratched)}%
      </div>
    </div>
  );
};

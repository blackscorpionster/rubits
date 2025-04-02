import { useRef, useState, useEffect } from 'react';
import { CanvasPosition, ScratchCanvasProps, CanvasRefType } from './types';

export const useScratchCanvas = ({
  revealThreshold,
  onRevealed,
  scratchRadius,
}: ScratchCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null) as CanvasRefType;
  const [isRevealed, setIsRevealed] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  
  // Track scratch area using a grid
  const gridSize = 20; // Number of cells in each dimension for tracking
  const scratchGrid = useRef<boolean[][]>([]);
  const lastPosition = useRef<CanvasPosition>({ x: 0, y: 0 });
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Use the scratch overlay color
    ctx.fillStyle = "#5253aa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "destination-out";

    setCanvasInitialized(true);
  };

  // Update which areas have been scratched based on a point
  const updateScratchedArea = (centerX: number, centerY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridX = Math.floor((centerX / canvas.width) * gridSize);
    const gridY = Math.floor((centerY / canvas.height) * gridSize);

    const cellSize = canvas.width / gridSize;
    const gridRadius = Math.ceil(scratchRadius / cellSize);

    // Mark cells within the scratch radius
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

  // Draw a scratch line between two points
  const drawScratchLine = (from: CanvasPosition, to: CanvasPosition) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scratch line
    ctx.lineWidth = scratchRadius * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Calculate distance between points
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Add points along the line with distance-based sampling
    if (distance > 0) {
      const steps = Math.max(1, Math.floor(distance / (scratchRadius / 2)));
      for (let i = 0; i <= steps; i++) {
        const pointX = from.x + (dx * i) / steps;
        const pointY = from.y + (dy * i) / steps;

        // Update scratched area at each point
        updateScratchedArea(pointX, pointY);
      }
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Initialize canvas
  useEffect(() => {
    initCanvas();
  }, []);

  return {
    canvasRef,
    isRevealed,
    percentScratched,
    canvasInitialized,
    isDrawing,
    lastPosition,
    initCanvas,
    updateScratchedArea,
    drawScratchLine,
  };
}; 
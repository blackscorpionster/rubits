"use client";

import React, { useRef, useState, useEffect } from "react";
import { ScratchCell } from "./ScratchCell";

interface GridItem {
  id: string;
  value: number;
}

interface ScratchGridProps {
  gridData: GridItem[];
  onNumberRevealed: (id: string, value: number) => void;
  preRevealedNumbers?: Record<string, number>;
}

export const ScratchGrid: React.FC<ScratchGridProps> = ({
  gridData,
  onNumberRevealed,
  preRevealedNumbers = {},
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [revealedCells, setRevealedCells] = useState<Record<string, boolean>>({});

  // Refs to store references to child ScratchCell components
  const cellRefs = useRef<{ [id: string]: React.RefObject<any> }>({});

  // Initialize refs for each cell
  useEffect(() => {
    // Reset all refs when grid data changes
    cellRefs.current = {};

    gridData.forEach((item) => {
      if (!cellRefs.current[item.id]) {
        cellRefs.current[item.id] = React.createRef();
      }
    });

    // Apply pre-revealed numbers
    const initialRevealedCells: Record<string, boolean> = {};
    Object.keys(preRevealedNumbers).forEach(id => {
      initialRevealedCells[id] = true;
    });
    setRevealedCells(initialRevealedCells);
    
  }, [gridData, preRevealedNumbers]);

  // Force reveal all pre-revealed cells
  useEffect(() => {
    // Small delay to ensure the ScratchCell components have mounted
    const timer = setTimeout(() => {
      Object.keys(preRevealedNumbers).forEach(id => {
        if (cellRefs.current[id]?.current) {
          cellRefs.current[id].current.forceReveal();
        }
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [preRevealedNumbers]);

  // Start drawing on mouse down or touch start
  const handleGridMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    updateActiveCellFromEvent(e);
  };

  // Continue drawing on mouse move or touch move
  const handleGridMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    updateActiveCellFromEvent(e);
  };

  // Stop drawing on mouse up or touch end
  const handleGridMouseUp = () => {
    setIsDrawing(false);
    setActiveCellId(null);
  };

  // Determine which cell the pointer is over
  const updateActiveCellFromEvent = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

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

    // Get grid rectangle
    const gridRect = gridElement.getBoundingClientRect();

    // Calculate relative position within grid (0-1)
    const relativeX = (clientX - gridRect.left) / gridRect.width;
    const relativeY = (clientY - gridRect.top) / gridRect.height;

    // Only proceed if within grid bounds
    if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) {
      return;
    }

    // Calculate cell coordinates (0-2 for 3x3 grid)
    const cellX = Math.floor(relativeX * 3);
    const cellY = Math.floor(relativeY * 3);

    // Convert to cell ID
    const cellId = `${cellY}-${cellX}`;

    // If we've moved to a new cell
    if (cellId !== activeCellId) {
      setActiveCellId(cellId);
    }

    // Forward the event to the active cell
    if (cellRefs.current[cellId] && cellRefs.current[cellId].current) {
      const cellRef = cellRefs.current[cellId].current;

      // Calculate relative position within the cell
      const cellWidth = gridRect.width / 3;
      const cellHeight = gridRect.height / 3;
      const cellLeft = gridRect.left + cellX * cellWidth;
      const cellTop = gridRect.top + cellY * cellHeight;

      const cellRelativeX = clientX - cellLeft;
      const cellRelativeY = clientY - cellTop;

      // Call the appropriate method on the cell component
      if (cellId !== activeCellId) {
        // First interaction with this cell
        cellRef.startDrawingExternal(cellRelativeX, cellRelativeY);
      } else {
        // Continuing to draw on this cell
        cellRef.drawExternal(cellRelativeX, cellRelativeY);
      }
    }
  };

  // Add touch event passive option for better performance
  useEffect(() => {
    // This will help prevent scrolling while scratching on mobile
    const preventDefaultTouchMove = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    // Add event listener with passive: false to allow preventDefault
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('touchmove', preventDefaultTouchMove);
      }
    };
  }, [isDrawing]);

  return (
    <div
      ref={gridRef}
      className="relative w-full max-w-md mx-auto"
      style={{
        aspectRatio: `444 / 666`,
        maxWidth: "444px",
        borderRadius: "1rem",
        overflow: "hidden",
        cursor: "url('/assets/coin.cur'), auto",
        touchAction: "none" // Prevent scrolling when interacting with the grid
      }}
      onMouseDown={handleGridMouseDown}
      onMouseMove={handleGridMouseMove}
      onMouseUp={handleGridMouseUp}
      onMouseLeave={handleGridMouseUp}
      onTouchStart={handleGridMouseDown}
      onTouchMove={handleGridMouseMove}
      onTouchEnd={handleGridMouseUp}
    >
      <div
        className="grid grid-cols-3 grid-rows-3 w-full h-full"
        style={{ gap: 0 }}
      >
        {/* TOP ROW (Row 1) */}
        <div style={{ gridRow: 1, gridColumn: 1 }}>
          {renderCell("0-0", "/assets/image1x1.png")}
        </div>
        <div style={{ gridRow: 1, gridColumn: 2 }}>
          {renderCell("0-1", "/assets/image2x1.png")}
        </div>
        <div style={{ gridRow: 1, gridColumn: 3 }}>
          {renderCell("0-2", "/assets/image3x1.png")}
        </div>

        {/* MIDDLE ROW (Row 2) */}
        <div style={{ gridRow: 2, gridColumn: 1 }}>
          {renderCell("1-0", "/assets/image1x2.png")}
        </div>
        <div style={{ gridRow: 2, gridColumn: 2 }}>
          {renderCell("1-1", "/assets/image2x2.png")}
        </div>
        <div style={{ gridRow: 2, gridColumn: 3 }}>
          {renderCell("1-2", "/assets/image3x2.png")}
        </div>

        {/* BOTTOM ROW (Row 3) */}
        <div style={{ gridRow: 3, gridColumn: 1 }}>
          {renderCell("2-0", "/assets/image1x3.png")}
        </div>
        <div style={{ gridRow: 3, gridColumn: 2 }}>
          {renderCell("2-1", "/assets/image2x3.png")}
        </div>
        <div style={{ gridRow: 3, gridColumn: 3 }}>
          {renderCell("2-2", "/assets/image3x3.png")}
        </div>
      </div>
    </div>
  );

  // Helper function to render a cell with the given position and background image
  function renderCell(position: string, backgroundImage: string) {
    const cell = gridData.find((item) => item.id === position);
    if (!cell) {
      console.warn(`No data found for position ${position}`);
      return null;
    }

    const isPreRevealed = Boolean(preRevealedNumbers[cell.id]);

    return (
      <ScratchCell
        id={cell.id}
        value={cell.value}
        backgroundImage={backgroundImage}
        onRevealed={() => {
          if (!revealedCells[cell.id]) {
            setRevealedCells(prev => ({ ...prev, [cell.id]: true }));
            onNumberRevealed(cell.id, cell.value);
          }
        }}
        ref={cellRefs.current[cell.id]}
        externalDrawing={true}
        isPreRevealed={isPreRevealed}
      />
    );
  }
};

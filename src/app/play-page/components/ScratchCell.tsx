"use client";

import React, { forwardRef } from "react";
import {
  ScratchCellRef,
  useScratchCanvas,
  useEventHandlers,
  useExternalDrawingControl,
} from "../hooks";

interface ScratchCellProps {
  id: string;
  value: number;
  backgroundImage: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  onRevealed: () => void;
  externalDrawing?: boolean;
}

export const ScratchCell = forwardRef<ScratchCellRef, ScratchCellProps>(
  (
    {
      id,
      value,
      backgroundImage,
      backgroundPosition = "center",
      backgroundSize = "cover",
      onRevealed,
      externalDrawing = false,
    },
    ref
  ) => {
    const scratchRadius = 15; // Radius of the scratch "finger" in pixels
    const revealThreshold = 50; // Percentage threshold to reveal the number

    const {
      canvasRef,
      isRevealed,
      canvasInitialized,
      isDrawing,
      lastPosition,
      updateScratchedArea,
      drawScratchLine,
    } = useScratchCanvas({
      revealThreshold,
      onRevealed,
      scratchRadius,
    });

    const { startDrawing, draw, stopDrawing } = useEventHandlers({
      canvasRef,
      isDrawing,
      lastPosition,
      updateScratchedArea,
      drawScratchLine,
      externalDrawing,
    });

    useExternalDrawingControl({
      ref,
      canvasInitialized,
      isDrawing,
      lastPosition,
      updateScratchedArea,
      drawScratchLine,
    });

    return (
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Number display (becomes visible as user scratches) */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-black z-0">
          <span
            className={`flex items-center justify-center w-26 h-20 rounded-full bg-white/90 shadow-lg text-[#FE80D3] border-2 border-[#FE80D3] [-webkit-text-stroke:1px_black]`}
          >
            {value}
          </span>
        </div>

        {/* Scratch overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 touch-none"
          onMouseDown={!externalDrawing ? startDrawing : undefined}
          onMouseMove={!externalDrawing ? draw : undefined}
          onMouseUp={!externalDrawing ? stopDrawing : undefined}
          onMouseLeave={!externalDrawing ? stopDrawing : undefined}
          onTouchStart={!externalDrawing ? startDrawing : undefined}
          onTouchMove={!externalDrawing ? draw : undefined}
          onTouchEnd={!externalDrawing ? stopDrawing : undefined}
        />
      </div>
    );
  }
);

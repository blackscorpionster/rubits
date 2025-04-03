import { useImperativeHandle } from "react";
import { CanvasPosition, ScratchCellRef, MutableRef } from "./types";

interface ExternalDrawingProps {
  ref: React.Ref<ScratchCellRef>;
  canvasInitialized: boolean;
  isDrawing: MutableRef<boolean>;
  lastPosition: MutableRef<CanvasPosition>;
  updateScratchedArea: (x: number, y: number) => void;
  drawScratchLine: (from: CanvasPosition, to: CanvasPosition) => void;
  forceReveal: () => void;
}

export const useExternalDrawingControl = ({
  ref,
  canvasInitialized,
  isDrawing,
  lastPosition,
  updateScratchedArea,
  drawScratchLine,
  forceReveal,
}: ExternalDrawingProps) => {
  useImperativeHandle(
    ref,
    () => ({
      startDrawingExternal: (x: number, y: number) => {
        if (!canvasInitialized) return;
        isDrawing.current = true;
        lastPosition.current = { x, y };
        updateScratchedArea(x, y);
      },
      drawExternal: (x: number, y: number) => {
        if (!isDrawing.current || !canvasInitialized) return;

        const currentPosition = { x, y };
        drawScratchLine(lastPosition.current, currentPosition);
        lastPosition.current = currentPosition;
      },
      forceReveal: () => {
        if (!canvasInitialized) return;
        forceReveal();
      },
    }),
    [
      canvasInitialized,
      isDrawing,
      lastPosition,
      updateScratchedArea,
      drawScratchLine,
      forceReveal,
    ]
  );
};

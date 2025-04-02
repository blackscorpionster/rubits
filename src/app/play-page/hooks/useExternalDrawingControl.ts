import { useImperativeHandle } from 'react';
import { CanvasPosition, ScratchCellRef, CanvasRefType } from './types';

interface ExternalDrawingProps {
  ref: React.Ref<ScratchCellRef>;
  canvasInitialized: boolean;
  isDrawing: React.MutableRefObject<boolean>;
  lastPosition: React.MutableRefObject<CanvasPosition>;
  updateScratchedArea: (x: number, y: number) => void;
  drawScratchLine: (from: CanvasPosition, to: CanvasPosition) => void;
}

export const useExternalDrawingControl = ({
  ref,
  canvasInitialized,
  isDrawing,
  lastPosition,
  updateScratchedArea,
  drawScratchLine,
}: ExternalDrawingProps) => {
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
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
  }));
}; 
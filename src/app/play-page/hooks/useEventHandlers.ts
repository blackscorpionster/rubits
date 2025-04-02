import { CanvasPosition, CanvasRefType } from './types';

interface EventHandlersProps {
  canvasRef: CanvasRefType;
  isDrawing: React.MutableRefObject<boolean>;
  lastPosition: React.MutableRefObject<CanvasPosition>;
  updateScratchedArea: (x: number, y: number) => void;
  drawScratchLine: (from: CanvasPosition, to: CanvasPosition) => void;
  externalDrawing: boolean;
}

export const useEventHandlers = ({
  canvasRef,
  isDrawing,
  lastPosition,
  updateScratchedArea,
  drawScratchLine,
  externalDrawing,
}: EventHandlersProps) => {
  // Get position relative to canvas
  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if ('touches' in e) {
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

  // Start drawing on mouse/touch down
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (externalDrawing) return; // Skip if using external drawing

    isDrawing.current = true;
    const { offsetX, offsetY } = getPointerPosition(e);
    lastPosition.current = { x: offsetX, y: offsetY };

    // Update scratched area at start position
    updateScratchedArea(offsetX, offsetY);
  };

  // Continue drawing on mouse/touch move
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (externalDrawing) return; // Skip if using external drawing
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = getPointerPosition(e);
    
    // Draw the line from last position to current position
    drawScratchLine(lastPosition.current, { x: offsetX, y: offsetY });
    
    // Update last position
    lastPosition.current = { x: offsetX, y: offsetY };
  };

  // Stop drawing on mouse/touch up or leave
  const stopDrawing = () => {
    if (externalDrawing) return; // Skip if using external drawing
    isDrawing.current = false;
  };

  return {
    getPointerPosition,
    startDrawing,
    draw,
    stopDrawing,
  };
}; 
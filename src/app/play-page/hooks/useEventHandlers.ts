import { CanvasPosition, CanvasRefType, MutableRef } from "./types";

interface EventHandlersProps {
  canvasRef: CanvasRefType;
  isDrawing: MutableRef<boolean>;
  lastPosition: MutableRef<CanvasPosition>;
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
  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (externalDrawing) return;

    isDrawing.current = true;
    const { offsetX, offsetY } = getPointerPosition(e);
    lastPosition.current = { x: offsetX, y: offsetY };

    updateScratchedArea(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (externalDrawing) return;
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = getPointerPosition(e);

    drawScratchLine(lastPosition.current, { x: offsetX, y: offsetY });

    lastPosition.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    if (externalDrawing) return;
    isDrawing.current = false;
  };

  return {
    getPointerPosition,
    startDrawing,
    draw,
    stopDrawing,
  };
};

// Canvas position type
export interface CanvasPosition {
  x: number;
  y: number;
}

// Scratch cell ref for external control
export interface ScratchCellRef {
  startDrawingExternal: (x: number, y: number) => void;
  drawExternal: (x: number, y: number) => void;
}

// Props for scratch canvas hook
export interface ScratchCanvasProps {
  revealThreshold: number;
  onRevealed: () => void;
  scratchRadius: number;
}

// Common ref type
export type CanvasRefType = React.RefObject<HTMLCanvasElement>; 
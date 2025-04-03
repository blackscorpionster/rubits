export interface CanvasPosition {
  x: number;
  y: number;
}

export interface ScratchCellRef {
  startDrawingExternal: (x: number, y: number) => void;
  drawExternal: (x: number, y: number) => void;
  forceReveal: () => void;
}

export interface ScratchCanvasProps {
  revealThreshold: number;
  onRevealed: () => void;
  scratchRadius: number;
  cellPosition?: string; // ID of the cell (e.g. "0-1") to determine which part of the image to use
}

export type CanvasRefType = React.RefObject<HTMLCanvasElement>;

export type MutableRef<T> = { current: T };

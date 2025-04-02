export interface CanvasPosition {
  x: number;
  y: number;
}

export interface ScratchCellRef {
  startDrawingExternal: (x: number, y: number) => void;
  drawExternal: (x: number, y: number) => void;
}

export interface ScratchCanvasProps {
  revealThreshold: number;
  onRevealed: () => void;
  scratchRadius: number;
}

export type CanvasRefType = React.RefObject<HTMLCanvasElement>;

export type MutableRef<T> = { current: T };

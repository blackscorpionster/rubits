"use client";

import React from "react";
import { ScratchCell } from "./ScratchCell";

interface GridItem {
  id: string;
  value: number;
}

interface ScratchGridProps {
  gridData: GridItem[];
  onNumberRevealed: (id: string, value: number) => void;
}

export const ScratchGrid: React.FC<ScratchGridProps> = ({
  gridData,
  onNumberRevealed,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      {gridData.map((item) => (
        <ScratchCell
          key={item.id}
          id={item.id}
          value={item.value}
          onRevealed={() => onNumberRevealed(item.id, item.value)}
        />
      ))}
    </div>
  );
};

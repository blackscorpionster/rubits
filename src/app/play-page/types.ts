export interface GridItem {
  id: string;
  value: number;
}

export interface Draw {
  id: string;
  name: string;
  numberOfTickets: number;
  ticketCost: number;
  profitPercent: number;
  gridSizeX: number;
  gridSizeY: number;
  matchingTilesToWin: number;
  tilesTheme: string;
}

export interface Ticket {
  id: string;
  drawId: string;
  gridElements: number[];
  md5: string;
  status: string;
  tierId: string;
  position: number;
  dateCreated: string;
  purchasedBy: string | null;
  draw: Draw;
}

export interface ValidationResult {
  success: boolean;
  valid?: boolean;
  won?: boolean;
  prize?: string | null;
  message?: string;
}
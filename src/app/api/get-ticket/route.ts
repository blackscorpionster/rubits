import { NextRequest, NextResponse } from "next/server";

export interface GridElement {
  id: string;
  value: number;
}

export interface Ticket {
  id: string;
  name: string;
  gridSizeX: number;
  gridSizeY: number;
  drawId: string;
  gridElements: GridElement[];
  md5: string;
  tierId: string;
  playerId: string;
}

// Create a winning ticket with 3 of the same number in a row
const getWinningTicket = (): Ticket => {
  const gridSizeX = 3;
  const gridSizeY = 3;
  const winningNumber = Math.floor(Math.random() * 9) + 1; // Random number 1-9
  const gridElements: GridElement[] = [];

  // Choose a random row to have 3 winning numbers
  const winningRow = Math.floor(Math.random() * gridSizeY);

  for (let row = 0; row < gridSizeY; row++) {
    for (let col = 0; col < gridSizeX; col++) {
      // If this is in the winning row, use the winning number
      const value =
        row === winningRow ? winningNumber : Math.floor(Math.random() * 9) + 1;

      gridElements.push({
        id: `${row}-${col}`,
        value,
      });
    }
  }

  return {
    id: "ticket-" + Math.floor(Math.random() * 1000),
    name: "Lucky Ticket",
    gridSizeX,
    gridSizeY,
    drawId: "draw-" + Math.floor(Math.random() * 100),
    gridElements,
    md5: "d41d8cd98f00b204e9800998ecf8427e", // Sample MD5 hash
    tierId: "tier-win",
    playerId: "player-" + Math.floor(Math.random() * 1000),
  };
};

// Create a losing ticket with no 3 of the same number
const getLosingTicket = (): Ticket => {
  const gridSizeX = 3;
  const gridSizeY = 3;
  const gridElements: GridElement[] = [];

  // Track numbers used in each row to avoid 3 of the same
  const usedInRow = new Map<number, number>();

  for (let row = 0; row < gridSizeY; row++) {
    // Reset for new row
    usedInRow.clear();

    for (let col = 0; col < gridSizeX; col++) {
      let value: number;
      do {
        value = Math.floor(Math.random() * 9) + 1;
      } while (usedInRow.get(value) === 2); // Don't use a number 3 times in a row

      // Track usage of this number in the row
      usedInRow.set(value, (usedInRow.get(value) || 0) + 1);

      gridElements.push({
        id: `${row}-${col}`,
        value,
      });
    }
  }

  return {
    id: "ticket-" + Math.floor(Math.random() * 1000),
    name: "Normal Ticket",
    gridSizeX,
    gridSizeY,
    drawId: "draw-" + Math.floor(Math.random() * 100),
    gridElements,
    md5: "d41d8cd98f00b204e9800998ecf8427e", // Sample MD5 hash
    tierId: "tier-lose",
    playerId: "player-" + Math.floor(Math.random() * 1000),
  };
};

// Get a random ticket - 30% chance of winning
const getRandomTicket = (): Ticket => {
  return Math.random() < 0.3 ? getWinningTicket() : getLosingTicket();
};

export async function GET(request: NextRequest) {
  try {
    // Check the query parameter to determine which ticket type to return
    const url = new URL(request.url);
    const ticketType = url.searchParams.get("type");

    let ticket: Ticket;

    switch (ticketType) {
      case "win":
        ticket = getWinningTicket();
        break;
      case "lose":
        ticket = getLosingTicket();
        break;
      default:
        // By default, return a random ticket
        ticket = getRandomTicket();
        break;
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

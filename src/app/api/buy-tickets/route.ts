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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numTickets } = body;

    if (!numTickets || typeof numTickets !== "number" || numTickets <= 0) {
        return NextResponse.json(
            { success: false, message: "Invalid number of tickets" },
            { status: 400 }
        );
    }

    // db call to insert link tickets to customer
    // validation to check there are enough tickets available?

    const ticket = getLosingTicket();

    // return ticket data of the purchased tickets. unneeded?
    return NextResponse.json({
      success: true,
      data: [ticket],
    });
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to purchase ticket" },
      { status: 500 }
    );
  }
}

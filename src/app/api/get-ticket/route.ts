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

const getMockTicket = (): Ticket => {
  const gridSizeX = 3;
  const gridSizeY = 3;
  const gridElements: GridElement[] = [];

  for (let row = 0; row < gridSizeY; row++) {
    for (let col = 0; col < gridSizeX; col++) {
      gridElements.push({
        id: `${row}-${col}`,
        value: Math.floor(Math.random() * 9) + 1, // Random number 1-9
      });
    }
  }

  return {
    id: "ticket-" + Math.floor(Math.random() * 1000),
    name: "Sample Ticket",
    gridSizeX,
    gridSizeY,
    drawId: "draw-" + Math.floor(Math.random() * 100),
    gridElements,
    md5: "d41d8cd98f00b204e9800998ecf8427e", // Sample MD5 hash
    tierId: "tier-" + Math.floor(Math.random() * 5),
    playerId: "player-" + Math.floor(Math.random() * 1000),
  };
};

// The database connection is stubbed out for future implementation
// This function would be used once database is set up
const getTicketFromDatabase = async (): Promise<Ticket> => {
  // TODO: Implement real database connection
  // const db = await connectToDatabase();
  // return db.collection('tickets').findOne({});

  // For now, just return mock data
  return getMockTicket();
};

export async function GET(request: NextRequest) {
  try {
    // Using mock data - the database integration code is just structure for future implementation
    const ticket = getMockTicket();

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

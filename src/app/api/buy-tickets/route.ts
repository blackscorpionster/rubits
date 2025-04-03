import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { drawId, playerId, numTickets } = body;

    if (!drawId || !playerId || !numTickets || numTickets < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const availableTickets = await prisma.ticket.findMany({
      where: {
        drawId: drawId,
        purchasedBy: null,
        status: "intact",
      },
      include: { draw: true },
      take: numTickets,
    });

    if (availableTickets.length < numTickets) {
      return NextResponse.json(
        { success: false, message: "Not enough available tickets" },
        { status: 400 }
      );
    }

    const ticketIds = availableTickets.map((ticket: any) => ticket.id);

    await prisma.ticket.updateMany({
      where: {
        id: { in: ticketIds },
      },
      data: {
        purchasedBy: playerId, // Assign player
      },
    });

    return NextResponse.json({
      success: true,
      message: `${numTickets} tickets successfully assigned to player.`,
    });
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to purchase ticket" },
      { status: 500 }
    );
  }
}

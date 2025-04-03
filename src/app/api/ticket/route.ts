import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const playerId = url.searchParams.get("playerId");
    const ticketStatus = url.searchParams.get("ticketStatus");

    if (!playerId) {
      return NextResponse.json(
        { success: false, message: "Player ID is required" },
        { status: 400 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        purchasedBy: playerId,
        ...(ticketStatus ? { status: ticketStatus } : {}),
      },
      include: {
        draw: true,
      },
    });

    return NextResponse.json({
      success: true,
      tickets,
      count: tickets.length
    });

  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// Add a POST method to mark a ticket as purchased by a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, userId } = body;

    if (!ticketId || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the ticket to mark it as purchased
    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        purchasedBy: userId,
        status: "purchased",
      },
      include: {
        draw: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    return NextResponse.json(
      { success: false, message: "Failed to purchase ticket" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const ticketId = url.searchParams.get("id");

    let ticket;

    if (ticketId) {
      // If an ID is provided, fetch that specific ticket
      ticket = await prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
        include: {
          draw: true,
        },
      });

      if (!ticket) {
        return NextResponse.json(
          { success: false, message: "Ticket not found" },
          { status: 404 }
        );
      }
    } else {
      // Otherwise get a random available ticket
      // First count available tickets to ensure we have some
      const availableTicketsCount = await prisma.ticket.count({
        where: {
          purchasedBy: null,
          status: "intact",
        },
      });

      if (availableTicketsCount === 0) {
        return NextResponse.json(
          { success: false, message: "No available tickets" },
          { status: 404 }
        );
      }

      // Get a random ticket that hasn't been purchased
      // Skip a random number of records
      const skip = Math.floor(Math.random() * availableTicketsCount);

      ticket = await prisma.ticket.findFirst({
        where: {
          purchasedBy: null,
          status: "intact",
        },
        skip: skip,
        take: 1,
        include: {
          draw: true,
        },
      });
    }

    console.log("Ticket data:", ticket);

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch ticket" },
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

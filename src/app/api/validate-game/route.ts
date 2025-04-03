import { Ticket } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "../../../../lib/prisma";

interface ValidateGameRequest {
	revealedNumbers: Record<string, number>;
	ticket?: Ticket;
	matchingTilesToWin?: number;
}

export async function POST(request: NextRequest) {
	try {
		const body: ValidateGameRequest = await request.json();
		const {
			revealedNumbers,
			matchingTilesToWin: matchingTilesToWin = 3,
			ticket,
		} = body;

		const gridElements = ticket?.gridElements || [];
		const ticketId = ticket?.id || null;

		if (!revealedNumbers || !ticketId || !gridElements) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

		const screenMd5 = crypto
			.createHash("md5")
			.update(JSON.stringify(gridElements))
			.digest("hex");

		const ticketPrize = await prisma.ticket.findUnique({
			where: {
				id: ticketId,
				md5: screenMd5,
				// TODO: add user id check
			},
			include: {
				tier: true,
				draw: true,
			},
		});

		if (!ticketPrize) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid ticket, not found with the provided details",
				},
				{ status: 400 }
			);
		}

		const prize = ticketPrize?.tier?.prize
			? `Congratulations! You won $${`${ticketPrize?.tier?.prize}`}!`
			: null;

		return NextResponse.json({
			success: !!ticketPrize,
			valid:
				Object.keys(revealedNumbers).length ===
				ticketPrize?.draw.gridSizeX * ticketPrize?.draw.gridSizeY,
			won: !!ticketPrize?.tier,
			prize,
		});
	} catch (error) {
		console.error("Error validating game:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to validate game",
			},
			{ status: 500 }
		);
	}
}

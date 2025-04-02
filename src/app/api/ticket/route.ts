import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
	const ticket = await prisma.ticket.findUnique({
		where: {
			id: "633e9cef-6bac-4846-b518-78db2530a207", // Replace with actual ticket ID
		},
		include: {
			// Include any related data you need
			// For example, if you have a User model related to Ticket
			draw: true,
		},
	});

	console.log("Ticket data:", ticket);

	return NextResponse.json(ticket);
}

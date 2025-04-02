import { NextResponse } from "next/server";

export async function GET(request: Request) {
	// 	  const { searchParams } = new URL(request.url);
	//   const ticketId = searchParams.get('ticketId');
	//   const response = await fetch(`https://api.tickets.com/tickets/${ticketId}`, {
	// 	method: 'GET',
	// 	headers: {
	// 	  'Content-Type': 'application/json',
	// 	  'Authorization': `Bearer ${process.env.TICKET_API_KEY}`,
	// 	},
	//   });

	//   if (!response.ok) {
	// 	return new Response('Error fetching ticket', { status: response.status });
	//   }

	//   const data = await response.json();
	return NextResponse.json({
		ticketId: "12345",
		ticketName: "Sample Ticket",
		ticketStatus: "Open",
		ticketDescription: "This is a sample ticket description.",
		ticketCreatedAt: "2023-10-01T12:00:00Z",
	});
}

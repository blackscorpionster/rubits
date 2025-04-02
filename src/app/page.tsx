"use client";

export default function Home() {
	const handleGetTicket = async () => {
		const response = await fetch("/api/ticket", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.error("Error fetching ticket");
			return;
		}

		const data = await response.json();
		console.log("Ticket >>>> ", data);
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<h1>Rubits</h1>

			<button onClick={() => handleGetTicket()}>Get Ticket</button>
		</div>
	);
}

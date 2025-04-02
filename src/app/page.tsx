"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const validateEmail = (email: string): boolean => {
		const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		return regex.test(email);
	};

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Email is required");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setLoading(true);

		const response = await fetch(`/api/login?email=${encodeURIComponent(email)}`, {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
		});

		let player = await response.json();

		if (!player) {
			console.log("Player not found, creating a new one");
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email }),
			  });
			player = await response.json();
		}

		localStorage.setItem("playerId", player.id);
		router.push("/play-page");
		setLoading(false);
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<form onSubmit={handleSubmit}>
					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
							{error}
						</div>
					)}

					<div className="mb-4">
						<label htmlFor="email" className="block text-sm font-medium mb-2">
							Email
						</label>
						<input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Logging in..." : "Log in"}
					</button>
				</form>
			</main>
		</div>
	);
};

export default Home;

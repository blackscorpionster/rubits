"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [aiPrompt, setAiPrompt] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const validateEmail = (email: string): boolean => {
		const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		return regex.test(email);
	};

	const generateImage = async (prompt: string) => {
		if (!prompt) {
			return "";
		}

		try {
			const response = await fetch("/api/generate-image", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate image");
			}

			const data = await response.json();
			return data.imageData || "";
		} catch (error) {
			console.error("Error generating image:", error);
			return "";
		}
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
		console.log("Email:", email, "AI Prompt:", aiPrompt);

		try {
			const response = await fetch(
				`/api/login?email=${encodeURIComponent(email)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

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

			if (typeof window !== "undefined") {
				localStorage.setItem("playerId", player.id);

				try {
					const base64Image = await generateImage(aiPrompt);
					if (base64Image) {
						localStorage.setItem("customImage", base64Image);
					}
					// We do not care if the image generation fails, we just want to show the default image
				} catch (error) {
					console.error("Error generating image:", error);
				}
			}

			router.push("/play-page");
		} catch (error) {
			console.error("Error during login:", error);
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
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

					<div className="mb-4 flex flex-col gap-4">
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
						<label htmlFor="email" className="block text-sm font-medium mb-2">
							Customise your tickets overlay with something fun:
						</label>
						<textarea
							id="aiprompt"
							name="aiprompt"
							placeholder="e.g. A dragon wearing a christmas hat"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows={4}
							cols={50}
							maxLength={50}
							onChange={(e) => setAiPrompt(e.target.value)}
						></textarea>
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

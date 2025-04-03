"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenAI } from "@google/genai";

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
		const ai = new GoogleGenAI({
			apiKey: "AIzaSyAqjKhunOoC9WpQMU8i5xiuR-6Jme_WS0M",
		});

		const contents =
			"Can you create a low-resolution image of 200 pixels x 200 pixels for " +
			prompt;

		// Set responseModalities to include "Image" so the model can generate  an image
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash-exp-image-generation",
			contents: contents,
			config: {
				responseModalities: ["Text", "Image"],
			},
		});

		if (
			!response ||
			!response?.candidates ||
			!response.candidates[0].content?.parts
		) {
			console.error("No response from AI");
			return "";
		}

		for (const part of response.candidates[0].content.parts) {
			// Based on the part type, either show the text or save the image
			if (part.text) {
				console.log("Part 1", part.text);
			} else if (part.inlineData) {
				return part.inlineData.data;
			}
		}

		return "";
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

		localStorage.setItem("playerId", player.id);
		try {
			const base64Image = await generateImage(aiPrompt);
			if (base64Image) {
				localStorage.setItem("customImage", base64Image);
			}
			// We do not care if the image genaration fails, we just want to show the default image
		} catch (error) {
			console.error("Error generating image:", error);
			return;
		}

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
							Customise your ticket by telling us about something you like
						</label>
						<textarea
							id="aiprompt"
							name="aiprompt"
							placeholder="e.g. I like dogs, I like cats, I like pizza"
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

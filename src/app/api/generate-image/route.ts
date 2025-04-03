import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const key = process.env.GEMINI || "AIzaSyAqjKhunOoC9WpQMU8i5xiuR-6Jme_WS0M";

    const ai = new GoogleGenAI({
      apiKey: key,
    });

    const contents = "Can you create a low-resolution image of 200 pixels x 200 pixels for " + prompt;

    // Set responseModalities to include "Image" so the model can generate an image
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    if (!response || !response?.candidates || !response.candidates[0].content?.parts) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let imageData = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        imageData = part.inlineData.data as string;
        break;
      }
    }

    return NextResponse.json({ imageData });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
} 
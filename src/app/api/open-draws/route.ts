import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const draws = await prisma.draw.findMany();

    return NextResponse.json(draws, { status: 200 });
  } catch (error) {
    console.error("Error fetching draws:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch draws" },
      { status: 500 }
    );
  }
}
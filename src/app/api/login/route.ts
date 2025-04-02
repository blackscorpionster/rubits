import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // this should be findUnique, but email is not unique in DB schema and cbf changing :)
    const player = await prisma.player.findFirst({
        where: {
          email: email,
        },
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching customer:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Missing email" },
        { status: 400 }
      );
    }

    const newPlayer = await prisma.player.create({
        data: {
          email: email,
        },
      });

    console.log("New player created:", newPlayer);

    return NextResponse.json({
      success: true,
      data: newPlayer,
    });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create player" },
      { status: 500 }
    );
  }
}

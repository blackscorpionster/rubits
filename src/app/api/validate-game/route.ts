import { NextRequest, NextResponse } from "next/server";

interface ValidateGameRequest {
  revealedNumbers: Record<string, number>;
}

const validateGameResult = (
  revealedNumbers: Record<string, number>
): {
  isValid: boolean;
  hasWon: boolean;
  prize: string | null;
} => {
  // For now, just implement a simple win condition:
  // 1. User has revealed at least one number
  // 2. User wins if they revealed the number 7
  const isValid = Object.keys(revealedNumbers).length > 0;
  const hasWon = Object.values(revealedNumbers).includes(7);

  return {
    isValid,
    hasWon,
    prize: hasWon ? "Congratulations! You won $10!" : null,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: ValidateGameRequest = await request.json();
    const { revealedNumbers } = body;

    console.log("Revealed numbers received:", revealedNumbers);

    const { isValid, hasWon, prize } = validateGameResult(revealedNumbers);

    return NextResponse.json({
      success: true,
      valid: isValid,
      won: hasWon,
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

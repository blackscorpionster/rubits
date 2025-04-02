import { NextRequest, NextResponse } from "next/server";

interface ValidateGameRequest {
  revealedNumbers: Record<string, number>;
  ticketId?: string | null;
  matchingTilesToWin?: number;
}

const validateGameResult = (
  revealedNumbers: Record<string, number>,
  matchingTilesToWin: number = 3 // Default to 3 if not provided
): {
  isValid: boolean;
  hasWon: boolean;
  prize: string | null;
} => {
  // Check if user has revealed all 9 numbers
  const isValid = Object.keys(revealedNumbers).length === 9;

  let hasWon = false;
  let winningNumber = null;

  // Convert the flat map of revealed numbers to a 3x3 grid for easier checking
  const grid: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  // Fill the grid with revealed numbers
  for (const position in revealedNumbers) {
    const [row, col] = position.split("-").map(Number);
    if (row >= 0 && row < 3 && col >= 0 && col < 3) {
      grid[row][col] = revealedNumbers[position];
    }
  }

  // Count occurrences of each number across the entire grid
  const totalCounts: Record<number, number> = {};
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const num = grid[row][col];
      if (num !== 0) {
        totalCounts[num] = (totalCounts[num] || 0) + 1;
        if (totalCounts[num] >= matchingTilesToWin) {
          hasWon = true;
          winningNumber = num;
        }
      }
    }
  }

  const prizeAmounts = {
    1: "$1",
    2: "$2",
    3: "$5",
    4: "$10",
    5: "$20",
    6: "$50",
    7: "$100",
    8: "$500",
    9: "$1000",
  };

  return {
    isValid,
    hasWon,
    prize: hasWon
      ? `Congratulations! You won ${
          prizeAmounts[winningNumber as keyof typeof prizeAmounts] || "$10"
        }!`
      : null,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: ValidateGameRequest = await request.json();
    const { revealedNumbers, matchingTilesToWin: matchingTilesToWin = 3 } =
      body;

    console.log("Revealed numbers received:", revealedNumbers);
    console.log("Match tiles to win:", matchingTilesToWin);

    const { isValid, hasWon, prize } = validateGameResult(
      revealedNumbers,
      matchingTilesToWin
    );

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

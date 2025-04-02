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
  let maxMatchingTiles = 0;

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

  // Check rows for matching numbers
  for (let row = 0; row < 3; row++) {
    const counts: Record<number, number> = {};
    for (let col = 0; col < 3; col++) {
      const num = grid[row][col];
      if (num !== 0) {
        counts[num] = (counts[num] || 0) + 1;
        maxMatchingTiles = Math.max(maxMatchingTiles, counts[num]);
        if (counts[num] >= matchingTilesToWin) {
          hasWon = true;
          winningNumber = num;
        }
      }
    }
  }

  // Check columns for matching numbers
  for (let col = 0; col < 3; col++) {
    const counts: Record<number, number> = {};
    for (let row = 0; row < 3; row++) {
      const num = grid[row][col];
      if (num !== 0) {
        counts[num] = (counts[num] || 0) + 1;
        maxMatchingTiles = Math.max(maxMatchingTiles, counts[num]);
        if (counts[num] >= matchingTilesToWin) {
          hasWon = true;
          winningNumber = num;
        }
      }
    }
  }

  // Check diagonals for matching numbers
  // Main diagonal (top-left to bottom-right)
  const diagCounts1: Record<number, number> = {};
  for (let i = 0; i < 3; i++) {
    const num = grid[i][i];
    if (num !== 0) {
      diagCounts1[num] = (diagCounts1[num] || 0) + 1;
      maxMatchingTiles = Math.max(maxMatchingTiles, diagCounts1[num]);
      if (diagCounts1[num] >= matchingTilesToWin) {
        hasWon = true;
        winningNumber = num;
      }
    }
  }

  // Other diagonal (top-right to bottom-left)
  const diagCounts2: Record<number, number> = {};
  for (let i = 0; i < 3; i++) {
    const num = grid[i][2 - i];
    if (num !== 0) {
      diagCounts2[num] = (diagCounts2[num] || 0) + 1;
      maxMatchingTiles = Math.max(maxMatchingTiles, diagCounts2[num]);
      if (diagCounts2[num] >= matchingTilesToWin) {
        hasWon = true;
        winningNumber = num;
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
    const { revealedNumbers, matchingTilesToWin: matchingTilesToWin = 3 } = body;

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

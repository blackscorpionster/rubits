import { NextRequest, NextResponse } from "next/server";

interface ValidateGameRequest {
  revealedNumbers: Record<string, number>;
  ticketId?: string | null;
}

const validateGameResult = (
  revealedNumbers: Record<string, number>
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
  
  // Check rows for 3 of the same number
  for (let row = 0; row < 3; row++) {
    if (grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2] && grid[row][0] !== 0) {
      hasWon = true;
      winningNumber = grid[row][0];
      break;
    }
  }
  
  // Check columns for 3 of the same number (additional win condition)
  if (!hasWon) {
    for (let col = 0; col < 3; col++) {
      if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col] && grid[0][col] !== 0) {
        hasWon = true;
        winningNumber = grid[0][col];
        break;
      }
    }
  }
  
  // Check diagonals for 3 of the same number (additional win condition)
  if (!hasWon) {
    // Main diagonal (top-left to bottom-right)
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] !== 0) {
      hasWon = true;
      winningNumber = grid[0][0];
    }
    // Other diagonal (top-right to bottom-left)
    else if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0] && grid[0][2] !== 0) {
      hasWon = true;
      winningNumber = grid[0][2];
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
    9: "$1000"
  };

  return {
    isValid,
    hasWon,
    prize: hasWon ? `Congratulations! You won ${prizeAmounts[winningNumber as keyof typeof prizeAmounts] || "$10"}!` : null,
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

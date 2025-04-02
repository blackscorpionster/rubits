"use client";

import React, { useState, useEffect } from "react";
import { ScratchGrid } from "./components";

interface GridItem {
  id: string;
  value: number;
}

interface Ticket {
  id: string;
  name: string;
  gridSizeX: number;
  gridSizeY: number;
  drawId: string;
  gridElements: GridItem[];
  md5: string;
  tierId: string;
  playerId: string;
}

interface ValidationResult {
  success: boolean;
  valid?: boolean;
  won?: boolean;
  prize?: string | null;
  message?: string;
}

// TODO: Add an image generated from AI here? Hamish on it...
const PlayPage: React.FC = () => {
  const [revealedNumbers, setRevealedNumbers] = useState<
    Record<string, number>
  >({});
  const [gridData, setGridData] = useState<GridItem[]>([]);
  const [ticketData, setTicketData] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch ticket data from the API - using mock data for now
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get-ticket");
        const result = await response.json();

        if (result.success) {
          setTicketData(result.data);
          setGridData(result.data.gridElements);
        } else {
          setError(result.message || "Failed to fetch ticket data");
          const mockData = getMockGridData();
          setGridData(mockData);
        }
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError("Error connecting to server");
        const mockData = getMockGridData();
        setGridData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  // Mock grid data for fallback
  const getMockGridData = (): GridItem[] => {
    const winningSet = [
      { id: "0-0", value: 7 },
      { id: "0-1", value: 3 },
      { id: "0-2", value: 8 },
      { id: "1-0", value: 7 },
      { id: "1-1", value: 5 },
      { id: "1-2", value: 2 },
      { id: "2-0", value: 7 },
      { id: "2-1", value: 4 },
      { id: "2-2", value: 9 },
    ];

    const regularSet = [
      { id: "0-0", value: 5 },
      { id: "0-1", value: 9 },
      { id: "0-2", value: 2 },
      { id: "1-0", value: 3 },
      { id: "1-1", value: 1 },
      { id: "1-2", value: 8 },
      { id: "2-0", value: 6 },
      { id: "2-1", value: 4 },
      { id: "2-2", value: 7 },
    ];

    return Math.random() > 0.5 ? winningSet : regularSet; // 50% chance of winning set being returned
  };

  // Mock ticket
  const getMockTicket = (): Ticket => {
    return {
      id: "ticket-" + Math.floor(Math.random() * 1000),
      name: "Sample Ticket",
      gridSizeX: 3,
      gridSizeY: 3,
      drawId: "draw-" + Math.floor(Math.random() * 100),
      gridElements: getMockGridData(),
      md5: "d41d8cd98f00b204e9800998ecf8427e", // Sample MD5 hash
      tierId: "tier-" + Math.floor(Math.random() * 5),
      playerId: "player-" + Math.floor(Math.random() * 1000),
    };
  };

  const handleNumberRevealed = (id: string, value: number) => {
    setRevealedNumbers((prev: Record<string, number>) => {
      const newRevealedNumbers = {
        ...prev,
        [id]: value,
      };

      if (Object.keys(newRevealedNumbers).length === gridData.length) {
        alert("All numbers revealed! Ready to check for a win!");
      }

      return newRevealedNumbers;
    });
  };

  const handleValidate = async () => {
    try {
      setSubmitting(true);
      setValidationResult(null);

      const response = await fetch("/api/validate-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revealedNumbers,
          ticketId: ticketData?.id || null,
        }),
      });

      const result = await response.json();
      setValidationResult(result);

      console.log("Validation result:", result);
    } catch (err) {
      console.error("Error submitting numbers:", err);
      setValidationResult({
        success: false,
        message: "Failed to submit numbers to server",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetGame = () => {
    setRevealedNumbers({});
    setValidationResult(null);
    const mockTicket = getMockTicket();
    setTicketData(mockTicket);
    setGridData(mockTicket.gridElements);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-xl">Loading game...</div>
      </main>
    );
  }

  if (error && gridData.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-xl text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Scratch-It Game</h1>

        {error && (
          <p className="text-red-500 mb-4">{error} (using fallback data)</p>
        )}

        {ticketData && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">{ticketData.name}</h2>
            <p className="text-sm text-gray-600">Ticket ID: {ticketData.id}</p>
            <p className="text-sm text-gray-600">Draw: {ticketData.drawId}</p>
          </div>
        )}

        <ScratchGrid
          gridData={gridData}
          onNumberRevealed={handleNumberRevealed}
        />

        <div className="mt-8 w-full max-w-md">
          <p className="mb-4 text-center">
            Scratch away to reveal the numbers!
          </p>
          <p className="mb-4 text-center">
            {Object.keys(revealedNumbers).length} of {gridData.length} numbers
            revealed
          </p>

          {validationResult && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                validationResult.won ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              {validationResult.success ? (
                <>
                  {validationResult.won ? (
                    <div className="text-green-700 font-bold text-xl">
                      {validationResult.prize}
                    </div>
                  ) : (
                    <div className="text-gray-700">
                      Sorry, no win this time. Try again!
                    </div>
                  )}
                </>
              ) : (
                <div className="text-red-500">{validationResult.message}</div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleValidate}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={
                Object.keys(revealedNumbers).length === 0 ||
                submitting ||
                validationResult !== null
              }
            >
              {submitting ? "Validating..." : "Validate Now"}
            </button>

            {validationResult && (
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Play Again
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlayPage;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { BuyTickets, NoTickets, ScratchGrid } from "./components";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { playWinSound } from "../../utils/audioUtils";

const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

interface GridItem {
  id: string;
  value: number;
}

interface Draw {
  id: string;
  name: string;
  numberOfTickets: number;
  ticketCost: number;
  profitPercent: number;
  gridSizeX: number;
  gridSizeY: number;
  matchingTilesToWin: number;
  tilesTheme: string;
}

interface Ticket {
  id: string;
  drawId: string;
  gridElements: number[];
  md5: string;
  status: string;
  tierId: string;
  position: number;
  dateCreated: string;
  purchasedBy: string | null;
  draw: Draw;
}

interface ValidationResult {
  success: boolean;
  valid?: boolean;
  won?: boolean;
  prize?: string | null;
  message?: string;
}

// Winning notification with animation
const WinningNotification = ({
  prize,
  onClose,
}: {
  prize: string;
  onClose: () => void;
}) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [confettiActive, setConfettiActive] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Try playing the sound again when the component mounts
    // This is a backup in case the first attempt failed
    setTimeout(() => playWinSound(), 200);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {
    setExiting(true);
    setConfettiActive(false);
    setTimeout(() => {
      onClose();
    }, 500); // Wait for exit animation to complete
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {confettiActive && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={500}
          gravity={0.15}
          colors={["#FFD700", "#FFA500", "#FF4500", "#FF1493", "#9400D3"]}
        />
      )}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-auto ${
          exiting ? "animate-fade-out" : ""
        }`}
      ></div>
      <div
        className={`relative pointer-events-auto ${
          exiting ? "animate-slide-down" : "animate-zoom-in"
        }`}
      >
        <div className="animate-bounce-slow bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold text-4xl md:text-6xl px-10 py-8 rounded-xl shadow-2xl border-4 border-yellow-300 transform rotate-2 scale-100">
          <div className="animate-pulse mb-4 text-center">🎉 WINNER! 🎉</div>
          <div className="text-center text-yellow-300 font-extrabold animate-pulse drop-shadow-lg">
            {prize}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClose}
              className="bg-white text-pink-600 hover:bg-yellow-200 text-xl font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Keep playing!
            </button>
          </div>
        </div>
        <div className="absolute -top-8 -left-8 animate-spin-slow">
          <div className="text-yellow-300 text-6xl">🌟</div>
        </div>
        <div className="absolute -bottom-8 -right-8 animate-spin-slow-reverse">
          <div className="text-yellow-300 text-6xl">💰</div>
        </div>
        <div className="absolute top-1/4 -right-10 animate-bounce-slow delay-300">
          <div className="text-yellow-300 text-5xl">🎊</div>
        </div>
        <div className="absolute bottom-1/4 -left-10 animate-bounce-slow delay-150">
          <div className="text-yellow-300 text-5xl">🎊</div>
        </div>
      </div>
    </div>
  );
};

// Ready to reveal notification
const ReadyToReveal = ({ onReveal }: { onReveal: () => void }) => {
  const [exiting, setExiting] = useState(false);

  const handleReveal = () => {
    setExiting(true);
    setTimeout(() => {
      onReveal();
    }, 500); // Wait for exit animation to complete
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto"></div>
      <div
        className={`relative pointer-events-auto ${
          exiting ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        <div className="bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-500 text-white font-bold text-2xl md:text-4xl px-8 py-6 rounded-xl shadow-2xl border-4 border-indigo-300 transform -rotate-1 scale-100">
          <div className="text-center mb-4">✨ All Revealed! ✨</div>
          <div className="text-center text-indigo-100 font-bold">
            Ready to see if you won?
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleReveal}
              className="bg-white text-indigo-600 hover:bg-indigo-100 text-xl font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Find out!
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -left-6 animate-spin-slow">
          <div className="text-indigo-300 text-5xl">✨</div>
        </div>
        <div className="absolute -bottom-6 -right-6 animate-spin-slow-reverse">
          <div className="text-indigo-300 text-5xl">🔮</div>
        </div>
      </div>
    </div>
  );
};

// Better luck next time notification
const BetterLuckNextTime = ({ onClose }: { onClose: () => void }) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 500); // Wait for exit animation to complete
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-auto ${
          exiting ? "animate-fade-out" : ""
        }`}
      ></div>
      <div
        className={`relative pointer-events-auto ${
          exiting ? "animate-slide-down" : "animate-zoom-in"
        }`}
      >
        <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white font-bold text-2xl md:text-4xl px-8 py-6 rounded-xl shadow-2xl border-4 border-blue-300 transform rotate-1 scale-100">
          <div className="text-center mb-4">🎮 Not a Winner 🎮</div>
          <div className="text-center text-blue-100 font-bold">
            Better luck next time!
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClose}
              className="bg-white text-purple-600 hover:bg-purple-100 text-xl font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Keep playing!
            </button>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 animate-bounce-slow">
          <div className="text-blue-300 text-5xl">🍀</div>
        </div>
        <div className="absolute -bottom-6 -left-6 animate-bounce-slow delay-150">
          <div className="text-blue-300 text-5xl">🎲</div>
        </div>
      </div>
    </div>
  );
};

// TODO: Add an image generated from AI here? Hamish on it...
export default function PlayPage() {
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
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState<
    "none" | "readyToReveal" | "transitioning" | "winning" | "losing"
  >("none");
  const [showWinningAlert, setShowWinningAlert] = useState(false);
  const [showLosingAlert, setShowLosingAlert] = useState(false);
  const [showReadyToReveal, setShowReadyToReveal] = useState(false);
  const [gridKey, setGridKey] = useState<string>("initial");
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      router.push("/");
      return;
    }

    setEmail(userEmail);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  // Fetch ticket data from the real database API
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/ticket");
        const ticket = await response.json();

        if (ticket) {
          setTicketData(ticket);

          // Convert the array of numbers to the GridItem format needed by the ScratchGrid
          const formattedGridData = createGridDataFromArray(
            ticket.gridElements,
            ticket.draw.gridSizeX,
            ticket.draw.gridSizeY
          );
          setGridData(formattedGridData);
        } else {
          setError("No ticket found");
        }
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  // Convert the array of numbers to the format needed by the ScratchGrid
  const createGridDataFromArray = (
    gridElements: number[],
    gridSizeX: number,
    gridSizeY: number
  ): GridItem[] => {
    return gridElements.map((value, index) => {
      const row = Math.floor(index / gridSizeX);
      const col = index % gridSizeX;
      return {
        id: `${row}-${col}`,
        value,
      };
    });
  };

  const handleNumberRevealed = (id: string, value: number) => {
    setRevealedNumbers((prev: Record<string, number>) => {
      const newRevealedNumbers = {
        ...prev,
        [id]: value,
      };

      if (Object.keys(newRevealedNumbers).length === gridData.length) {
        setNotificationState("readyToReveal");
      }

      return newRevealedNumbers;
    });
  };

  const handleReveal = () => {
    setNotificationState("transitioning");

    // Validate the game result
    handleValidateGame();
  };

  const handleValidateGame = async () => {
    try {
      setSubmitting(true);
      setValidationResult(null);

      const response = await fetch("/api/validate-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revealedNumbers,
          ticketId: ticketData?.id || null,
          matchingTilesToWin: ticketData?.draw.matchingTilesToWin || 3,
        }),
      });

      const result = await response.json();
      setValidationResult(result);

      if (result.success) {
        if (result.won) {
          setNotificationState("winning");
          playWinSound();
        } else {
          setNotificationState("losing");
        }
      } else {
        // Handle validation error
        setError(result.message || "Validation failed");
        setNotificationState("none");
      }
    } catch (err) {
      console.error("Error validating game:", err);
      setValidationResult({
        success: false,
        message: "Failed to submit numbers to server",
      });
      setNotificationState("none");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGameReset = () => {
    setNotificationState("none");
    resetGame();
  };

  const resetGame = () => {
    setRevealedNumbers({});
    setValidationResult(null);
    // Fetch a new ticket from the database
    const fetchNewTicket = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ticket");
        const ticket = await response.json();

        if (ticket) {
          setTicketData(ticket);
          const formattedGridData = createGridDataFromArray(
            ticket.gridElements,
            ticket.draw.gridSizeX,
            ticket.draw.gridSizeY
          );
          setGridData(formattedGridData);
        } else {
          setError("No ticket found");
        }
      } catch (err) {
        console.error("Error fetching new ticket:", err);
        setError("Failed to get a new ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchNewTicket();
    setGridKey(`grid-${Date.now()}`);
  };

  useEffect(() => {
    // Prevent scrolling when notifications are shown
    if (notificationState !== "none") {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Re-enable scrolling when notifications are hidden
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [notificationState]);

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
      {notificationState === "readyToReveal" && (
        <ReadyToReveal onReveal={handleReveal} />
      )}

      {notificationState === "winning" && validationResult?.prize && (
        <WinningNotification
          prize={validationResult.prize}
          onClose={handleGameReset}
        />
      )}

      {notificationState === "losing" && (
        <BetterLuckNextTime onClose={handleGameReset} />
      )}

      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-8">
        <h1 className="font-lacquer text-4xl md:text-5xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 transform rotate-1 tracking-wider shadow-lg">
          Rub-o-Rama
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!ticketData && <NoTickets />}

        {ticketData && (
          <div className="text-center">
            <h2 className="text-xl font-semibold">{ticketData.draw.name}</h2>
            <p className="text-sm text-gray-600">Ticket ID: {ticketData.id}</p>
            <p className="text-sm text-gray-600">Draw: {ticketData.drawId}</p>
          </div>
        )}

        <ScratchGrid
          key={gridKey}
          gridData={gridData}
          onNumberRevealed={handleNumberRevealed}
        />

        <div className="w-full max-w-md">
          <p className="mb-4 text-center">
            Scratch away to reveal the numbers!
          </p>
          <p className="mb-4 text-center">
            {Object.keys(revealedNumbers).length} of {gridData.length} numbers
            revealed
          </p>

          {notification && (
            <div className="mb-6 p-4 bg-blue-100 rounded-lg text-center text-blue-700">
              {notification}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleValidateGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={
                Object.keys(revealedNumbers).length === 0 ||
                submitting ||
                notificationState !== "none"
              }
            >
              {submitting ? "Validating..." : "Validate Now"}
            </button>

            {validationResult && notificationState === "none" && (
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Play Again
              </button>
            )}
          </div>

          <div>
            <BuyTickets />
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

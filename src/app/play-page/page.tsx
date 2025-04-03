"use client";

import React, { useState, useEffect, useRef } from "react";
import { NoTickets, ScratchGrid } from "./components";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { playWinSound } from "../../utils/audioUtils";
import { BuyTicketsContainer } from "./components/BuyTicketsContainer";
import { Draw, GridItem, Ticket } from "./types";

const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

interface ValidationResult {
  success: boolean;
  valid?: boolean;
  won?: boolean;
  prize?: string | null;
  message?: string;
  isLastTicket?: boolean;
}

// Winning notification with animation
const WinningNotification = ({
  prize,
  onClose,
  isLastTicket,
}: {
  prize: string;
  onClose: () => void;
  isLastTicket?: boolean;
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

    // Try playing the sound again when the component mounts.
    // Browsers dont like us playing the sonuds without a prompt, so we need to do this.
    // This is a backup in case the first attempt failed because of browser stuff
    // Will prob result in 2 - 3 sounds playing but ya know, it's a hackathon.  -ts
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
    }, 500); // needed so animation can complete before closing -ts
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
              {isLastTicket ? "Buy More Tickets" : "Keep playing!"}
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

const ReadyToReveal = ({ onReveal }: { onReveal: () => void }) => {
  const [exiting, setExiting] = useState(false);

  const handleReveal = () => {
    setExiting(true);
    setTimeout(() => {
      onReveal();
    }, 500); //  needed so animation can complete before closing -ts
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

const BetterLuckNextTime = ({
  onClose,
  isLastTicket,
}: {
  onClose: () => void;
  isLastTicket?: boolean;
}) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 500); // needed so animation can complete before closing -ts
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
              {isLastTicket ? "Buy More Tickets" : "Keep playing!"}
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

const NavigationArrows = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  disabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  disabled: boolean;
}) => {
  return (
    <div className="fixed inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-1 z-30">
      <button
        onClick={onPrev}
        className={`pointer-events-auto p-3 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all duration-300 transform ${
          hasPrev && !disabled
            ? "opacity-100 hover:scale-110"
            : "opacity-0 cursor-default"
        }`}
        disabled={!hasPrev || disabled}
        aria-label="Previous ticket"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        className={`pointer-events-auto p-3 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all duration-300 transform ${
          hasNext && !disabled
            ? "opacity-100 hover:scale-110"
            : "opacity-0 cursor-default"
        }`}
        disabled={!hasNext || disabled}
        aria-label="Next ticket"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Ticket Carousel component
const TicketCarousel = ({
  tickets,
  currentIndex,
  ticketsData,
  onNumberRevealed,
}: {
  tickets: Ticket[];
  currentIndex: number;
  ticketsData: Record<
    string,
    {
      gridData: GridItem[];
      gridKey: string;
      revealedNumbers: Record<string, number>;
    }
  >;
  onNumberRevealed: (ticketId: string, id: string, value: number) => void;
}) => {
  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {tickets.map((ticket, index) => {
          const ticketDataInfo = ticketsData[ticket.id];
          if (!ticketDataInfo) {
            console.warn(`No data found for ticket ${ticket.id}`);
            return null;
          }

          return (
            <div
              key={ticket.id}
              className="min-w-full flex justify-center items-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[600px] min-w-[300px]">
                  <ScratchGrid
                    key={ticketDataInfo.gridKey}
                    gridData={ticketDataInfo.gridData}
                    onNumberRevealed={(id, value) => {
                      console.log(
                        `Revealing cell ${id} with value ${value} for ticket ${ticket.id}`
                      );
                      onNumberRevealed(ticket.id, id, value);
                    }}
                    preRevealedNumbers={ticketDataInfo.revealedNumbers}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// TODO: Add an image generated from AI here? Hamish on it...
export default function PlayPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [ticketsData, setTicketsData] = useState<
    Record<
      string,
      {
        gridData: GridItem[];
        gridKey: string;
        revealedNumbers: Record<string, number>;
      }
    >
  >({});

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
  const [reloadTickets, setReloadTickets] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState<
    "none" | "readyToReveal" | "transitioning" | "winning" | "losing"
  >("none");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const router = useRouter();

  const handleReloadTickets = (reloadTickets: boolean) => {
    setReloadTickets(reloadTickets);
  };

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const playerId =
        typeof window !== "undefined" ? localStorage.getItem("playerId") : null;
      const response = await fetch(
        `/api/ticket?playerId=${encodeURIComponent(
          playerId ?? ""
        )}&ticketStatus=intact`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const ticketsJson = await response.json();

      if (ticketsJson?.tickets?.length > 0) {
        const allTickets: Ticket[] = ticketsJson.tickets.map((ticket: any) => ({
          id: ticket.id,
          drawId: ticket.drawId,
          gridElements: ticket.gridElements,
          md5: ticket.md5,
          status: ticket.status,
          tierId: ticket.tierId,
          position: ticket.position,
          dateCreated: ticket.dateCreated,
          purchasedBy: ticket.purchasedBy,
          draw: {
            id: ticket.draw.id,
            name: ticket.draw.name,
            numberOfTickets: ticket.draw.numberOfTickets,
            ticketCost: ticket.draw.ticketCost,
            profitPercent: ticket.draw.profitPercent,
            gridSizeX: ticket.draw.gridSizeX,
            gridSizeY: ticket.draw.gridSizeY,
            matchingTilesToWin: ticket.draw.matchingTilesToWin,
            tilesTheme: ticket.draw.tilesTheme,
          },
        }));
        setTickets(allTickets);

        setTicketData(allTickets[0]);

        const initialTicketsData = initializeTicketData(allTickets);
        setTicketsData(initialTicketsData);

        setGridData(initialTicketsData[allTickets[0].id].gridData);
        setCurrentTicketIndex(0);
      } else {
        setTickets([]);
        setTicketData(null);
        setGridData([]);
      }
    } catch (err) {
      console.error("Error fetching ticket data:", err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const playerId = localStorage.getItem("playerId");

      if (!playerId) {
        router.push("/");
        return;
      }

      setPlayerId(playerId);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customImage");
      localStorage.removeItem("playerId");
    }
    router.push("/");
  };

  const initializeTicketData = (tickets: Ticket[]) => {
    const newTicketsData: Record<
      string,
      {
        gridData: GridItem[];
        gridKey: string;
        revealedNumbers: Record<string, number>;
      }
    > = {};

    tickets.forEach((ticket) => {
      const formattedGridData = createGridDataFromArray(
        ticket.gridElements,
        ticket.draw.gridSizeX,
        ticket.draw.gridSizeY
      );

      newTicketsData[ticket.id] = {
        gridData: formattedGridData,
        gridKey: `grid-${ticket.id}-${Date.now()}`,
        revealedNumbers: {},
      };
    });

    return newTicketsData;
  };

  useEffect(() => {
    if (reloadTickets) {
      fetchTicketData();
      setReloadTickets(false);
    }
  }, [reloadTickets]);

  // update the current ticket when sliding between them -ts
  useEffect(() => {
    if (
      tickets.length > 0 &&
      currentTicketIndex >= 0 &&
      currentTicketIndex < tickets.length
    ) {
      const currentTicket = tickets[currentTicketIndex];
      setTicketData(currentTicket);

      if (ticketsData[currentTicket.id]) {
        setGridData(ticketsData[currentTicket.id].gridData);
        setRevealedNumbers(ticketsData[currentTicket.id].revealedNumbers);

        // see if all tickets are already scratched -ts
        const currentTicketData = ticketsData[currentTicket.id];
        const allRevealed =
          Object.keys(currentTicketData.revealedNumbers).length >=
          currentTicketData.gridData.length;

        const isScratched = currentTicket.status === "scratched";

        if ((allRevealed || isScratched) && notificationState === "none") {
          console.log(
            "All cells already revealed on navigation or ticket marked as scratched, showing notification"
          );
          setNotificationState("readyToReveal");
        } else if (!allRevealed && !isScratched) {
          setNotificationState("none");
          setValidationResult(null);
        }
      }
    }
  }, [currentTicketIndex, tickets, ticketsData]);

  // Convert the array of numbers to the format needed by the ScratchGrid - stolen off v0.dev
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

  const goToNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      // Save current ticket in local state before switching -ts
      // TODO: This is hacky AF - I mean it all is - but this especially so
      if (ticketData) {
        setTicketsData((prev) => ({
          ...prev,
          [ticketData.id]: {
            ...prev[ticketData.id],
            revealedNumbers: { ...revealedNumbers },
          },
        }));
      }

      setCurrentTicketIndex(currentTicketIndex + 1);
    }
  };

  const goToPrevTicket = () => {
    if (currentTicketIndex > 0) {
      // Save current ticket state before switching -ts
      if (ticketData) {
        setTicketsData((prev) => ({
          ...prev,
          [ticketData.id]: {
            ...prev[ticketData.id],
            revealedNumbers: { ...revealedNumbers },
          },
        }));
      }

      setCurrentTicketIndex(currentTicketIndex - 1);
    }
  };

  const handleNumberRevealed = (
    ticketId: string,
    id: string,
    value: number
  ) => {
    setTicketsData((prev) => {
      const ticketData = prev[ticketId];
      if (!ticketData) return prev;

      const newRevealedNumbers = {
        ...ticketData.revealedNumbers,
        [id]: value,
      };

      if (ticketId === tickets[currentTicketIndex]?.id) {
        setRevealedNumbers(newRevealedNumbers);

        // Check if all numbers are revealed for the current ticket
        // Log to debug
        console.log(
          `Revealed: ${Object.keys(newRevealedNumbers).length}, Total: ${
            ticketData.gridData.length
          }`
        );

        if (
          Object.keys(newRevealedNumbers).length >= ticketData.gridData.length
        ) {
          console.log("All cells revealed, showing notification");
          setNotificationState("readyToReveal");
        }
      }

      return {
        ...prev,
        [ticketId]: {
          ...ticketData,
          revealedNumbers: newRevealedNumbers,
        },
      };
    });
  };

  const handleReveal = () => {
    setNotificationState("transitioning");

    handleValidateGame();
  };

  const handleValidateGame = async () => {
    if (!ticketData) return;

    try {
      setSubmitting(true);
      setValidationResult(null);

      const currentTicketId = ticketData.id;
      const currentTicketData = ticketsData[currentTicketId];

      if (!currentTicketData) {
        console.error("No ticket data found for validation");
        setNotificationState("none");
        setSubmitting(false);
        return;
      }

      // Check if this is the last unscratched ticket before we mark it as scratched
      const isLastTicket = isLastUnscratchedTicket();
      console.log("Is this the last unscratched ticket?", isLastTicket);

      const currentRevealedNumbers = currentTicketData.revealedNumbers;

      console.log(
        "Validating game with revealed numbers:",
        Object.keys(currentRevealedNumbers).length
      );

      if (currentTicketId.startsWith("mock-")) {
        console.log("Validating mock ticket", currentTicketId);

        const valueFrequency: Record<number, number> = {};
        Object.values(currentRevealedNumbers).forEach((value) => {
          valueFrequency[value] = (valueFrequency[value] || 0) + 1;
        });

        const matchingTilesToWin = ticketData.draw.matchingTilesToWin || 3;
        const maxMatches = Math.max(...Object.values(valueFrequency));
        const isWinning = maxMatches >= matchingTilesToWin;

        const mockResult: ValidationResult = {
          success: true,
          valid: true,
          won: isWinning,
          prize: isWinning ? `$${Math.floor(Math.random() * 100) + 10}` : null,
          isLastTicket: isLastTicket,
        };

        console.log("Mock validation result:", mockResult);
        setValidationResult(mockResult);

        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === currentTicketId
              ? { ...ticket, status: "scratched" }
              : ticket
          )
        );

        if (mockResult.won) {
          setNotificationState("winning");
          playWinSound();
        } else {
          setNotificationState("losing");
        }

        setSubmitting(false);
        return;
      }

      // real validation for real tickets -ts
      const playerId =
        typeof window !== "undefined" ? localStorage.getItem("playerId") : null;

      const response = await fetch("/api/validate-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revealedNumbers: currentRevealedNumbers,
          ticket: ticketData,
          matchingTilesToWin: ticketData?.draw.matchingTilesToWin || 3,
          playerId: playerId,
        }),
      });

      const result = await response.json();
      console.log("Validation result:", result);

      const resultWithLastTicket = {
        ...result,
        isLastTicket: isLastTicket,
      };

      setValidationResult(resultWithLastTicket);

      if (result.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id === currentTicketId
              ? { ...ticket, status: "scratched" }
              : ticket
          )
        );

        if (result.won) {
          setNotificationState("winning");
          playWinSound();
        } else {
          setNotificationState("losing");
        }
      } else {
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

  const findNextUnscratchedTicketIndex = (): number | null => {
    for (let i = currentTicketIndex + 1; i < tickets.length; i++) {
      const ticketId = tickets[i].id;
      const ticketData = ticketsData[ticketId];

      if (
        ticketData &&
        Object.keys(ticketData.revealedNumbers).length <
          ticketData.gridData.length
      ) {
        return i;
      }
    }

    for (let i = 0; i < currentTicketIndex; i++) {
      const ticketId = tickets[i].id;
      const ticketData = ticketsData[ticketId];

      if (
        ticketData &&
        Object.keys(ticketData.revealedNumbers).length <
          ticketData.gridData.length
      ) {
        return i;
      }
    }

    return null;
  };

  const isLastUnscratchedTicket = (): boolean => {
    let unscratchedCount = 0;

    for (let i = 0; i < tickets.length; i++) {
      const ticketId = tickets[i].id;
      const ticket = tickets[i];
      const ticketDataInfo = ticketsData[ticketId];

      if (
        ticketDataInfo &&
        ticket.status !== "scratched" &&
        Object.keys(ticketDataInfo.revealedNumbers).length <
          ticketDataInfo.gridData.length
      ) {
        unscratchedCount++;

        if (unscratchedCount > 1) {
          return false;
        }
      }
    }

    if (unscratchedCount === 1 && ticketData) {
      const currentTicketDataInfo = ticketsData[ticketData.id];
      return (
        ticketData.status !== "scratched" &&
        currentTicketDataInfo &&
        Object.keys(currentTicketDataInfo.revealedNumbers).length <
          currentTicketDataInfo.gridData.length
      );
    }

    return false;
  };

  const handleGameReset = () => {
    setNotificationState("none");

    if (validationResult?.isLastTicket) {
      setTickets([]);
      setTicketData(null);
      setGridData([]);
      setTicketsData({});

      if (typeof window !== "undefined") {
        window.location.reload();
      }
      return;
    }

    // Otherwise, find the next ticket as normal
    const nextTicketIndex = findNextUnscratchedTicketIndex();

    if (nextTicketIndex !== null) {
      setCurrentTicketIndex(nextTicketIndex);
      resetCurrentTicket();
    } else {
      // This is a fallback - we should never reach here if isLastTicket is working correctly
      setTickets([]);
      setTicketData(null);
      setGridData([]);
      setTicketsData({});
      setReloadTickets(true);
    }
  };

  const resetCurrentTicket = () => {
    if (!ticketData) return;

    const ticketId = ticketData.id;

    setRevealedNumbers({});
    setValidationResult(null);

    const newGridKey = `grid-${ticketId}-${Date.now()}`;

    setTicketsData((prev) => {
      const updatedTicketsData = {
        ...prev,
        [ticketId]: {
          ...prev[ticketId],
          revealedNumbers: {},
          gridKey: newGridKey,
        },
      };

      setGridData([...updatedTicketsData[ticketId].gridData]);

      return updatedTicketsData;
    });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notificationState !== "none") {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    // Cleanup
    return () => {
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

  const customImage =
    typeof window !== "undefined" ? localStorage.getItem("customImage") : null;
  const imageUrl = customImage ? "data:image/png;base64," + customImage : "";
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-8"
      style={{
        backgroundColor: "#1D2B53", // A nice dark blue that will complement most images
      }}
    >
      {notificationState === "readyToReveal" && (
        <ReadyToReveal onReveal={handleReveal} />
      )}

      {notificationState === "winning" && validationResult?.prize && (
        <WinningNotification
          prize={validationResult.prize}
          onClose={handleGameReset}
          isLastTicket={validationResult.isLastTicket}
        />
      )}

      {notificationState === "losing" && (
        <BetterLuckNextTime
          onClose={handleGameReset}
          isLastTicket={validationResult?.isLastTicket}
        />
      )}

      {tickets.length > 1 && (
        <NavigationArrows
          onPrev={goToPrevTicket}
          onNext={goToNextTicket}
          hasPrev={currentTicketIndex > 0}
          hasNext={currentTicketIndex < tickets.length - 1}
          disabled={notificationState !== "none"}
        />
      )}

      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-4">
        <h1 className="font-lacquer text-4xl md:text-5xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 transform rotate-1 tracking-wider shadow-lg">
          Jumbo's JumBucks
        </h1>

        {error && !error.includes("Invalid ticket") && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        {tickets.length === 0 && <NoTickets />}

        {tickets.length > 0 && (
          <TicketCarousel
            tickets={tickets}
            currentIndex={currentTicketIndex}
            ticketsData={ticketsData}
            onNumberRevealed={handleNumberRevealed}
          />
        )}

        <div className="w-full max-w-md">
          {notification && (
            <div className="mb-6 p-4 bg-blue-100 rounded-lg text-center text-blue-700 relative">
              {notification}
              <button
                onClick={dismissNotification}
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
                aria-label="Dismiss notification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {tickets.length > 1 && (
            <div className="flex justify-center gap-2 mt-4 mb-4">
              {tickets.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    notificationState === "none" && setCurrentTicketIndex(index)
                  }
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTicketIndex
                      ? "bg-pink-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  } ${
                    notificationState !== "none"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={notificationState !== "none"}
                  aria-label={`Go to ticket ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div>
            <BuyTicketsContainer setTicketsPurchased={handleReloadTickets} />
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-gray-800/70 hover:bg-red-600/90 text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 border border-gray-700 z-10"
        aria-label="Logout"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </main>
  );
}

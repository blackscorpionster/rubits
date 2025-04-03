import React, { useState } from "react";
import { ErrorPopup } from "./ErrorPopup";

interface BuyTicketsProps {
  drawId: string;
  drawName: string;
  setTicketsPurchased: (purchased: boolean) => void;
}

export const BuyTickets: React.FC<BuyTicketsProps> = ({ drawId, drawName, setTicketsPurchased }) => {
  const [error, setError] = useState<string | null>(null);

    const handlePurchase = async (numTickets: number) => {
      try {
        const playerId2 = localStorage.getItem("playerId");
        const response = await fetch("/api/buy-tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ numTickets: numTickets, drawId: drawId, playerId: playerId2 }),
        });

        // Trigger ticket api to reload tickets in src/app/play-page/page.tsx
        setTicketsPurchased(true);

      if (!response.ok) {
        setError("Error purchasing tickets");
      } else {
        console.log(`Successfully purchased ${numTickets} ticket(s) for draw ${drawId}`);
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error);
    }
    };

  const buyTicketOptions = [1, 3, 5];

    return (
      <div>
        <div className="flex flex-col items-center justify-center h-full text-center mt-3 mb-5">
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 mb-3 rotate-1 transform animate-pulse-fast">
            🎮 Feeling lucky? More chances to win big with {drawName}! 🎮
          </p>
          <div className="flex space-x-3">
          {buyTicketOptions.map((num, index) => (
            <button
              key={num}
              onClick={() => handlePurchase(num)}
              className={`bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white text-xs font-bold py-2 px-3 rounded-full border-2 border-yellow-300 
              hover:scale-110 hover:rotate-${index % 2 === 0 ? "2" : "-2"}
              transition-all duration-300 shadow-lg relative
              animate-bounce-${
                index === 0 ? "slow" : index === 1 ? "" : "slow delay-150"
              }`}
            >
              <span className="relative z-10 drop-shadow-sm">
                {num === 1 ? "🎟 Buy 1!" : `🎟 Buy ${num}!`}
              </span>
              <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            ))}
          </div>
        </div>
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div>
    );
  };
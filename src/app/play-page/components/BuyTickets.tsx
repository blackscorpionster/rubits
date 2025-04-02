export const BuyTickets: React.FC = () => {
    const handlePurchase = async (numTickets: number) => {
      try {
        const response = await fetch("/api/buy-tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ numTickets: numTickets }),
        });

        if (!response.ok) {
          throw new Error("Failed to purchase tickets");
        }

        console.log(`Successfully purchased ${numTickets} ticket(s)`);
      } catch (error) {
        console.error("Error purchasing tickets:", error);
      }
    };

    const buyTicketOptions = [1, 3, 5];

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-10">
        <p className="text-xl font-semibold text-white mb-4">Purchase More Tickets:</p>
        <div className="flex space-x-4">
          {buyTicketOptions.map((num) => (
            <button
              key={num}
              onClick={() => handlePurchase(num)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {num} Ticket{num > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
    );
  };
import React from "react";

export const NoTickets: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <span className="text-6xl mb-4">😞</span>
      <h2 className="text-xl font-semibold text-white">You have no tickets</h2>
    </div>
  );
};

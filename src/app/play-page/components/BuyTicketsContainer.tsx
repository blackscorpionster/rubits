import React, { useState, useEffect } from "react";
import { BuyTickets } from "./BuyTickets";
import { Draw } from "../types";

export const BuyTicketsContainer: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [draws, setDraws] = useState<Draw[]>([]);

    useEffect(() => {
        const fetchDraws = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/open-draws");
                const draws = await response.json();

                setDraws(draws);
            } catch (err) {
                console.error("Error fetching buy ticket data:", err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchDraws();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading &&
                !error &&
                draws.map((draw) => (
                    <BuyTickets key={draw.id} drawId={draw.id} drawName={draw.name} />
                ))}
        </div>
    );
};
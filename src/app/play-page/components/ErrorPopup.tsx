import { useState, useEffect } from "react";

interface ErrorPopupProps {
  message: string;
  onClose?: () => void;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 3000);

      return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
      <div className="fixed bottom-5 right-5 bg-black text-white border border-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 left-2 text-white text-lg"
        >
          ✖
        </button>
        <p className="pl-6">{message}</p>
      </div>
    );
  };

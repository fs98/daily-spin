import { useState, useEffect } from "react";
import "./QuoteModal.css";

function QuoteModal({ isOpen, onClose }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v2/randomquotes?categories=success",
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_API_NINJAS_KEY,
          },
        },
      );
      const data = await response.json();
      if (data?.length > 0) {
        setQuote(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !quote) {
      fetchQuote();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="quote-modal-backdrop" onClick={onClose}>
      <div className="quote-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Motivational Quote</h2>

        <div className="quote-body">
          {loading ? (
            <p className="quote-loading">Loading quote...</p>
          ) : quote ? (
            <>
              <p className="quote-text">"{quote.quote}"</p>
              <p className="quote-author">— {quote.author}</p>
            </>
          ) : (
            <p className="quote-loading">Failed to load quote</p>
          )}
        </div>

        <button
          className="refresh-button"
          onClick={fetchQuote}
          disabled={loading}
        >
          {loading ? "Loading..." : "New Quote"}
        </button>
      </div>
      <p className="dismiss-hint">Click anywhere to close</p>
    </div>
  );
}

export default QuoteModal;

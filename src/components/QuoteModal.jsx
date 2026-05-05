import { useState, useEffect, useRef } from "react";
import "./QuoteModal.css";

function QuoteModal({ isOpen, onClose }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const quotesCache = useRef([]);

  const fetchQuotes = async () => {
    const base = import.meta.env.BASE_URL || "/";
    const response = await fetch(`${base}quotes.json`);
    const data = await response.json();
    if (Array.isArray(data)) {
      quotesCache.current = data.map((d) => ({ quote: d.q, author: d.a }));
    }
  };

  const showRandomQuote = () => {
    const cache = quotesCache.current;
    if (cache.length === 0) return;
    const index = Math.floor(Math.random() * cache.length);
    setQuote(cache[index]);
  };

  const handleNewQuote = async () => {
    if (quotesCache.current.length <= 1) {
      setLoading(true);
      await fetchQuotes();
      setLoading(false);
    }
    showRandomQuote();
  };

  useEffect(() => {
    if (isOpen && !quote) {
      setLoading(true);
      fetchQuotes()
        .then(() => showRandomQuote())
        .finally(() => setLoading(false));
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
          onClick={handleNewQuote}
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

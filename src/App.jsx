import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("Advice");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState("home");

  // Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchQuote = async () => {

    setLoading(true);

    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();

      setQuote(data.slip.advice);
      setAuthor("Advice API");

    } catch {

      setQuote("Believe you can and you're halfway there.");
      setAuthor("Theodore Roosevelt");

    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleLike = () => {

    const exists = favorites.some((q) => q.quote === quote);

    if (exists) {

      const updated = favorites.filter((q) => q.quote !== quote);
      setFavorites(updated);

    } else {

      setFavorites([...favorites, { quote, author }]);

    }
  };

  const removeQuote = (index) => {

    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);

  };

  const copyQuote = () => {

    navigator.clipboard.writeText(`"${quote}" - ${author}`);
    alert("Quote copied!");

  };

  const isLiked = favorites.some((q) => q.quote === quote);

  return (

    <div className="page">

      {page === "home" ? (

        <>
          <button
            className="pageBtn"
            onClick={() => setPage("favorites")}
          >
            ❤️
          </button>

          <div className="content">

            <h1 className="title">Daily Motivation</h1>

            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <>
                <p className="quote">"{quote}"</p>
                <p className="author">— {author}</p>
              </>
            )}

            <div className="buttons">

              <button onClick={fetchQuote}>
                New Quote
              </button>

              <button
                onClick={toggleLike}
                style={{ color: isLiked ? "red" : "white" }}
              >
                ❤️ Liked
              </button>

              <button onClick={copyQuote}>
                Copy
              </button>

            </div>

          </div>
        </>

      ) : (

        <>
          <button
            className="backBtn"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <h1 className="title">Favorite Quotes</h1>

          {favorites.length === 0 ? (
            <p>No favorites yet</p>
          ) : (
            favorites.map((item, index) => (
              <div key={index} className="favCard">

                <p>"{item.quote}"</p>
                <p>— {item.author}</p>

                <button onClick={() => removeQuote(index)}>
                  Remove
                </button>

              </div>
            ))
          )}

        </>

      )}

    </div>

  );
}

export default App;
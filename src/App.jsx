import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null); // modal ke liye
  const [loading, setLoading] = useState(false);

  const API_KEY = "YOUR_API_KEY_HERE"; // ← apni key daalo

  // Search Handler
  let searchHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response = await axios.get(
        `https://www.omdbapi.com/?apikey=6b76523d&s=${searchTerm}`
      );

      if (response.data.Response === "True") {
        setMovies(response.data.Search);
      } else {
        setError(response.data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Movie pe click → details fetch karo
  let movieClickHandler = async (imdbID) => {
    try {
      let response = await axios.get(
        `https://www.omdbapi.com/?apikey=6b76523d&i=${imdbID}&plot=full`
      );
      setSelectedMovie(response.data); // pura detail object save karo
    } catch (err) {
      console.log("Error fetching details:", err);
    }
  };

  // Modal band karo
  let closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="app-container">
      <h1>🎬 Movie Search</h1>

      <form onSubmit={searchHandler} className="search-form">
        <input
          type="text"
          placeholder="Search movie name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="loading-msg">Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {/* Movies Grid - 4 per row */}
      <div className="movies-grid">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.imdbID}
            onClick={() => movieClickHandler(movie.imdbID)}
          >
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>

      {/* MODAL - jab koi movie select ho */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✕</button>

            <div className="modal-body">
              <img
                src={
                  selectedMovie.Poster !== "N/A"
                    ? selectedMovie.Poster
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={selectedMovie.Title}
                className="modal-poster"
              />

              <div className="modal-info">
                <h2>{selectedMovie.Title}</h2>
                <p className="modal-meta">
                  {selectedMovie.Year} • {selectedMovie.Runtime} • {selectedMovie.Rated}
                </p>

                <div className="modal-rating">
                  ⭐ {selectedMovie.imdbRating} / 10
                  <span className="votes"> ({selectedMovie.imdbVotes} votes)</span>
                </div>

                <p className="modal-plot">{selectedMovie.Plot}</p>

                <div className="modal-details">
                  <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                  <p><strong>Director:</strong> {selectedMovie.Director}</p>
                  <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
                  <p><strong>Language:</strong> {selectedMovie.Language}</p>
                  <p><strong>Awards:</strong> {selectedMovie.Awards}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
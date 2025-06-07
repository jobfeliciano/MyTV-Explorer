import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Show from './Show';
import { useLocation } from 'react-router-dom';

const CategoriesShows = () => {
  const location = useLocation();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [shows, setShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  // Récupération des genres TV
  useEffect(() => {
    axios
      .get('https://api.themoviedb.org/3/genre/tv/list?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US')
      .then((res) => {
        setGenres(res.data.genres);
      })
      .catch((err) => console.error(err));
  }, []);

  // Initialiser la catégorie sélectionnée depuis location.state (si disponible)
  useEffect(() => {
    if (location.state && location.state.id) {
      setSelectedGenre(location.state.id);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedGenre) {
      setCurrentPage(1);
    }
  }, [selectedGenre]);

  // Récupération des séries pour le genre sélectionné et la page donnée
  useEffect(() => {
    if (selectedGenre) {
      setLoadingShows(true);
      axios
        .get(
          `https://api.themoviedb.org/3/discover/tv?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US&page=${currentPage}&with_genres=${selectedGenre}`
        )
        .then((res) => {
          setShows(res.data.results);
          setLoadingShows(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingShows(false);
        });
    }
  }, [selectedGenre, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="categorie-show">
      <h1>Catégories de Séries</h1>
      <div className="genre-list">
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-chip ${selectedGenre === genre.id ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <div className="shows-container">
        {loadingShows ? (
          <div className="loading">Chargement...</div>
        ) : selectedGenre ? (
          shows.length > 0 ? (
            <>
              <div className="shows-grid">
                {shows.map((show) => (
                  <Show key={show.id} show={show} />
                ))}
              </div>
              <div className="pagination">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  Première page
                </button>
                <button className="prev-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
                  Précédent
                </button>
                <span>Page {currentPage}</span>
                <button className="next-btn" onClick={handleNextPage} /* À désactiver selon la réponse API si nécessaire */>
                  Suivant
                </button>
              </div>
            </>
          ) : (
            <div className="placeholder">
              <p>Aucune série trouvée pour cette catégorie.</p>
            </div>
          )
        ) : (
          <div className="placeholder">
            <p>Veuillez sélectionner une catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesShows;

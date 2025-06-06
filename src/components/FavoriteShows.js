import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import Show from "./Show";

const FavoriteShows = () => {
  const history = useHistory();
  // Initialisation de currentUser depuis le localStorage
  const storedUser = localStorage.getItem("user");
  const [currentUser, setCurrentUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [shows, setShows] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const showsPerPage = 18;

  // Mise à jour de l'utilisateur depuis le serveur pour récupérer les données actuelles
  useEffect(() => {
    if (currentUser) {
      axios.get(`http://localhost:3005/users/${currentUser.id}`)
        .then(res => {
          setCurrentUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(err => console.error(err));
    }
  }, [currentUser?.id]);

  // Récupération des séries favorites en fonction de currentUser.favorites
  useEffect(() => {
    if (currentUser && currentUser.favorites && currentUser.favorites.length > 0) {
      const fetchFavorites = async () => {
        try {
          const promises = currentUser.favorites.map(tvId =>
            axios.get(`https://api.themoviedb.org/3/tv/${tvId}?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`)
          );
          const responses = await Promise.all(promises);
          const favoritesData = responses.map(res => res.data);
          setShows(favoritesData);
        } catch (error) {
          console.error("Erreur lors de la récupération des favoris :", error);
        }
      };
      fetchFavorites();
    }
  }, [currentUser]);

  // Pagination
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(shows.length / showsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="favorites-page">
      <h1>Mes Séries Favorites</h1>
      {shows.length === 0 ? (
        <p>Vous n'avez pas encore ajouté de séries favorites.</p>
      ) : (
        <>
          <div className="favorites-grid">
            {currentShows.map((show) => (
              <div key={show.id} className="favorite-card">
                <Show show={show} />
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteShows;

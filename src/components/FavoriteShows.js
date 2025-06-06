import React, { useState, useEffect } from "react";
import axios from "axios";
import Show from "./Show";

const FavoriteShows = () => {
  // On récupère d’abord l’utilisateur stocké (avec son ID)
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.id || null;

  const [currentUser, setCurrentUser] = useState(parsedUser);
  const [shows, setShows] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const showsPerPage = 18;

  // 1) On va chercher les infos à jour de l’utilisateur côté serveur dès que son ID est connu
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3005/users/${userId}`)
      .then((res) => {
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch((err) => console.error(err));
  }, [userId]);

  // 2) Dès que currentUser change (et que l’on a un tableau favorites), on récupère chaque série TMDb
  useEffect(() => {
    if (
      !currentUser ||
      !Array.isArray(currentUser.favorites) ||
      currentUser.favorites.length === 0
    ) {
      setShows([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        // On inverse le tableau des IDs pour obtenir l’ordre décroissant d’ajout
        const favoriteIdsDesc = [...currentUser.favorites].reverse();

        const promises = favoriteIdsDesc.map((tvId) =>
          axios.get(
            `https://api.themoviedb.org/3/tv/${tvId}?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`
          )
        );
        const responses = await Promise.all(promises);
        const favoritesData = responses.map((res) => res.data);
        setShows(favoritesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  // Pagination
  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = shows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(shows.length / showsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
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
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteShows;

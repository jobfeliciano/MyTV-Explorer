import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Actor from '../components/Actor';
import Navigation from '../components/Navigation';
import { useHistory } from 'react-router-dom';

const ShowDetails = (props) => {
  const history = useHistory();
  const id = props.location.state.id; // ID de la série
  const [details, setDetails] = useState({});
  const [credits, setCredits] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState({});
  
  // Pour gérer l'état des favoris
  const [heartState, setHeartState] = useState("none");
  const [user, setUser] = useState(null);
  const isAuthenticated = localStorage.getItem("user") ? true : false;
  
  // Pour la gestion de la bande annonce
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Récupération des détails de la série et des crédits
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/tv/${id}?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`)
      .then((res) => {
        setDetails(res.data);
        if (res.data.seasons && res.data.seasons.length > 0) {
          const validSeasons = res.data.seasons.filter(s => s.season_number > 0);
          if (validSeasons.length > 0) {
            setSelectedSeason(validSeasons[0].season_number);
          }
        }
      })
      .catch((err) => console.error(err));

    axios
      .get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`)
      .then((res) => {
        const sortedCast = res.data.cast
          .sort((a, b) => a.order - b.order)
          .slice(0, 8);
        setCredits(sortedCast);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Récupération des détails de la saison sélectionnée
  useEffect(() => {
    if (selectedSeason) {
      axios
        .get(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`)
        .then((res) => setSeasonDetails(res.data))
        .catch((err) => console.error(err));
    }
  }, [id, selectedSeason]);

  // Vérification et chargement de l'utilisateur connecté
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      axios.get(`http://localhost:3005/users/${storedUser.id}`)
        .then(res => {
          const favorites = res.data.favorites || [];
          if (favorites.includes(details.id)) {
            setHeartState("full");
          } else {
            setHeartState("empty");
          }
        })
        .catch(err => console.error(err));
    }
  }, [isAuthenticated, details.id]);

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  };

  const handleActorClick = (actorId) => {
    history.push('/actorDetails', { id: actorId });
  };

  // Gestion du favori dans ShowDetails
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) return;
    if (heartState === "empty" || heartState === "broken") {
      try {
        const userRes = await axios.get(`http://localhost:3005/users/${user.id}`);
        const currentFavorites = userRes.data.favorites || [];
        const updatedFavorites = [...currentFavorites, details.id];
        await axios.patch(`http://localhost:3005/users/${user.id}`, { favorites: updatedFavorites });
        setHeartState("full");
      } catch (error) {
        console.error("Erreur lors de l'ajout aux favoris :", error);
      }
    } else if (heartState === "full") {
      try {
        const userRes = await axios.get(`http://localhost:3005/users/${user.id}`);
        const currentFavorites = userRes.data.favorites || [];
        const updatedFavorites = currentFavorites.filter(favId => favId !== details.id);
        await axios.patch(`http://localhost:3005/users/${user.id}`, { favorites: updatedFavorites });
        setHeartState("broken");
      } catch (error) {
        console.error("Erreur lors de la suppression des favoris :", error);
      }
    }
  };

  // Fonction pour charger la bande annonce
  const handleTrailerClick = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`
      );
      const videos = response.data.results;
      // Recherche d'une vidéo de type "Trailer" 
      const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
      if (trailer) {
        const embedUrl = `https://www.youtube.com/embed/${trailer.key}`;
        setTrailerUrl(embedUrl);
        setShowTrailerModal(true);
      } else {
        alert("Bande annonce non disponible.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la bande annonce :", error);
    }
  };

  // Fonction pour fermer la modal
  const closeTrailerModal = () => {
    setShowTrailerModal(false);
    setTrailerUrl("");
  };

  // Formatage pour l'année
  const year = details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : '';

  // Genres en liens cliquables
  const renderGenres = () => {
    if (!details.genres || details.genres.length === 0) return "";
    return details.genres.map((g, idx) => (
      <span key={g.id}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            history.push("/categories", { id: g.id, name: g.name });
          }}
          className="genre-link"
        >
          {g.name}
        </a>
        {idx < details.genres.length - 1 ? ", " : ""}
      </span>
    ));
  };

  // Image de fond
  const backgroundImage = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : details.poster_path
    ? `https://image.tmdb.org/t/p/original${details.poster_path}`
    : '/noimg.jpg';

  const averageRunTime = details.episode_run_time
    ? details.episode_run_time[0]
    : 0;

  // Détermine l'icône du favori
  let heartIconSrc = "";
  if (heartState === "empty") {
    heartIconSrc = "/icons/heart-empty.png";
  } else if (heartState === "full") {
    heartIconSrc = "/icons/heart-full.png";
  } else if (heartState === "broken") {
    heartIconSrc = "/icons/heart-broken.png";
  }

  return (
    <div>
      <Navigation />
      <div className="show-details">
        {/* Section Hero */}
        <div
          className="hero-section"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="poster-container">
                <img
                  className="poster"
                  src={
                    details.poster_path
                      ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
                      : '/noimg.jpg'
                  }
                  alt={details.name}
                />
              </div>
              <div className="info-container">
                <h1>{details.name}</h1>
                <p className="sub-info">
                  {year} • {renderGenres()}
                  {averageRunTime ? ` • ${averageRunTime} min` : ''}
                </p>
                <p className="overview">{details.overview}</p>
                {/* Conteneur des actions */}
                <div className="actions-container">
                  <button className="trailer-btn" onClick={handleTrailerClick}>
                    Bande Annonce
                  </button>
                  {isAuthenticated && (
                    <img
                      src={heartIconSrc}
                      alt="Favori"
                      className="fav-icon"
                      onClick={handleFavoriteClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Saison */}
        <div className="season-section">
          <h2>
            {details.name} - Saison {selectedSeason}{' '}
            {seasonDetails.episodes && seasonDetails.episodes.length > 0 ? (
              <span>({seasonDetails.episodes.length} épisodes)</span>
            ) : null}
          </h2>
          <div className="season-dropdown">
            <label htmlFor="season-select">Choisissez une saison :</label>
            <select
              id="season-select"
              value={selectedSeason || ''}
              onChange={handleSeasonChange}
            >
              {details.seasons &&
                details.seasons
                  .filter(season => season.season_number > 0)
                  .map(season => (
                    <option key={season.id} value={season.season_number}>
                      Saison {season.season_number} ({season.episode_count} épisodes)
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Section Acteurs */}
        <div className="actors-section comms-bg">
          <h2>Acteurs Principaux</h2>
          <ul className="actors-list">
            {credits.map((actor) => (
              <li key={actor.id}>
                <Actor actor={actor} onClick={() => handleActorClick(actor.id)} />
              </li>
            ))}
          </ul>
        </div>

        {/* Section Épisodes */}
        <div className="episodes-section">
          <h2>Liste des Épisodes</h2>
          {seasonDetails.episodes && seasonDetails.episodes.length > 0 ? (
            <div className="episodes-list">
              {seasonDetails.episodes.map(ep => (
                <div key={ep.id} className="episode-item">
                  {ep.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/original${ep.still_path}`}
                      alt={ep.name}
                      className="episode-still"
                    />
                  ) : (
                    <div className="episode-still placeholder-image">No Image</div>
                  )}
                  <div className="episode-info">
                    <h3>
                      S{seasonDetails.season_number} E{ep.episode_number} - {ep.name}
                    </h3>
                    <p className="episode-meta">
                      {ep.air_date} • {ep.runtime ? `${ep.runtime} min` : '...'}
                    </p>
                    <p className="episode-overview">{ep.overview}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Aucun épisode disponible.</p>
          )}
        </div>
      </div>

      {/* Modal pour Bande Annonce */}
      {showTrailerModal && (
        <div className="trailer-modal" onClick={closeTrailerModal}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeTrailerModal}>&times;</span>
            {trailerUrl ? (
              <iframe
                width="100%"
                height="400"
                src={trailerUrl}
                title="Bande Annonce"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>Bande annonce non disponible.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDetails;

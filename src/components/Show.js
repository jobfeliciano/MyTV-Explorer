import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Show = ({ show }) => {
  const history = useHistory();

  const isAuthenticated = !!localStorage.getItem("user");
  const [user, setUser] = useState(null);
  const [heartState, setHeartState] = useState("none");

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      axios.get(`https://mytv-jsonserver-production.up.railway.app/users/${storedUser.id}`)
        .then(res => {
          const favs = res.data.favorites || [];
          setHeartState(favs.includes(show.id) ? "full" : "empty");
        })
        .catch(console.error);
    }
  }, [isAuthenticated, show.id]);

  const handleFavoriteClick = async e => {
    e.stopPropagation();
    if (!user) return;
    try {
      const res = await axios.get(`https://mytv-jsonserver-production.up.railway.app/users/${user.id}`);
      const favs = res.data.favorites || [];
      let updated;
      if (heartState === "full") {
        updated = favs.filter(id => id !== show.id);
        setHeartState("broken");
      } else {
        updated = [...favs, show.id];
        setHeartState("full");
      }
      await axios.patch(`https://mytv-jsonserver-production.up.railway.app/users/${user.id}`, { favorites: updated });
      const newUser = { ...user, favorites: updated };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowClick = () => history.push('/showDetails', { id: show.id });

  const posterSrc = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : 'https://bitsofco.de/img/Qo5mfYDE5v-350.avif'; 

  // Icône coeur selon l'état
  let heartIconSrc = "";
  if (heartState === "empty") heartIconSrc = "/icons/heart-empty.png";
  if (heartState === "full")  heartIconSrc = "/icons/heart-full.png";
  if (heartState === "broken") heartIconSrc = "/icons/heart-broken.png";

  return (
    <div className="show" onClick={handleShowClick}>
      <div className="show-poster-container">
        <div className="vote-circle">
          <span className="vote-score">{show.vote_average.toFixed(1)}</span>
        </div>
        <img
          src={posterSrc}
          alt={show.name}
          className="show-poster"
        />
        <div className="show-mask">
          <span className="play-icon">&#9658;</span>
        </div>
        {isAuthenticated && heartState !== "none" && (
          <img
            src={heartIconSrc}
            alt="Favori"
            className="heart-icon"
            onClick={handleFavoriteClick}
          />
        )}
      </div>
      <div className="show-info">
        <div className="show-title">{show.name}</div>
      </div>
    </div>
  );
};

export default Show;
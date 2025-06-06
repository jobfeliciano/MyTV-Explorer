import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ActorDetails = (props) => {
  const history = useHistory();
  const { id } = props.location.state; // ID de l'acteur
  const [actor, setActor] = useState({});
  const [tvCredits, setTvCredits] = useState([]);

  // Récupération des détails de l'acteur
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/person/${id}?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`)
      .then((res) => setActor(res.data))
      .catch((err) => console.error(err));
    
    // Récupération des séries dans lesquelles l'acteur a joué
    axios
      .get(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US`)
      .then((res) => {
        // Tri par popularité décroissante
        const sortedCredits = res.data.cast.sort((a, b) => b.popularity - a.popularity);
        setTvCredits(sortedCredits);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSeriesClick = (tvId) => {
    history.push('/showDetails', { id: tvId });
  };

  return (
    <div>
        <Navigation />
        <div className="actor-details">
        <div className="actor-header">
            <img
            className="actor-profile"
            src={actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.profile_path}` : '/noimg.jpg'}
            alt={actor.name}
            />
            <div className="actor-info">
            <h1>{actor.name}</h1>
            {actor.birthday && <p><strong>Birthday:</strong> {actor.birthday}</p>}
            {actor.place_of_birth && <p><strong>Birthplace:</strong> {actor.place_of_birth}</p>}
            <p className="biography">{actor.biography}</p>
            </div>
        </div>

        <div className="actor-tv-credits">
            <h2>Est apparu(e) dans</h2>
            <div className="tv-credits-list">
            {tvCredits.map((tv) => (
                <div
                key={tv.id}
                className="tv-credit-item"
                onClick={() => handleSeriesClick(tv.id)}
                >
                <img
                    src={tv.poster_path ? `https://image.tmdb.org/t/p/w300${tv.poster_path}` : 'https://bitsofco.de/img/Qo5mfYDE5v-350.avif'}
                    alt={tv.name}
                />
                <p>{tv.name}</p>
                </div>
            ))}
            </div>
        </div>
        </div>
    </div>
  );
};

export default ActorDetails;

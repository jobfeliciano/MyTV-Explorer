import React from 'react';

const Actor = ({ actor, onClick }) => {
  return (
    <div className="actor" onClick={onClick}>
      <img
        className="actor-img"
        src={
          actor.profile_path
            ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
            : 'https://bitsofco.de/img/Qo5mfYDE5v-350.avif'
        }
        alt={actor.name}
      />
      <div className="actor-info">
        <p className="actor-name">{actor.name}</p>
        {actor.character && <p className="actor-character">({actor.character})</p>}
      </div>
    </div>
  );
};

export default Actor;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Show from './Show';
import { Circles } from 'react-loading-icons';
import { useHistory } from 'react-router-dom';

const PopularShows = () => {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalPages= 500;
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.themoviedb.org/3/tv/top_rated?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US&page=${page}`)
      .then((res) => {
        setShows(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="popular-show">
      {loading ? (
        <div className="loading">
          <Circles stroke="#98ff98" strokeOpacity={0.125} speed={0.75} />
        </div>
      ) : (
        <div className="popular-shows-list">
          {shows.map((show) => (
            <Show
              key={show.id}
              show={show}
              onClickShow={() => history.push('/showDetails', { id: show.id })}
            />
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>
          Première page
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <span>
          Page {page}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Suivant
        </button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
          Dernière page
        </button>
      </div>
       <div id="credits">
          <div className="ending-credits">
            <div>Built and designed by Job Likeufack. </div>
            <div>All rights reserved. ©</div>
          </div>
        </div>
    </div>
  );
};

export default PopularShows;

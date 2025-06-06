import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Show from './Show';

const SearchShow = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (query.trim() !== '') {
      axios
        .get(`https://api.themoviedb.org/3/search/tv?api_key=a67b57849deb687f2cd49d7a8298b366&language=en-US&query=${query}&page=${currentPage}`)
        .then((res) => {
          setResults(res.data.results);
          setTotalPages(res.data.total_pages);
        })
        .catch((err) => console.error(err));
    } else {
      setResults([]);
      setTotalPages(0);
      setCurrentPage(1);
    }
  }, [query, currentPage]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="search-show">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Entrez un mot-clé pour rechercher..."
          value={query}
          onChange={handleSearch}
        />
      </div>
      {query ? (
        results.length > 0 ? (
          <>
            <div className="search-results">
              {results.map((show) => (
                <Show key={show.id} show={show} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={handlePrev} disabled={currentPage === 1}>
                  Précédent
                </button>
                <span>
                  Page {currentPage} sur {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="placeholder-container">
            <h2>Aucun résultat trouvé</h2>
          </div>
        )
      ) : (
        <div className="placeholder-container">
          <h2>Entrez un mot-clé pour rechercher</h2>
        </div>
      )}
    </div>
  );
};

export default SearchShow;

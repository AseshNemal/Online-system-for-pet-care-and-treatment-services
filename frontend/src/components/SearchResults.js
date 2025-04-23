import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Custom hook to get query parameters from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const queryParam = useQuery();
  const query = queryParam.get("query");  // The search query from the URL

  const [results, setResults] = useState([]);

  // This effect runs when the query changes
  useEffect(() => {
    if (query) {
      // Example pages you want to display based on search query
      const pages = [
        { name: "Appointments", path: "/appointment" },
        { name: "Pets", path: "/pet" },
        { name: "Pet History", path: "/pet/history" },
        { name: "Store", path: "/product/all" },
        { name: "About Us", path: "/about" }
      ];

      // Filter the pages based on the query (case insensitive match)
      const filteredPages = pages.filter((page) =>
        page.name.toLowerCase().startsWith(query.toLowerCase())
      );

      setResults(filteredPages);  // Set the filtered results
    }
  }, [query]);  // Dependency array, runs when `query` changes

  return (
    <div className="container mt-4">
      <h3>Search Results for "{query}"</h3>
      {results.length > 0 ? (
        <ul className="list-group mt-3">
          {results.map((page, index) => (
            <li key={index} className="list-group-item">
              <a href={page.path}>{page.name}</a>  {/* Link to the page */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3">No results found.</p>
      )}
    </div>
  );
}

export default SearchResults;

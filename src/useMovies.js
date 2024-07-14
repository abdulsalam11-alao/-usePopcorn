import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const KEY = "f84fc31d";

  useEffect(
    function () {
      // callback?();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsloading(true);

          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");
          const data = await res.json();

          if (data.Response === "false") throw new Error("movie not Found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsloading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   ;
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, error, isLoading };
}

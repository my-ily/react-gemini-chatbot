import { useState, useEffect } from 'react';

const useFetch = (url) => {
  // State variables for data, loading status, and errors
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]); // The effect re-runs when the URL changes

  // Return the state variables
  return { data, isLoading, error };
};

export default useFetch;

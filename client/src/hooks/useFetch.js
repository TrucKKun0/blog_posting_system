import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const user = useSelector(state => state.user);

  
  useEffect(() => {
      const fetData = async () => {
        setLoading(true);
      try {
        // Prepare headers - include Authorization if user is logged in
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        // Add Authorization header if user is logged in and token is available
        const token = user?.user?.token || user?.user?.AccessToken;
        if (user?.isLoggedIn && token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions = {
          ...options,
          headers,
          credentials: 'include', // Always include credentials for cookies
        };

        const response = await fetch(url, requestOptions);
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}, ${response.status}`);
        }
        setData(responseData);
        setError();
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetData();
  }, [user, ...dependencies]);

  return { data, loading, error };
};

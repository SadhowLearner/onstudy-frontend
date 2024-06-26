import { useEffect, useState } from "react";
import { api } from "../utils/API";

function clearAuthData() {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
}

export default function Guard() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isAuthenticated = userId !== null && token !== null;

    if (isAuthenticated) {
      api.post(`/auth/verifyauth`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setAuth(true);
      })
      .catch((err) => {
        console.error(err);
        setAuth(false);
        clearAuthData();
      });
    } else {
      setAuth(false);
      clearAuthData();
    }
  }, []);

  useEffect(() => {
    if (auth === null) return;

    const publicRoutes = ['/', '/auth', '/devapp'];
    const path = window.location.pathname;

    if (auth === false && !publicRoutes.includes(path)) {
      window.location.pathname = '/auth';
    } else if (auth === true && publicRoutes.includes(path)) {
      window.location.pathname= '/app';
    } else if (!publicRoutes.includes(path) && path !== "/app") {
      window.location.pathname = '/app';
    } else {
      document.getElementById("root").classList.remove("d-none");
    }

   }, [auth]);

   return null;
}

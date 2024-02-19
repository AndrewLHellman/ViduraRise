import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../Common/AuthToken";



const AuthProtected = (props) => {
  const [status, setStatus] = useState();
  const storedToken = localStorage.getItem('auth_token');

  useEffect(() => {
    async function fetchData() {
      try {
        let user = {
          token: storedToken
        }
        let token_res = await verifyToken(user);
        setStatus(token_res.status);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
  }, [status, storedToken]);

  if (!storedToken && status !== 1) {
    localStorage.removeItem("auth_token");
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  return <>{props.children}</>;
};

export { AuthProtected };
import { useEffect, useState } from "react";
import axios from "axios";

function SessionCheck() {
  const [sessionID, setSessionID] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8090/get-session", { withCredentials: true })
      .then((res) => {
        setSessionID(res.data.sessionID);
        setUser(res.data.user);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.username}!</h1>
          <p>Session ID: {sessionID}</p>
        </>
      ) : (
        <h6>No session found</h6>
      )}
    </div>
  );
}

export default SessionCheck;

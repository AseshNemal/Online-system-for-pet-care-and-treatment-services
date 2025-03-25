import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8090/get-session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}!</h2>
          <img src={user.image.replace('=s96-c', '=s200-c')} alt="Profile" width="100" />
          <p>Email: {user.gmail}</p>
        </>
      ) : (
        <h2>Loading...</h2>
      )}

      <button onClick={() => window.location.href = "http://localhost:8090/logout"}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
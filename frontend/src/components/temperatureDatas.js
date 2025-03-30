import React, { useEffect, useState } from "react";
import { realtimeDB } from "../firebase"; // Adjust the path as needed

const DeviceData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await realtimeDB.ref("your/path/to/data").once("value");
      setData(snapshot.val());
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Device Data</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
};

export default DeviceData;

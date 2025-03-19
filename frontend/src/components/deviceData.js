import React, { useState, useEffect } from "react";
import { realtimeDB } from "../firebase"; // Ensure your Firebase config is correctly set up
import { ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // Import Google Map components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const DeviceData = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [latestData, setLatestData] = useState(null); // State to store the latest data
  const [location, setLocation] = useState({ lat: 6.9875, lng: 80.2239 }); // Default location
  const [count, setCount] = useState(0); // Use state for count

  useEffect(() => {
    const dataRef = ref(realtimeDB, "petcare"); // Ensure this path is correct

    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        console.log("Firebase Data:", rawData); // Debugging

        const formattedData = Object.keys(rawData).map((key) => ({
          id: key,
          DeviceID: rawData[key]["Device ID"] || "Unknown",
          Latitude: rawData[key].Latitude ? Number(rawData[key].Latitude) : null,
          Longitude: rawData[key].Longitude ? Number(rawData[key].Longitude) : null,
          Altitude: rawData[key].Altitude || "N/A",
          Temperature: rawData[key].Temperature ? Number(rawData[key].Temperature) : 0,
          HeartRate: rawData[key].hartrate ? Number(rawData[key].hartrate) : 0,
          Steps: rawData[key].step ? Number(rawData[key].step) : 0,
          Timestamp: rawData[key].timestamp || "No timestamp",
        }));

        // Sort the data by Timestamp to ensure the most recent data is first
        const sortedData = formattedData.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

        setDeviceData(sortedData);

        const recordCount = sortedData.length;
        console.log("Number of records:", recordCount);

        const latestRecord = sortedData[recordCount - 1];
        setLatestData(latestRecord);
        setCount(recordCount);

        // Fetch and update the location based on the most recent data
        if (latestRecord && latestRecord.Latitude && latestRecord.Longitude) {
          fetchLocation(latestRecord.Latitude, latestRecord.Longitude);
        }
      } else {
        console.log("No data found in Firebase.");
        setDeviceData([]);
      }
    });
  }, []); // Empty dependency array, runs once on mount

  // Function to update map location
  const fetchLocation = (latitude, longitude) => {
    console.log(`Attempting to update location with Latitude: ${latitude}, Longitude: ${longitude}`);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setLocation({ lat: latitude, lng: longitude });
      console.log("Location updated successfully.");
    } else {
      console.log("Invalid coordinates:", latitude, longitude);
    }
  };

  // Get the last 20 records for the chart
  const last20Records = deviceData.slice(count - 21, count - 1);

  // Prepare chart data for Temperature
  const temperatureChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Temperature (°C)",
        data: last20Records.map((data) => data.Temperature),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Prepare chart data for Heart Rate
  const heartRateChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: last20Records.map((data) => data.HeartRate),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(51, 22, 28, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const stepRateChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Steps",
        data: last20Records.map((data) => data.Steps),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Chart options for Temperature
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 20,
        max: 50,
        ticks: {
          stepSize: 5,
          callback: (value) => `${value}°C`,
        },
      },
    },
  };

  // Chart options for Heart Rate
  const heartRateChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 300,
        max: 700,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value} BPM`,
        },
      },
    },
  };

  // Get the last 30 records for the table
  const last30Records = deviceData.slice(count - 30, count - 1);

  const isDeviceConnected = latestData ? (
    (new Date() - new Date(
      latestData.Timestamp.split(", ")[0].split("/").reverse().join("-") + "T" +
      latestData.Timestamp.split(", ")[1]
    )) / 1000 / 60 <= 4
  ) : false;

  return (
    <div style={{ padding: "20px" }}>
      <h2>
        {deviceData.length > 0 && latestData ? (
          isDeviceConnected ? "Device Connected" : "Device Not Connected"
        ) : (
          "No Data Available"
        )}
      </h2>

      {/* Charts */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Temperature Chart</h3>
          <Line data={temperatureChartData} options={chartOptions} />
        </div>

        <div style={{ width: "45%", height: "300px" }}>
          <h3>Heart Rate Chart</h3>
          <Line data={heartRateChartData} options={heartRateChartOptions} />
        </div>

        <div style={{ width: "45%", height: "300px" }}>
          <h3>Step Chart</h3>
          <Line data={stepRateChartData} options={chartOptions} />
        </div>
      </div>

      {/* Google Map */}
      <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            center={location}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>
      <br />

      <h2>Device Data</h2>

      {/* Table */}
      <table border="1" style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Steps</th>
            <th>Heart Rate (BPM)</th>
            <th>Temperature (°C)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {last30Records.map((data) => (
            <tr key={data.id}>
              <td>{data.DeviceID}</td>
              <td>{data.Steps}</td>
              <td>{data.HeartRate} BPM</td>
              <td>{data.Temperature}°C</td>
              <td>{data.Timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceData;

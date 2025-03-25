import React, { useState, useEffect } from "react";
import { realtimeDB } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Line, Pie } from "react-chartjs-2";
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DeviceData = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [location, setLocation] = useState({ lat: 6.9875, lng: 80.2239 });
  const [count, setCount] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedDeviceData, setSelectedDeviceData] = useState(null);
  const { deviceId } = useParams();
  console.log("Dddd",deviceId)

  useEffect(() => {
    const dataRef = ref(realtimeDB, "petcare");

    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        console.log("Firebase Data:", rawData);

        const formattedData = Object.keys(rawData).map((key) => ({
          id: key,
          DeviceID: rawData[key]["Device ID"] || "Unknown",
          Latitude: rawData[key].Latitude ? Number(rawData[key].Latitude) : null,
          Longitude: rawData[key].Longitude ? Number(rawData[key].Longitude) : null,
          Altitude: rawData[key].Altitude || "N/A",
          Temperature: rawData[key].Temperature ? Number(rawData[key].Temperature) : 0,
          HeartRate: rawData[key].hartrate ? Number(rawData[key].hartrate/5) : 0,
          Steps: rawData[key].step ? Number(rawData[key].step) : 0,
          Timestamp: rawData[key].timestamp || "No timestamp",
        }));

        const sortedData = formattedData.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
        setDeviceData(sortedData);

        const recordCount = sortedData.length;
        console.log("Number of records:", recordCount);

        const latestRecord = sortedData[recordCount - 1];
        setLatestData(latestRecord);
        setCount(recordCount);

        setSelectedDeviceId(deviceId)
        if (selectedDeviceId) {
          const device = sortedData.find(item => item.DeviceID === selectedDeviceId);
          setSelectedDeviceData(device || null);
        }

        if (latestRecord && latestRecord.Latitude && latestRecord.Longitude) {
          fetchLocation(latestRecord.Latitude, latestRecord.Longitude);
        }
      } else {
        console.log("No data found in Firebase.");
        setDeviceData([]);
      }
    });
  },[selectedDeviceId]);

  const fetchLocation = (latitude, longitude) => {
    console.log(`Attempting to update location with Latitude: ${latitude}, Longitude: ${longitude}`);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setLocation({ lat: latitude, lng: longitude });
      console.log("Location updated successfully.");
    } else {
      console.log("Invalid coordinates:", latitude, longitude);
    }
  };


  const last20Records = selectedDeviceId 
    ? deviceData.filter(d => d.DeviceID === selectedDeviceId).slice(-20)
    : deviceData.slice(count - 21, count - 1);

  const last30Records = selectedDeviceId
    ? deviceData.filter(d => d.DeviceID === selectedDeviceId).slice(-30)
    : deviceData.slice(count - 30, count - 1);

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

  const stepchartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 5,
          callback: (value) => `${value}`,
        },
      },
    },
  };

  const heartRateChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 300,
        ticks: {
          stepSize: 25,
          callback: (value) => `${value} BPM`,
        },
      },
    },
  };

  const isDeviceConnected = latestData ? (
    (new Date() - new Date(
      latestData.Timestamp.split(", ")[0].split("/").reverse().join("-") + "T" +
      latestData.Timestamp.split(", ")[1]
    )) / 1000 / 60 <= 4
  ) : false;

  const handleRefresh = () => {
    window.location.reload();
  };

  const getStepsForToday = () => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const todayData = deviceData.filter((data) => {
      const recordDate = new Date(data.Timestamp.split(", ")[0].split("/").reverse().join("-"));
      return recordDate.toISOString().split("T")[0] === todayDate;
    });
    return todayData.reduce((acc, data) => acc + data.Steps, 0);
  };

  const totalStepsToday = getStepsForToday();
  const remainingSteps = totalStepsToday < 5000 ? 5000 - totalStepsToday : 0;
  
  const pieChartData = {
    labels: ["Steps Today", "Remaining Steps"],
    datasets: [
      {
        data: [totalStepsToday, remainingSteps],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <h6 style={{ color: deviceData.length > 0 && latestData ? (isDeviceConnected ? "blue" : "red") : "gray" }}>
          {deviceData.length > 0 && latestData ? (isDeviceConnected ? "Device Connected" : "Device Not Connected") : "No Data Available"}
        </h6>
        <button onClick={handleRefresh} style={{ padding: "10px 20px", borderRadius: "20px", fontSize: "16px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
          🔄 Reconnect
        </button>
      </div>

      {selectedDeviceData && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          margin: '20px 0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Device Details: {selectedDeviceData.DeviceID}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <p><strong>Last Location:</strong></p>
              <p>Latitude: {selectedDeviceData.Latitude || 'N/A'}</p>
              <p>Longitude: {selectedDeviceData.Longitude || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Health Metrics:</strong></p>
              <p>Temperature: {selectedDeviceData.Temperature}°C</p>
              <p>Heart Rate: {selectedDeviceData.HeartRate} BPM</p>
              <p>Steps: {selectedDeviceData.Steps}</p>
            </div>
            <div>
              <p><strong>Last Update:</strong></p>
              <p>{selectedDeviceData.Timestamp}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Body Temperature Chart</h3>
          <Line data={temperatureChartData} options={chartOptions} />
        </div>

        <div style={{ width: "45%", height: "300px" }}>
          <h3>Heart Rate Chart</h3>
          <Line data={heartRateChartData} options={heartRateChartOptions} />
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: "300px", marginTop: "50px" }}>
          <h3>Step Chart</h3>
          <Line data={stepRateChartData} options={stepchartOptions} />
        </div>

        <div style={{ padding: "20px", width: "45%", height: "300px", marginTop: "50px" }}>
          <h3>Step Count Today</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
          <h6>Steps for Today: {getStepsForToday()}</h6>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "50px", marginBottom:"100px"}}>
        <div>
          <h3>Air quality</h3>
        </div>
        <div>
          <h3>Environment temperature and humidity</h3>
        </div>
      </div>

      {/* Google Map */}
      <div style={{ height: "400px", width: "100%", marginTop: "50px" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap center={location} zoom={15} mapContainerStyle={{ width: "100%", height: "100%" }}>
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Table */}
      <h2>Device Data {selectedDeviceId ? `(Filtered: ${selectedDeviceId})` : ''}</h2>
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
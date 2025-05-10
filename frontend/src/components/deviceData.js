import React, { useState, useEffect, useCallback } from "react";
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
  const [location, setLocation] = useState({ lat: 6.914716310240717, lng: 79.9728071125578 });
  const [count, setCount] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedDeviceData, setSelectedDeviceData] = useState(null);
  const { deviceId } = useParams();

  const fetchDeviceData = useCallback(() => {
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
          BatteryLevel: rawData[key].Battery ? Number(rawData[key].Battery) : -1,
          En_Temperature: rawData[key].En_temperature ? Number(rawData[key].En_temperature) : 0,
          En_Humidity: rawData[key].en_humidity ? Number(rawData[key].en_humidity) : 0,
          AirQuality: rawData[key].AirQuality ? Number(rawData[key].AirQuality/4) : 0,
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

        setSelectedDeviceId(deviceId);
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
  }, [deviceId, selectedDeviceId]);

  useEffect(() => {
    if (deviceId) {
      fetchDeviceData();
    }
  }, [deviceId, fetchDeviceData]);

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

  // Heart Rate Chart Data
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

  // Step Rate Chart Data
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

  // Battery Level Chart Data
  const batteryChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Battery Level (%)",
        data: last20Records.map((data) => data.BatteryLevel),
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Environment Temperature Chart Data
  const envTemperatureChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Environment Temperature (°C)",
        data: last20Records.map((data) => data.En_Temperature),
        fill: false,
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Environment Humidity Chart Data
  const envHumidityChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Environment Humidity (%)",
        data: last20Records.map((data) => data.En_Humidity),
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Air Quality Chart Data
  const airQualityChartData = {
    labels: last20Records.map((data) => data.Timestamp),
    datasets: [
      {
        label: "Air Quality (PPM)",
        data: last20Records.map((data) => data.AirQuality),
        fill: false,
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Chart Options
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

  const batteryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const envTemperatureChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 50,
        ticks: {
          stepSize: 5,
          callback: (value) => `${value}°C`,
        },
      },
    },
  };

  const envHumidityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  const airQualityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 50,
          callback: (value) => `${value} PPM`,
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

  const generateHealthSuggestions = () => {
    if (!latestData) return [];
    
    const suggestions = [];
    const now = new Date();
    const lastUpdate = new Date(
      latestData.Timestamp.split(", ")[0].split("/").reverse().join("-") + "T" +
      latestData.Timestamp.split(", ")[1]
    );
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);

    // Device connection status
    if (hoursSinceUpdate > 4) {
      suggestions.push({
        type: 'warning',
        message: 'Device has not sent data in over 4 hours. Check device connectivity and battery.'
      });
    }

    // Battery level check
    if (latestData.BatteryLevel >= 0) { // Only show if battery data is available
      if (latestData.BatteryLevel < 20) {
        suggestions.push({
          type: 'danger',
          message: `Low battery level (${latestData.BatteryLevel}%). Please charge the device soon.`
        });
      } else if (latestData.BatteryLevel < 40) {
        suggestions.push({
          type: 'warning',
          message: `Battery level is getting low (${latestData.BatteryLevel}%). Consider charging the device.`
        });
      }
    }

    // Temperature suggestions
    if (latestData.Temperature > 39.5) {
      suggestions.push({
        type: 'danger',
        message: 'High body temperature detected. Consider consulting a veterinarian as this could indicate fever or heat stress.'
      });
    } else if (latestData.Temperature < 37.5) {
      suggestions.push({
        type: 'danger',
        message: 'Low body temperature detected. This could indicate hypothermia. Keep your pet warm and consult a veterinarian.'
      });
    }

    // Heart rate suggestions
    if (latestData.HeartRate > 180) {
      suggestions.push({
        type: 'danger',
        message: 'Elevated heart rate detected. This could indicate stress, pain, or cardiac issues. Monitor closely.'
      });
    } else if (latestData.HeartRate < 60) {
      suggestions.push({
        type: 'danger',
        message: 'Low heart rate detected. This could indicate health issues. Consult a veterinarian if this persists.'
      });
    }

    // Activity suggestions
    if (latestData.Steps < 1000 && totalStepsToday < 3000) {
      suggestions.push({
        type: 'warning',
        message: 'Low activity level detected. Consider increasing exercise and playtime for your pet.'
      });
    } else if (latestData.Steps > 5000 || totalStepsToday > 15000) {
      suggestions.push({
        type: 'warning',
        message: 'High activity level detected. Ensure your pet has adequate rest and hydration.'
      });
    }

    // Environmental suggestions
    if (latestData.En_Temperature > 30) {
      suggestions.push({
        type: 'warning',
        message: 'High environment temperature. Ensure your pet has access to shade and fresh water to prevent overheating.'
      });
    } else if (latestData.En_Temperature < 15) {
      suggestions.push({
        type: 'warning',
        message: 'Low environment temperature. Provide warm bedding and shelter for your pet.'
      });
    }

    if (latestData.En_Humidity > 80) {
      suggestions.push({
        type: 'warning',
        message: 'High humidity detected. Ensure proper ventilation to prevent respiratory issues.'
      });
    } else if (latestData.En_Humidity < 30) {
      suggestions.push({
        type: 'warning',
        message: 'Low humidity detected. Consider using a humidifier if indoors to prevent dry skin.'
      });
    }

    if (latestData.AirQuality > 150) {
      suggestions.push({
        type: 'danger',
        message: 'Poor air quality detected. Consider improving ventilation or moving your pet to a cleaner air environment.'
      });
    }

    // General health check reminder
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        message: 'All vitals appear normal. Regular check-ups are still recommended for optimal pet health.'
      });
    }

    return suggestions;
  };

  const healthSuggestions = generateHealthSuggestions();

  const getBatteryColor = (level) => {
    if (level < 0) return "#cccccc"; // No data
    if (level < 20) return "#ff4444"; // Critical
    if (level < 40) return "#ffbb33"; // Warning
    return "#00C851"; // Good
  };

  const getBatteryIcon = (level) => {
    if (level < 0) return "❓"; // No data
    if (level < 20) return "🪫"; // Critical
    if (level < 40) return "🔋"; // Warning
    return "🔋"; // Good
  };

  const renderChart = (data) => {
    return (
        <Line
            data={{
                labels: data.map(record => new Date(record.timestamp).toLocaleString()),
                datasets: [{
                    label: 'Temperature',
                    data: data.map(record => record.temperature),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }}
        />
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <h6 style={{ 
          color: deviceData.length > 0 && latestData ? 
            (isDeviceConnected ? "#4CAF50" : "#F44336") : 
            "#9E9E9E"
        }}>
          {deviceData.length > 0 && latestData ? 
            (isDeviceConnected ? "Device Connected" : "Device Not Connected") : 
            "No Data Available"}
        </h6>
        {latestData && latestData.BatteryLevel >= 0 && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "20px",
            backgroundColor: "#f8f9fa",
            border: `2px solid ${getBatteryColor(latestData.BatteryLevel)}`
          }}>
            <span>{getBatteryIcon(latestData.BatteryLevel)}</span>
            <span style={{ fontWeight: "bold", color: getBatteryColor(latestData.BatteryLevel) }}>
              {latestData.BatteryLevel}%
            </span>
          </div>
        )}
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
          <h3>Device Details: {latestData.DeviceID}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <p><strong>Last Location:</strong></p>
              <p>Latitude: {latestData.Latitude || 'N/A'}</p>
              <p>Longitude: {latestData.Longitude || 'N/A'}</p>
            </div>
            <div>
              <p><strong>Health Metrics:</strong></p>
              <p>Temperature: {latestData.Temperature}°C</p>
              <p>Heart Rate: {latestData.HeartRate} BPM</p>
              <p>Steps: {latestData.Steps}</p>
            </div>
            <div>
              <p><strong>Environment Data:</strong></p>
              <p>Temperature: {latestData.En_Temperature}°C</p>
              <p>Humidity: {latestData.En_Humidity}%</p>
              <p>Air Quality: {latestData.AirQuality} PPM</p>
            </div>
            <div>
              <p><strong>Device Status:</strong></p>
              <p>Battery: {latestData.BatteryLevel >= 0 ? `${latestData.BatteryLevel}%` : 'N/A'}</p>
              <p>Last Update: {latestData.Timestamp}</p>
            </div>
          </div>
        </div>
      )}

      {/* Health Metrics Charts */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Body Temperature Chart</h3>
          {renderChart(last20Records)}
        </div>

        <div style={{ width: "45%", height: "300px" }}>
          <h3>Heart Rate Chart</h3>
          <Line data={heartRateChartData} options={heartRateChartOptions} />
        </div>
      </div>
      <br/><br/>

      {/* Battery and Steps Charts */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Battery Level</h3>
          <Line data={batteryChartData} options={batteryChartOptions} />
        </div>

        <div style={{ width: "45%", height: "300px" }}>
          <h3>Step Chart</h3>
          <Line data={stepRateChartData} options={stepchartOptions} />
        </div>
      </div>
      <br/><br/>

      {/* Steps Pie Chart */}
      <div style={{ width: "90%", height: "300px", margin: "0 auto 50px" }}>
        <h3>Step Count Today</h3>
        <Pie data={pieChartData} options={pieChartOptions} />
        <h6>Steps for Today: {getStepsForToday()}</h6>
      </div>

      {/* Environment Data Charts */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "50px", marginBottom:"100px"}}>
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Environment Temperature</h3>
          <Line data={envTemperatureChartData} options={envTemperatureChartOptions} />
        </div>
        <div style={{ width: "45%", height: "300px" }}>
          <h3>Environment Humidity</h3>
          <Line data={envHumidityChartData} options={envHumidityChartOptions} />
        </div>
      </div>

      {/* Air Quality Chart */}
      <div style={{ width: "90%", height: "300px", margin: "0 auto 50px" }}>
        <h3>Air Quality</h3>
        <Line data={airQualityChartData} options={airQualityChartOptions} />
      </div>

      {/* Google Map */}
      <div style={{ height: "400px", width: "100%", marginTop: "50px" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap center={location} zoom={15} mapContainerStyle={{ width: "100%", height: "100%" }}>
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>

      <div style={{ 
        margin: "30px 0",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h2>Health Suggestions</h2>
        {healthSuggestions.length > 0 ? (
          <div style={{ display: "grid", gap: "15px" }}>
            {healthSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                style={{
                  padding: "15px",
                  borderRadius: "5px",
                  backgroundColor: 
                    suggestion.type === 'danger' ? "#f8d7da" :
                    suggestion.type === 'warning' ? "#fff3cd" :
                    "#d1e7dd",
                  borderLeft: 
                    suggestion.type === 'danger' ? "5px solid #dc3545" :
                    suggestion.type === 'warning' ? "5px solid #ffc107" :
                    "5px solid #198754",
                  color: 
                    suggestion.type === 'danger' ? "#721c24" :
                    suggestion.type === 'warning' ? "#856404" :
                    "#0f5132"
                }}
              >
                <p style={{ margin: 0, fontWeight: "500" }}>{suggestion.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available to generate suggestions.</p>
        )}
      </div>

      {/* Table */}
      <h2>Device Data {selectedDeviceId ? `(Filtered: ${selectedDeviceId})` : ''}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Device ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Latitude</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Longitude</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Battery Level</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Temperature (°C)</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Heart Rate (BPM)</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Steps</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {last20Records.map((data, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.DeviceID}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.Latitude}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.Longitude}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.BatteryLevel}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.Temperature}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.HeartRate}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.Steps}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{data.Timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceData;
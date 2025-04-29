addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const FIREBASE_URL = "https://pet******-16b82-default-rtdb.firebaseio.com/petcare.json"; // Change this
    const FIREBASE_SECRET = "your_database_secret"; // Get from Firebase (deprecated) or use OAuth Token
    
    // Get current time in Sri Lanka Standard Time (UTC+5:30)
    const sriLankaTime = new Date().toLocaleString("en-GB", { timeZone: "Asia/Colombo" });
  
    // Assuming the body contains JSON data, add the Sri Lanka time to the data
    const requestData = await request.text();
    const dataWithTime = JSON.parse(requestData);
    
    // Replace the 'Time' field with Sri Lanka time
    dataWithTime.Time = sriLankaTime;
  
    // Send the data to Firebase
    const response = await fetch(`${FIREBASE_URL}?auth=${FIREBASE_SECRET}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataWithTime)
    });
  
    const result = await response.json();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  }
  
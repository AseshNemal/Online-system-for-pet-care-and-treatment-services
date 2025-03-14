import React, { useEffect } from "react";

function Chatbot() {
  useEffect(() => {
    // Create script elements for Botpress webchat
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/02/06/17/20250206172318-P0CQ3EFJ.js";
    script2.async = true;

    // Append the scripts to the document body
    document.body.appendChild(script1);
    document.body.appendChild(script2);

    // Cleanup scripts when the component unmounts
    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []); // Empty array ensures the effect runs only once after the component mounts

  return (
    <div>
      {/* Optionally, add some divs or other elements for styling */}
    </div>
  );
}

export default Chatbot;


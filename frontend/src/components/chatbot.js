import React, { useEffect } from "react";

function Chatbot() {
  useEffect(() => {
    // Create script element for Botpress webchat inject
    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
    injectScript.async = true;
    
    // Wait for the inject script to load before loading the bot script
    injectScript.onload = () => {
      // Create the bot configuration script
      const botScript = document.createElement("script");
      botScript.src = "https://files.bpcontent.cloud/2025/02/06/17/20250206172318-P0CQ3EFJ.js";
      botScript.async = true;
      document.body.appendChild(botScript);
    };

    document.body.appendChild(injectScript);

    // Cleanup scripts when the component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[src*="bpcontent.cloud"], script[src*="botpress.cloud"]');
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, []); // Empty array ensures the effect runs only once after the component mounts

  return (
    <div id="bp-webchat-container">
      {/* Container for Botpress chat */}
    </div>
  );
}

export default Chatbot;


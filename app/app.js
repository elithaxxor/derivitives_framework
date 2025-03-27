import React, { useState } from "react";

function App() {
  const [platform, setPlatform] = useState("telegram");
  const [logs, setLogs] = useState([]);
  const [ticker, setTicker] = useState("");

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(event.target.value);
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data");
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const sendCommand = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform, ticker }),
      });
      const result = await response.json();
      alert(result.message || "Command sent!");
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Platform Selector</h1>

      {/* Platform Selector */}
      <div className="mb-4">
        <label htmlFor="platform" className="block text-sm font-medium mb-2">
          Select Platform:
        </label>
        <select
          id="platform"
          value={platform}
          onChange={handlePlatformChange}
          className="border rounded px-2 py-1"
        >
          <option value="telegram">Telegram</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="discord">Discord</option>
        </select>
      </div>

      {/* Ticker Input */}
      <div className="mb-4">
        <label htmlFor="ticker" className="block text-sm font-medium mb-2">
          Stock Ticker:
        </label>
        <input
          type="text"
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker (e.g., AAPL)"
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Send Command Button */}
      <button
        onClick={sendCommand}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Command
      </button>

      {/* Fetch Logs Button */}
      <button
        onClick={fetchLogs}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
      >
        Fetch Logs
      </button>

      {/* Logs Display */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Logs:</h2>
        <ul className="list-disc pl-5">
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

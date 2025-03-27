import React, { useState } from 'react';

// Define an enum for platforms to ensure type safety and restrict values to specific options
enum Platform {
  Telegram = 'Telegram',
  WhatsApp = 'WhatsApp',
  Discord = 'Discord',
}

// Define the structure of a log entry, assuming the server provides a timestamp and message
type LogEntry = {
  timestamp: string; // e.g., "2023-10-10T12:00:00Z"
  message: string;   // e.g., "Command sent for AAPL on Telegram"
};

// Main App component
const App: React.FC = () => {
  // State variables with TypeScript types
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.Telegram); // Default to Telegram
  const [ticker, setTicker] = useState<string>(''); // Stores the user-entered stock ticker
  const [logs, setLogs] = useState<LogEntry[]>([]); // Array of logs fetched from the server
  const [isLoading, setIsLoading] = useState<boolean>(false); // Tracks if an API call is in progress

  // Base URL for the backend server (hardcoded for now; could be moved to a config file)
  const API_URL = 'http://localhost:5000';

  // Handles changes to the platform dropdown
  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value as Platform); // Cast string value to Platform enum
  };

  // Fetches logs from the server
  const fetchLogs = async () => {
    setIsLoading(true); // Disable buttons and show loading state
    try {
      const response = await fetch(`${API_URL}/api/data`);
      if (!response.ok) {
        // If the server responds with an error (e.g., 404, 500), throw an exception
        throw new Error('Failed to fetch logs');
      }
      const data: LogEntry[] = await response.json(); // Parse JSON response into LogEntry array
      setLogs(data); // Update the logs state with fetched data
    } catch (error) {
      // Handle network errors or server errors
      console.error('Error fetching logs:', error);
      alert('Failed to fetch logs'); // Notify user of the failure
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  };

  // Sends a command to the server with the selected platform and ticker
  const sendCommand = async () => {
    if (!ticker) {
      alert('Please enter a ticker'); // Prevent empty ticker submissions
      return;
    }
    setIsLoading(true); // Indicate that a request is in progress
    try {
      const response = await fetch(`${API_URL}/api/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        body: JSON.stringify({ platform: selectedPlatform, ticker }), // Send platform and ticker as JSON
      });
      if (!response.ok) {
        // If the server rejects the command, throw an error
        throw new Error('Failed to send command');
      }
      alert('Command sent successfully'); // Notify user of success
    } catch (error) {
      // Catch network issues or server errors
      console.error('Error sending command:', error);
      alert('Failed to send command'); // Notify user of the failure
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Clears the logs displayed in the UI
  const clearLogs = () => {
    setLogs([]); // Simply set logs to an empty array
  };

  // Render the UI
  return (
    <div>
      <h1>Derivatives Trading Framework - Stage One</h1>
      {/* Form-like structure for user inputs (no actual form submission) */}
      <form>
        <label htmlFor="platform">Select Platform:</label>
        <select
          id="platform"
          value={selectedPlatform}
          onChange={handlePlatformChange}
        >
          {/* Options match the Platform enum values */}
          <option value={Platform.Telegram}>Telegram</option>
          <option value={Platform.WhatsApp}>WhatsApp</option>
          <option value={Platform.Discord}>Discord</option>
        </select>
        <br />
        <label htmlFor="ticker">Enter Ticker:</label>
        <input
          id="ticker"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)} // Update ticker state on input change
        />
        <br />
        {/* Send Command button: disabled when loading or ticker is empty */}
        <button
          type="button"
          onClick={sendCommand}
          disabled={isLoading || !ticker}
        >
          {isLoading ? 'Sending...' : 'Send Command'} {/* Show loading text */}
        </button>
        {/* Fetch Logs button: disabled when loading */}
        <button
          type="button"
          onClick={fetchLogs}
          disabled={isLoading}
        >
          {isLoading ? 'Fetching...' : 'Fetch Logs'} {/* Show loading text */}
        </button>
        {/* Clear Logs button: always enabled */}
        <button type="button" onClick={clearLogs}>
          Clear Logs
        </button>
      </form>
      <div>
        <h2>Logs</h2>
        {/* Display logs in a list */}
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{`${log.timestamp}: ${log.message}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
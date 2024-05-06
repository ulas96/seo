import { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const [response, setResponse] = useState();
  const [url, setUrl] = useState("");
  const [id, setId] = useState("");
  const [shouldStartInterval, setShouldStartInterval] = useState(false);

  const handleChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setId(getYoutubeVideoId(newUrl));
  }

  const getYoutubeVideoId = useCallback((url) => {
    const pattern = new RegExp("^(?:https?:\\/\\/)?(?:www\\.)?(?:youtube\\.com\\/(?:[^\\/\\n\\s]+\\/\\S+\\/|(?:v|e(?:mbed)?)\\/|\\S*?[?&]v=)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})", "i");
    const match = url.match(pattern);
    return match ? match[1] : null;
  }, []);

  const sendId = useCallback(async () => {
    if (!id) {
      console.error("Invalid or no video ID available");
      return;
    }
    const apiUrl = "https://sdgvr2g6eh.execute-api.eu-north-1.amazonaws.com/p/bin";
    try {
      await axios.post(apiUrl, { videoid: id }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Sending request...');
      setShouldStartInterval(true);  // Trigger the start of the interval
    } catch (error) {
      console.error('Failed to send ID:', error);
    }
  }, [id]);

  const getResponse = useCallback(async () => {
    const apiUrl = "https://sdgvr2g6eh.execute-api.eu-north-1.amazonaws.com/p/son";
    try {
      const result = await axios.get(`${apiUrl}?videoid=${id}`);
      setResponse(result.data);
      console.log('Retrieved data:', result.data);
      setShouldStartInterval(false);  // Stop the interval
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }, [id]);

  useEffect(() => {
    let intervalId;
    if (shouldStartInterval) {
      intervalId = setInterval(getResponse, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [shouldStartInterval, getResponse]);

  return (
    <>
      <div className="App">
        <div className="centered">
          <p>YouTube Video Content Optimization</p>
          <input 
            id="videoUrl" 
            type="text" 
            value={url} 
            placeholder="Provide a YouTube link...." 
            onChange={handleChange} 
          />
          <button id="fetchButton" onClick={sendId}>Optimize</button>
          <div id="dataContainer">
            {response && (
              <div>
                <p> {response.Title}</p>
                <p><strong>Hashtags:</strong> {response.Hashtags}</p>
                <p><strong>Video ID:</strong> {response.videoid}</p>
                <p><strong>Description:</strong> {response.Description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App;

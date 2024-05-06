import { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";





function App() {
  const [response, setResponse] = useState();
  const [url,setUrl] = useState("");
  const [id,setId] = useState("")

  const handleChange = (e) => {
    setUrl(e.target.value);
    setId(getYoutubeVideoId(url))
  }

  const getYoutubeVideoId = (url) => {
    const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

  const sendId = (videoId) => {
    try {
      const confirmation = axios.post(`https://sdgvr2g6eh.execute-api.eu-north-1.amazonaws.com/p/bin?videoid=${videoId}`)
      console.log('Sending request...', confirmation);
    } catch {
      console.error('No confirmation');
    }
  }

  const getResponse = async (videoId) => {
    try {
      const _response = await axios.post(`https://sdgvr2g6eh.execute-api.eu-north-1.amazonaws.com/p/son?videoid=${videoId}`);
      setResponse(_response);
    } catch {
      console.error('No response')
    }

  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      getResponse(id);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  return (
    <>
          <div className="App">
            <div className="centered">
                <p>
                    YouTube Video Content Optimization
                </p>
                <input id="videoUrl" type="text" value={url} placeholder="Provide a YouTube link...." onChange={handleChange} />
                <button id="fetchButton" onClick={sendId}>Optimize</button>
                <div id="dataContainer">{response}</div>
            </div>
        </div>
    </>
  )
}

export default App

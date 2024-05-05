import { useState } from 'react';
import './App.css';
import axios from "axios";





function App() {
  const [response, setResponse] = useState({});
  const [id,setId] = useState("");

  const handleChange = (e) => {
    setId(getYoutubeVideoId(e.target.value));
  }

  function getYoutubeVideoId(url) {
    const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}


  return (
    <>
          <div class="App">
            <div class="centered">
                <p>
                    YouTube Video Content Optimization
                </p>
                <input id="videoUrl" type="text" value={id} placeholder="Provide a YouTube link...." onChange={handleChange} />
                <button id="fetchButton">Optimize</button>
                <div id="dataContainer">{id}</div>
            </div>
        </div>
    </>
  )
}

export default App

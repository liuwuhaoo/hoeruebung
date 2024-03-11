'use client'

import {useState, useEffect} from "react";


export default function Number() {
    const [number, setNumber] = useState<Number>(0); 
    const [worker, setWorker] = useState<Worker|null>(null);
    const [audioUrl, setAudioUrl] = useState<string>('');


    const fetchTTSData = async () => {
        
        const num = Math.floor(Math.random() * 100);
        setNumber(num);

        try {
          // Replace `/api/tts` with the actual endpoint URL of your serverless function
          const response = await fetch(`/api/hello?number=${num}`);
          if (!response.ok) throw new Error('Network response was not ok');
          
          // Convert the response to a blob
          const blob = await response.blob();
          
          // Create a URL for the blob and update the audio source
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } catch (error) {
          console.error('Error fetching TTS data:', error);
        }
    };

    return (
      <div>
          Number: <div>{number.toString()}</div>
          <button onClick={fetchTTSData}>get a number</button>
          {audioUrl && <audio src={audioUrl} controls autoPlay />}
      </div>
    );
}
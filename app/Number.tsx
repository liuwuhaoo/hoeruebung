"use client";

import { useState, useRef } from "react";

export default function Number() {
  const [number, setNumber] = useState<Number>(0);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const fetchTTSData = async () => {
    setIsCorrect(false);
    setAnswer("");
    setAudioUrl("");

    const num = Math.floor(Math.random() * 100);
    setNumber(num);

    try {
      // Replace `/api/tts` with the actual endpoint URL of your serverless function
      const response = await fetch(`/api/hello?number=${num}`);
      if (!response.ok) throw new Error("Network response was not ok");

      // Convert the response to a blob
      const blob = await response.blob();

      // Create a URL for the blob and update the audio source
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error fetching TTS data:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  }


  const handleKeyUp = (event: { key: string; }) => {
    if (event.key === 'Enter') {
        if (answer === number.toString()) {
            setIsCorrect(true);
        }
    }
  }


  return (
    <div className="Number">
      <button onClick={fetchTTSData}>get a number</button>
      {audioUrl && (
        <div>
            <audio src={audioUrl} controls autoPlay />
            <input value={answer} type="text" onKeyUp={handleKeyUp} onChange={handleChange} />
            {answer && isCorrect && <div>👍</div>}
            {answer && !isCorrect && <div>👎</div>}
        </div>
      )}
    </div>
  );
}

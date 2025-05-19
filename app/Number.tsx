"use client";

import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function Number() {
    const [number, setNumber] = useState<Number>(0);
    const [[min, max], setRange] = useState<[number, number]>([0, 100]);
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    const fetchTTSData = async () => {
        setIsCorrect(false);
        setAnswer("");
        setAudioUrl("");

        const num = Math.floor(Math.random() * (max - min) + min);
        setNumber(num);

        try {
            const response = await fetch(`/api/voice?number=${num}`);
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
        let answer = event.target.value;
        setAnswer(answer);
        if (answer === number.toString()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleSetMin = (event: React.ChangeEvent<HTMLInputElement>) => {
        let min = parseInt(event.target.value);
        if (!isNaN(min) && min < max) {
            setRange([min, max]);
        }
    };

    const handleSetMax = (event: React.ChangeEvent<HTMLInputElement>) => {
        let max = parseInt(event.target.value);
        if (!isNaN(max) && max > min) {
            setRange([min, max]);
        }
    };

    const handleKeyUp = (event: { key: string }) => {
        if (event.key === "Enter") {
            fetchTTSData();
        }
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-6 p-8 rounded-lg">
                Click Start to listen to a number ({min} to {max}) and type it
                in the input box.
                <div className="flex gap-3">
                    <input
                        className="border border-gray-300 rounded px-4 py-2 w-24"
                        placeholder="min"
                        value={min}
                        type="number"
                        onChange={handleSetMin}
                    ></input>
                    <input
                        className="border border-gray-300 rounded px-4 py-2 w-24"
                        placeholder="max"
                        value={max}
                        type="number"
                        onChange={handleSetMax}
                    ></input>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={fetchTTSData}
                    >
                        Start
                    </button>
                </div>
                <input
                    className="border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={answer}
                    type="text"
                    onKeyUp={handleKeyUp}
                    onChange={handleChange}
                />
                <div className="w-96">
                    <AudioPlayer autoPlay src={audioUrl} />
                </div>
                {(
                    <div className="text-4xl h-40px">
                        {answer ? isCorrect ? "👍 (Enter to Continue)" : "👎" : "..."}
                    </div>
                )}
            </div>
        </div>
    );
}

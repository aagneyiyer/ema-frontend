import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import names from './names.json';


const Record = () => {
    const { name, scene } = useParams();
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [showNext, setShowNext] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioUrlRef = useRef<string | null>(null);  
    
    const personObj = names.names.find(obj => Object.keys(obj)[0] === name);
    const person = personObj ? Object.values(personObj)[0] : 'Unknown';


    useEffect(() => {
        // Cleanup audio URL on component unmount
        return () => {
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            setAudioChunks([]);

            mediaRecorderRef.current.ondataavailable = (event) => {
                setAudioChunks((prev) => [...prev, event.data]);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
        }
    };

    const stopRecording = () => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const playRecording = () => {
        if (audioChunks.length > 0) {
            const blob = new Blob(audioChunks, { type: 'audio/wav' });
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
            }
            audioUrlRef.current = URL.createObjectURL(blob);
            const audio = new Audio(audioUrlRef.current);
            audio.play();
        }
    };

    function formatDate(milliseconds : number) {
        // Create a new Date object using the milliseconds
        const date = new Date(milliseconds);
      
        // Extract year, month, day, hours, minutes, and seconds
        const year = date.getUTCFullYear();
        // Pad the month and day with leading zeros if necessary. getUTCMonth() returns 0-11, so add 1 for the correct month.
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
        // Format the string
        return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
      }

    const redoRecording = () => {
        setAudioChunks([]);
    };

    const saveRecording = () => {
        setShowNext(true);
        if (audioChunks.length === 0) {
            alert('No recording to save. Record first.');
            return;
        }
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        const dateTimeString = formatDate(new Date().getTime());
        // dateTimeString = dateTimeString.replace(":", "")
        const fileName = `Audio_${person}_Scene${scene}_${dateTimeString}.wav`;
        formData.append('audio', blob, fileName.replaceAll(':', '-'));

        fetch('https://emaserver.dsjlsdjsakdjsads.online/uploads', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Recording saved successfully.');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Recording saved successfully!")
        });
    };

    return (
        <div className="App">
            <p>Hit record, then stop, then save.</p>
            <button id="recordButton" onClick={startRecording} disabled={isRecording}>Record</button>
            <button id="playButton" onClick={playRecording} disabled={isRecording}>Play</button>
            <button id="redoButton" onClick={redoRecording} disabled={isRecording}>Redo</button>
            <button id="saveButton" onClick={saveRecording} disabled={isRecording}>Save</button>
            <button id="stopButton" onClick={stopRecording} disabled={!isRecording}>Stop</button>
            <div></div>
            {showNext && (
                <Link to={`/${name}`}>Select Scene</Link>
            )}


        </div>
    );
};

export default Record;

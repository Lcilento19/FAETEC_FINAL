import React, { useState, useEffect } from "react";
import "./stopwatch.css"; // Importe o estilo do módulo

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
  };

  return (
    <div className="timerContainer">
      <div className="stopwatch">
        <p className="stopwatchTime">
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </p>
        <div className="stopwatchButtons">
          <button className="stopwatchButton" onClick={startStop}>
            {isRunning ? "Stop" : "Start"}
          </button>
          <button className="stopwatchButton" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;

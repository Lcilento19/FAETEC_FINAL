import React, { useState, useEffect } from "react";
import "./stopwatch.css";

const Stopwatch = () => {
  const storedTime = localStorage.getItem("time");
  const initialTime = storedTime ? parseInt(storedTime, 10) : 0;

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          localStorage.setItem("time", newTime);
          return newTime;
        });
      }, 10);
    } else {
      clearInterval(intervalId);
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
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.removeItem("time");
  };

  const toggleStopwatch = () => {
    setShowStopwatch((prevShowStopwatch) => !prevShowStopwatch);
  };

  return (
    <div className="timerContainer">
      <div className={`stopwatch ${showStopwatch ? "show" : ""}`}>
        {showStopwatch && (
          <button className="hideStopwatchButton" onClick={toggleStopwatch}>
            X
          </button>
        )}
        {showStopwatch && (
          <p className="stopwatchTime">
            {hours}:{minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}:
            {milliseconds.toString().padStart(2, "0")}
          </p>
        )}
        {showStopwatch && (
          <div className="stopwatchButtons">
            <button className="stopwatchButton" onClick={startStop}>
              {isRunning ? "Stop" : "Start"}
            </button>
            <button className="stopwatchButton" onClick={reset}>
              Reset
            </button>
          </div>
        )}
      </div>
      {!showStopwatch ? (
        <button className="showStopwatchButton" onClick={toggleStopwatch}>
          Cronometro
        </button>
      ) : null}
    </div>
  );
};

export default Stopwatch;

import React, { useState, useEffect } from "react";
import styles from "./stopwatch.module.css"; // Importe o estilo do módulo

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
    <div className={styles.timerContainer}>
      <div className={styles.stopwatch}>
        <p className={styles.stopwatchTime}>
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </p>
        <div className={styles.stopwatchButtons}>
          <button className={styles.stopwatchButton} onClick={startStop}>
            {isRunning ? "Stop" : "Start"}
          </button>
          <button className={styles.stopwatchButton} onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;

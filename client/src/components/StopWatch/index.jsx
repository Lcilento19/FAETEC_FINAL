import React, { useState, useEffect } from "react";
import "./stopwatch.css";
import useSound from "use-sound";
import alarmSound from "../../assets/alarme.mp3";
import { toast } from "react-toastify";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [targetTime, setTargetTime] = useState(0);

  const [playAlarm] = useSound(alarmSound);

  useEffect(() => {
    let intervalId;
    if (isRunning && time < targetTime) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 10;
          checkAlert(newTime);
          return newTime;
        });
      }, 10);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, time, targetTime]);

  const startStop = () => {
    if (targetTime > 0) {
      setIsRunning((prevIsRunning) => !prevIsRunning);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setTargetTime(0);
  };

  const toggleStopwatch = () => {
    setShowStopwatch((prevShowStopwatch) => !prevShowStopwatch);
  };

  const handleSetTime = () => {
    const hours = parseInt(inputHours) || 0;
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    const milliseconds = parseInt(inputMilliseconds) || 0;

    const newTargetTime =
      hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;

    setTargetTime(newTargetTime);
    setShowStopwatch(true);

    toast.success("Tempo definido com sucesso!");
  };

  const checkAlert = (currentTime) => {
    if (currentTime >= targetTime && targetTime > 0) {
      toast.warn("Tempo atingido!");

      playAlarm();
      setIsRunning(false);
    }
  };

  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [inputMilliseconds, setInputMilliseconds] = useState("");

  return (
    <div className="timerContainer">
      <button className="showStopwatchButton" onClick={toggleStopwatch}>
        {showStopwatch ? "Esconder Cronômetro" : "Mostrar Cronômetro"}
      </button>
      <div className={`stopwatch ${showStopwatch ? "show" : ""}`}>
        <div className="stopwatchInputs">
          <input
            type="number"
            placeholder="Horas"
            value={inputHours}
            onChange={(e) =>
              setInputHours(Math.abs(parseInt(e.target.value, 10)).toString())
            }
          />
          <span>:</span>
          <input
            type="number"
            placeholder="Minutos"
            value={inputMinutes}
            onChange={(e) =>
              setInputMinutes(Math.abs(parseInt(e.target.value, 10)).toString())
            }
          />
          <span>:</span>
          <input
            type="number"
            placeholder="Segundos"
            value={inputSeconds}
            onChange={(e) =>
              setInputSeconds(Math.abs(parseInt(e.target.value, 10)).toString())
            }
          />
          <span>:</span>
          <input
            type="number"
            placeholder="Milissegundos"
            value={inputMilliseconds}
            onChange={(e) =>
              setInputMilliseconds(
                Math.abs(parseInt(e.target.value, 10)).toString()
              )
            }
          />
          <button
            className="setTargetTimeButton"
            onClick={handleSetTime}
            disabled={isRunning}
          >
            Definir Tempo
          </button>
        </div>
        {showStopwatch && (
          <p className="stopwatchTime">
            {String(Math.floor(time / 3600000)).padStart(2, "0")}:
            {String(Math.floor((time % 3600000) / 60000) % 60).padStart(2, "0")}
            :{String(Math.floor((time % 60000) / 1000) % 60).padStart(2, "0")}:
            {String((time % 1000) / 10).padStart(2, "0")}
          </p>
        )}
        {showStopwatch && (
          <div className="stopwatchButtons">
            <button
              className="stopwatchButton"
              onClick={startStop}
              disabled={targetTime <= 0}
            >
              {isRunning ? "Parar" : "Iniciar"}
            </button>
            <button className="stopwatchButton" onClick={reset}>
              Resetar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;

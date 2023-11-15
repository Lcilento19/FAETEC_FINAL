import React, { useState } from "react";
import "./calculator.css";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [currentInput, setCurrentInput] = useState("");
  const [previousInput, setPreviousInput] = useState("");
  const [operator, setOperator] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);

  const handleDigitClick = (digit) => {
    const newInput = currentInput === "0" ? digit : currentInput + digit;
    setCurrentInput(newInput);
    setDisplay(newInput);
    setShowCalculator(true);
  };

  const handleOperatorClick = (op) => {
    if (previousInput === "") {
      setPreviousInput(currentInput);
      setCurrentInput("");
      setOperator(op);
      setDisplay(display + op);
    } else {
      calculateResult();
      setOperator(op);
    }
  };

  const handleEqualClick = () => {
    calculateResult();
  };

  const calculateResult = () => {
    let result;

    switch (operator) {
      case "+":
        result = parseFloat(previousInput) + parseFloat(currentInput);
        break;
      case "-":
        result = parseFloat(previousInput) - parseFloat(currentInput);
        break;
      case "*":
        result = parseFloat(previousInput) * parseFloat(currentInput);
        break;
      case "/":
        result = parseFloat(previousInput) / parseFloat(currentInput);
        break;
      default:
        result = currentInput;
    }

    setDisplay(result.toString());
    setPreviousInput("");
    setCurrentInput(result.toString());
    setOperator("");
  };

  const handleClearClick = () => {
    setDisplay("0");
    setCurrentInput("");
    setPreviousInput("");
    setOperator("");
  };

  const toggleCalculator = () => {
    setShowCalculator((prevShowCalculator) => !prevShowCalculator);
  };

  return (
    <>
      <button className="showCalculatorButton" onClick={toggleCalculator}>
        {showCalculator ? (
          <img src="icons/calculadora_on.png" />
        ) : (
          <img src="icons/calculadora_off.png" />
        )}
      </button>
      <div className={`calculator-container ${showCalculator ? "show" : ""}`}>
        <div className="calculator-title">Calculadora</div>
        <div className="calculator-content">
          <div className="display">{display}</div>
          <div className="buttons">
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("7")}
            >
              7
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("8")}
            >
              8
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("9")}
            >
              9
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleOperatorClick("+")}
            >
              +
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("4")}
            >
              4
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("5")}
            >
              5
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("6")}
            >
              6
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleOperatorClick("-")}
            >
              -
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("1")}
            >
              1
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("2")}
            >
              2
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("3")}
            >
              3
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleOperatorClick("*")}
            >
              *
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleDigitClick("0")}
            >
              0
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleClearClick()}
            >
              C
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleEqualClick()}
            >
              =
            </button>
            <button
              className="btn-calculator"
              onClick={() => handleOperatorClick("/")}
            >
              /
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calculator;

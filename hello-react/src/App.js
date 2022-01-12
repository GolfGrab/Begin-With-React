import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVUALUATE: "evualuate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (!state.operation) {
        state.previousOparand = null;
      }
      if (state.currentOparand === "0" && payload.digit !== ".") {
        return { ...state, currentOparand: payload.digit };
      }
      if (!state.currentOparand && payload.digit === ".") {
        return { ...state, currentOparand: "0." };
      }
      if (payload.digit === "." && state.currentOparand.includes(".")  ) {
        return state;
      }
      return {
        ...state,
        currentOparand: `${state.currentOparand || ""}${payload.digit}`
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (!state.previousOparand && !state.currentOparand) {
        return state;
      }
      if (!state.currentOparand && state.previousOparand) {
        return { ...state, operation: payload.operation };
      }
      if (state.currentOparand[-1] === ".") { 
        return {
          ...state,
          previousOparand: state.currentOparand.slice(0, -1),
          currentOparand: null,
          operation: payload.operation
        };
      }
      if (state.currentOparand && !state.previousOparand) {
        return {
          ...state,
          previousOparand: state.currentOparand,
          currentOparand: null,
          operation: payload.operation
        };
      }
      if (state.currentOparand && state.previousOparand) {
        return {
          ...state,
          previousOparand:evaluate(state),
          currentOparand: null,
          operation: payload.operation
        };
      }
      return state;
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      return {
        ...state,
        currentOparand: state.currentOparand.slice(0, -1)
        };
    case ACTIONS.EVUALUATE:
      return;
    default:
      return state;
  }

}

function evaluate({ previousOparand, currentOparand, operation }) {
  if (!previousOparand || !currentOparand) return;
  switch (operation) {
    case "÷":
      return (parseFloat(previousOparand) / parseFloat(currentOparand)).toString();
    case "×":
      return (parseFloat(previousOparand) * parseFloat(currentOparand)).toString();
    case "+":
      return (parseFloat(previousOparand) + parseFloat(currentOparand)).toString();
    case "-":
      return (parseFloat(previousOparand) - parseFloat(currentOparand)).toString();
    default:
      return;
  }
}




function App() {
  const [{ currentOparand, previousOparand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid" >
      <div className="output">
        <div className="previous-operand">{previousOparand} {operation}</div>
        <div className="current-operand">{currentOparand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type : ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type : ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two">=</button>
    </div>





  );
}

export default App;

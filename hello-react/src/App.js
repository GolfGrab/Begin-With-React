import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";


// all actions that use with useReducer hook
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVUALUATE: "evualuate",
  SWAP_SIGN: "swap-sign",
}


// reducer function for useReducer hook
// it takes state and object {type , payload} as arguments
// state is the current state of the application
// type is a string that represents action type
// payload is an object that represents action payload
// it returns new state
function reducer(state, { type, payload }) {
  switch (type) {

    // when user click on digit button
    case ACTIONS.ADD_DIGIT:

      // staer with 0 case
      if (state.currentOparand === "0" && payload.digit !== ".") {
        return { ...state, currentOparand: payload.digit };
      }

      // start with . case
      if (!state.currentOparand && payload.digit === ".") {
        return { ...state, currentOparand: "0." };
      }

      //duplicate . case
      if (payload.digit === "." && state.currentOparand.includes(".")) {
        return state;
      }
      // normal case
      return {
        ...state,
        currentOparand: `${state.currentOparand || ""}${payload.digit}`
      };

    // when user click on operation button
    case ACTIONS.CHOOSE_OPERATION:

      // nothin to do case except - operation
      if (!state.previousOparand && !state.currentOparand) {
        if (payload.operation === "-") {
          //console.log("nothing to do but - operation");
          return { ...state, operation: payload.operation, previousOparand: "0", };
        }
        //console.log("nothing to do");
        return state;
      }

      // change operation case
      if (!state.currentOparand && state.previousOparand) {
        //console.log("change operation");
        return { ...state, operation: payload.operation };
      }

      // end with . case
      if (state.currentOparand[state.currentOparand.length - 1] === ".") {
        //console.log("end with .");
        return {
          ...state,
          previousOparand: state.currentOparand.slice(0, -1),
          currentOparand: null,
          operation: payload.operation
        };
      }

      // normal start case
      if (state.currentOparand && !state.previousOparand) {
        //console.log("normal start");
        return {
          ...state,
          previousOparand: state.currentOparand,
          currentOparand: null,
          operation: payload.operation
        };
      }

      // normal chain case
      if (state.currentOparand && state.previousOparand && state.operation) {
        //console.log("normal chain");
        return {
          ...state,
          previousOparand: evaluate(state),
          currentOparand: null,
          operation: payload.operation
        };
      }

      // new input case
      if (state.currentOparand && state.previousOparand && !state.operation) {
        //console.log("new input");

        return {
          ...state,
          previousOparand: state.currentOparand,
          currentOparand: null,
          operation: payload.operation
        };
      }

      // exception case (should not happen)
      return state;


    // when user click on clear button
    case ACTIONS.CLEAR:
      //console.log("clear");

      // normal case
      return {};


    // when user click on delete button
    case ACTIONS.DELETE_DIGIT:

      // nothing to do case
      if (!state.currentOparand) {
        //console.log("nothing to do");
        return state;
      }

      // delete last digit case
      return {
        ...state,
        currentOparand: state.currentOparand.slice(0, -1)
      };


    // when user click on evaluate button
    case ACTIONS.EVUALUATE:

      // nothing to do case
      if (!state.currentOparand || !state.previousOparand) {
        // console.log("nothing to do");
        return state;
      }

      // normal case
      return {
        ...state,
        previousOparand: evaluate(state),
        currentOparand: null,
        operation: null
      };


    // when user click on swap sign button
    case ACTIONS.SWAP_SIGN:

      // nothing to do case
      if (!state.currentOparand) {
        // console.log("nothing to do");
        return state;
      }

      // normal case
      return {
        ...state,
        currentOparand: `${state.currentOparand[0] === "-" ? state.currentOparand.slice(1) : `-${state.currentOparand}`}`
      };


    // default case should never happen
    default:
      return state;
  }

}

// calculate answer and return string
function evaluate({ previousOparand, currentOparand, operation }) {
  if (!previousOparand || !currentOparand) return;
  switch (operation) {
    case "÷":
      return (parseFloat(previousOparand) / parseFloat(currentOparand)).toPrecision(10);
    case "×":
      return (parseFloat(previousOparand) * parseFloat(currentOparand)).toPrecision(10);
    case "+":
      return (parseFloat(previousOparand) + parseFloat(currentOparand)).toPrecision(10);
    case "-":
      return (parseFloat(previousOparand) - parseFloat(currentOparand)).toPrecision(10);
    default:
      return;
  }
}

// add comma to string of number if it longer than 4 digits and return string
function strNumberWithCommas(x) {
  if (!x) {
    return "";
  }
  var parts = x.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}


// App component
function App() {
  const [{ currentOparand, previousOparand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid" >
      <div className="output">
        <div className="previous-operand">{strNumberWithCommas(previousOparand)} {operation}</div>
        <div className="current-operand">{strNumberWithCommas(currentOparand)}</div>
      </div>
      <button onClick={() => dispatch({ type: ACTIONS.SWAP_SIGN })}>±</button>
      <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
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
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVUALUATE })}>=</button>
    </div>
  );
}

export default App;

import { useEffect, useState, useRef } from "react";
import "./App.css";

function useIntervalWithStop(callback: () => void, delay: number, stop: boolean) {
  const savedCallback = useRef<() => void>(null!);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    if (stop) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [delay, stop]);
}

interface Idata {
  dob: {
    age: number
  }
}

function App() {
  const [timer, setTimer] = useState(10);
  const [isStopped, setIsStopped] = useState(false);
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

  useIntervalWithStop(
    () => {
      setTimer(!timer ? 10 : timer - 1);
    },
    1000,
    isStopped
  );

  useEffect(() => {
    if (timer === 10) {
      fetch("https://randomuser.me/api/?results=10")
        .then((res) => res.json())
        .then(({ results }) => {
          setData(results);
        });
    }
  }, [timer]);

  useEffect(() => {
    const averageAge =
      data.reduce((total, next: Idata) => total + next.dob.age, 0) / data.length;
    setAverage(Number(averageAge.toFixed(1)));
  }, [data]);

  return  (
    <div className="App">
      <div>Time left to fetch again: {timer} seconds</div>

      <button className="btn" onClick={() => setIsStopped(!isStopped)}>
        {isStopped ? "Start" : "Stop"}
      </button>

      <div>Average age is: {average}</div>
    </div>
    )
  
}

export default App;

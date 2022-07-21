import React, {useState, useEffect} from "react"
import Home from "./Home"
import Game from "./Game"

export default function App() {
  const [gameStarted, setGameStarted] = useState(false)
  
  function toggleGameStarted() {
    setGameStarted(prevGameStarted => !prevGameStarted)
  }

  return (
    gameStarted ? <Game /> : <Home toggleGameStarted={toggleGameStarted}/>
  );
}



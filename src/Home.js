import React from "react"

export default function Home({toggleGameStarted}) {
    return  (
        <div className="home--container">
            <div className="home--title">Quizzical</div>
            <div className="home--subtitle">Powered by Open Data Trivia</div>
            <button className="home--button" onClick={toggleGameStarted}>Start Quiz</button>
        </div>
    )
}
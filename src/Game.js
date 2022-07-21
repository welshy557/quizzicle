import React, {useEffect, useState} from "react"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Question from "./Question"


export default function Game() {
    const [questionsData, setQuestionsData] = useState([])
    const [checkingAnswers, setCheckingAnswers] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [playAgainHandel, setPlayAgainHandle] = useState(false)
    const [allAnswersSelected, setAllAnswersSelected] = useState(true)

    function setAnswerOrder(correct_answer, incorrect_answers) {
        // Sets answers in random order
        let answers = incorrect_answers.map(incorrectAnswer => ({
            answer: incorrectAnswer, isCorrect: false, selected: false
        }))

        answers.push({answer: correct_answer, isCorrect: true, selected: false})

        let order = Array(answers.length)
        for (let i = 0; i < answers.length; i++) {
            let ranNum = Math.floor(Math.random() * 4)
                    
            if (order[ranNum] === undefined) {
                order[ranNum] = answers[i]
            } else i--
        }

        return order
    }

    function checkAnswers() {
        // Checks if questions are correct
        let correctCount = 0
        let selectedCount = 0
        questionsData.forEach(question => {
            question.answerOrder.forEach(answer => {
                if (answer.isCorrect && answer.selected) {
                    correctCount++
                }

                if (answer.selected) {
                    selectedCount++
                }
            })
        })

        if (selectedCount === questionsData.length) {
            setAllAnswersSelected(true)
        } else return setAllAnswersSelected(false)

        setCorrectAnswers(correctCount)
        setCheckingAnswers(true)
    }

    function toggleSelect(question, answer) {
    
        if (!checkingAnswers) {
            setQuestionsData(prevQuestionData => prevQuestionData.map(prevQuestion => {
                let answers = prevQuestion.answerOrder.map(prevAnswer => {
                    
                    let prevAnswerSelected = prevAnswer.selected
                    if (prevAnswerSelected) {
                        if (question===prevQuestion.question) {
                            prevAnswerSelected = !prevAnswerSelected
                        }
                    } else if (answer===prevAnswer.answer && question===prevQuestion.question) {
                        prevAnswerSelected = !prevAnswerSelected
                    }

                    return {
                        ...prevAnswer,
                        selected: prevAnswerSelected
                    }
                })

                let prevQuestionSelected = prevQuestion.questionSelected
                if (!prevQuestionSelected) {
                    if (question===prevQuestion.question) {
                        prevQuestionSelected = !prevQuestionSelected
                    }
                }

                return {
                    ...prevQuestion,
                    answerOrder: answers,
                    questionSelected: prevQuestionSelected
                }
            }))
        }
    }

    function playAgain() {
        setCheckingAnswers(false)
        setPlayAgainHandle(prevPlayAgainHandle => !prevPlayAgainHandle)
    }

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
        .then(response => response.json())
        .then(data => setQuestionsData(data.results.map(question => {
                console.log(question)
                let order = setAnswerOrder(question.correct_answer, question.incorrect_answers)
                return {...question, answerOrder: order, questionSelected: false, incorrect_answers: undefined, correct_answer: undefined}
        })))
            
    }, [playAgainHandel])

    const questions = questionsData.map(question => {
        return <Question 
                key={nanoid()}
                question={question}
                checkingAnswers={checkingAnswers}
                toggleSelect={toggleSelect}
                />
    })

    return (
        <div>
            {checkingAnswers && correctAnswers >= 4 && <Confetti/>}
            <div className="game--title">Quizzical</div>
            {questions}
            <div className="checkAnswers--button--container">
                {checkingAnswers && allAnswersSelected && <div className="correct--answers">You scored {correctAnswers}/{questionsData.length} correct answers</div>}
                {!allAnswersSelected && <div className="not--all--selected">All answers must be selected</div>}
                <button className="checkAnswers--button" onClick={checkingAnswers ? playAgain : checkAnswers}>{checkingAnswers ? "Play Again" : "Check Answers"}</button>
            </div>
        </div>
    )
    }

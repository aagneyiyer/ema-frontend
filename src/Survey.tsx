import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import names from './names.json';


const questionList = [
  "Example question #1?", "Example question #2?", 
  "Example question #3?", "Example question #4?"
];

const optionList = [
  "Option 1a", "Option 1b", "Option 1c", "Option 1d", "Option 1e", 
  "Option 2a", "Option 2b", "Option 2c", "Option 2d", "Option 2e", 
  "Option 3a", "Option 3b", "Option 3c", "Option 3d", "Option 3e", 
  "Option 4a", "Option 4b", "Option 4c"
];

const Survey = () => {
  const { name, scene } = useParams();

  const personObj = names.names.find(obj => Object.keys(obj)[0] === name);
  const person = personObj ? Object.values(personObj)[0] : 'Unknown';
  
  const [currQuestion, setCurrQuestion] = useState(0);
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [showNext, setShowNext] = useState(true);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currQuestion] = event.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currQuestion] === "") {
        return;
    } else if (currQuestion < questionList.length - 1) {
      setCurrQuestion(currQuestion + 1);
      setShowNext(currQuestion < questionList.length - 2);
    }
  };

  const submitSurvey = () => {
    const formData = new FormData();
    answers.forEach((response, index) => {
        formData.append(`response_${index}`, response);
    });
    formData.append(`response_${answers.length}`, person || '')
    formData.append(`response_${answers.length + 1}`, scene || '')

    // Send the responses to the server
    fetch('https://emaserver.dsjlsdjsakdjsads.online/saveResponses', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Survey responses saved successfully.');
        }
    });
  }

  let letters = ['a', 'b', 'c', 'd', 'e'];
  let numOptions = [5, 5, 5, 3]

  return (
    <div className="App">
        <form id="survey">
            <ol>
                <p>Question {currQuestion + 1}: {questionList[currQuestion]}</p>
                {letters.slice(0, numOptions[currQuestion]).map((option, index) => (
                    <label key={index}>
                    <input 
                        type="radio" 
                        name={`question-${currQuestion}`} 
                        value={option} 
                        onChange={handleOptionChange}
                        checked={answers[currQuestion] === option}
                    />
                    {option.toUpperCase()}. {optionList[currQuestion * 5 + index] + "\n"}<br/>
                    </label>
                ))}
                <br/>
            </ol>
            {showNext ? (
                <button type="button" onClick={handleNext}>Next</button>
                ) : (
                <Link onClick={submitSurvey} to={`/record/${name}/${scene}`}>Select Scene</Link>
            )}
        </form>
    </div>
  );
};

export default Survey;
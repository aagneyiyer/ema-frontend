import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import names from './names.json';


// change questions here!
const questionList = [
  "What did your active listening involve? (Select all that apply)", "Overall, how loud were the background environmental sounds?", 
  "You had to strain to understand the conversation/speech.", "Which program are you using now on your hearing aid?"
];

// change answer choices here!
const optionList = [
  "Conversation, live", "Conversation, via electronic device", "Speech/music listening, live", "Speech/music listening media", "Environmental sound listening", 
  "Very loud", "Loud", "Medium", "Soft", "Very soft", 
  "Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree", 
  "A", "B", "C"
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

    // send responses to the server
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

  // logic to enable questions displaying automatically
  let letters = ['a', 'b', 'c', 'd', 'e'];
  let numOptions = [5, 5, 5, 3]

  return (
    <div className="App">
        <form id="survey">
            <ol>
              {/* logic to enable questions displaying automatically */}

              {/* continually update the current question number and use that to index into the question array
              display the next n answer choices, where n maps to the corresponding number of options for 
              that question as designated by the numOptions array */}

                <p>{currQuestion + 1}. {questionList[currQuestion]}</p>
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
            {/* only show the 'Next' button to move to recording stage once all questions have been answered */}
            {showNext ? (
                <button className="big-button"type="button" onClick={handleNext}>Next</button>
                ) : (
                <Link className="big-button" onClick={submitSurvey} to={`/record/${name}/${scene}`}>Next</Link>
            )}
        </form>
    </div>
  );
};

export default Survey;

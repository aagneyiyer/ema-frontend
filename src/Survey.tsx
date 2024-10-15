import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import names from './names.json';
import emaBanner from './ema banner.png';

// const preTuning = true;

// change questions here!
const questionList = [
  "What did your listening involve?", "Overall, how loud were the background environmental sounds?", 
  "You had to strain to understand the conversation/speech.", "Which program are you using now on your hearing aid?"
];

// change answer choices here!
const optionList = [
  "Conversation, live (active)", "Speech/music listening, live (passive)", "Speech/music listening media (passive)", "Environmental sound listening (passive)", 
  "Very loud", "Loud", "Medium", "Soft", "Very soft", 
  "Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree", 
  "A", "B", "C"
];

const Survey = () => {
  const { name, scene } = useParams();
  const personObj = names.names.find(obj => Object.keys(obj)[0] === name);
  const person = personObj ? Object.values(personObj)[0] : 'Unknown';
  const EMAphaseObj = names.EMAphase.find(obj => Object.keys(obj)[0] === person);
  const EMAphase = EMAphaseObj ? Object.values(EMAphaseObj)[0] : [];
  const [currQuestion, setCurrQuestion] = useState(0);
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [showNext, setShowNext] = useState(false);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[currQuestion] = event.target.value;
    setAnswers(newAnswers);
  };
  const handleBack = () => {
    setCurrQuestion(currQuestion - 1);
    setShowNext(false);
  }
  const handleNext = () => {
    if (answers[currQuestion] === "") {
        return;
    }
    
    if ((EMAphase == "pre") && currQuestion === 1) {
      setCurrQuestion(currQuestion + 1);
      setShowNext(true);
    }
    else if ((EMAphase == "post") && currQuestion == 2) {
      setCurrQuestion(currQuestion + 1);
      setShowNext(true);
    } else if (currQuestion < questionList.length - 1) {
      setCurrQuestion(currQuestion + 1);
      setShowNext(false);
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
  let numOptions = [4, 5, 5, 3]
  // Calculate the cumulative number of options per question.
  let cumulativeOptions = [0];
  for (let i = 1; i < numOptions.length; i++) {
    cumulativeOptions[i] = cumulativeOptions[i - 1] + numOptions[i - 1];
  }
  
  return (
    <div className="App">
     <img src={emaBanner} alt="EMA Banner" className="banner-image" />
        <form id="survey">
            <ol>
              {/* logic to enable questions displaying automatically */}

              {/* continually update the current question number and use that to index into the question array
              display the next n answer choices, where n maps to the corresponding number of options for 
              that question as designated by the numOptions array */}

                {/* <p> {currQuestion + 1}. {questionList[currQuestion]}</p> */}
                <p className="question">{currQuestion + 1}. {questionList[currQuestion]}</p>
                {letters.slice(0, numOptions[currQuestion]).map((option, index) => (
                    <label key={index} className="option">
                    <input 
                        type="radio" 
                        name={`question-${currQuestion}`} 
                        value={option} 
                        onChange={handleOptionChange}
                        checked={answers[currQuestion] === option}
                    />
                    {/* {optionList[currQuestion * 5 + index] + "\n"}<br/> */}
                    {optionList[cumulativeOptions[currQuestion] + index]}<br />
                    </label>
                ))}
                <br/>
            </ol>
            {/* only show the 'Next' button to move to recording stage once all questions have been answered */}
            <div className="button-container">
              {currQuestion > 0 && (
                <button className="big-button back-button" type="button" onClick={handleBack}>Back</button>
              )}
              {showNext ? (
                (EMAphase == "pre") ? (
                  <Link className="big-button next-button" onClick={submitSurvey} to={`/record/${name}/${scene}`}>Start Recording</Link>
                ) : (
                  <Link className="big-button next-button" onClick={submitSurvey} to={`/${name}`}>Submit</Link>
                )
              ) : (
                <button className="big-button next-button" type="button" onClick={handleNext}>Next</button>
              )}
            </div>
        </form>
    </div>
  );
};

export default Survey;

import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import SceneSelect from './SceneSelect';
import names from './names.json';

type HomeProps = {
  name: string;
};

function Home( { name }: HomeProps ) {
  const [scene1Progress, setScene1Progress] = useState(0);
  const [scene2Progress, setScene2Progress] = useState(0);
  const [scene1Name, setScene1Name] = useState('');
  const [scene2Name, setScene2Name] = useState('');

  const personObj = names.names.find(obj => Object.keys(obj)[0] === name);  
  const person = personObj ? Object.values(personObj)[0] : 'Unknown';

  const scenesObj = names.scenes.find(obj => Object.keys(obj)[0] === person);
  const scenes = scenesObj ? Object.values(scenesObj)[0] : [];
  const scene1 = scenes[0];
  const scene2 = scenes[1];



  // retrieve each user's progress from server 
  useEffect(() => {
    async function fetchProgress() {
      
      try {
        const response = await fetch(`https://emaserver.dsjlsdjsakdjsads.online/getProgress?name=${person}&scene1=${scene1}&scene2=${scene2}`);
        const data = await response.json();
        // we receive the data as a json response, and it maps "progress" to a two-value array
        // with scene 1's progress and scene 2's progress
        if (data.progress) {
          let prog = data["progress"];
          setScene1Progress(prog[0]?.N || 0);
          setScene2Progress(prog[1]?.N || 0);
        } else {
          console.error('Progress data not found in response');
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    }

    // retrieve each user's scene names from server
    async function fetchSceneNames() {
      try {
        const response = await fetch(`https://emaserver.dsjlsdjsakdjsads.online/getSceneNames?name=${person}&scene1=${scene1}&scene2=${scene2}`);
        const data = await response.json();
        // we receive the data as a json response, and it maps "sceneList" to a two-value array
        // with scene 1's name and scene 2's name for that particular user
        if (data.sceneList) {
          let names = data["sceneList"];
          setScene1Name(names[0] || '');
          setScene2Name(names[1] || '');
        } else {
          console.error('Progress data not found in response');
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    }

    fetchProgress();
    fetchSceneNames();
  }, []);   

  return (
    <div className="App">
      <div className="App-header">
        <h1>AHSLAB: EMA Recording App</h1>
        <p className='welcome'>Hi there, {person}! Here is your progress:</p>
        <div>
          Scene 1 ({scene1Name})
        </div>
        <div className="progress">
          <progress value={scene1Progress} max={5} /> ({scene1Progress} out of 5 done)
        </div>
        <Link className="big-button" to={`/survey/${name}/1`}>Go to Scene 1</Link>
        <div className="scene">
          Scene 2 ({scene2Name})
        </div>
        <div className="progress">
          <progress value={scene2Progress} max={5} /> ({scene2Progress} out of 5 done)
        </div>
        <Link className="big-button" to={`/survey/${name}/2`}>Go to Scene 2</Link>
      </div>
    </div>
  );
}


export default Home;

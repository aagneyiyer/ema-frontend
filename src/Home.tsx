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


  // retrieve each user's progress from server 
  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch(`https://emaserver.dsjlsdjsakdjsads.online/getProgress?name=${person}`);
        const data = await response.json();
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
        const response = await fetch(`https://emaserver.dsjlsdjsakdjsads.online/getSceneNames?name=${person}`);
        const data = await response.json();
        console.log("data is: ");
        console.log(data);
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
        <p>Hi there, {person}! Here is your progress:</p>
        <div>
          Scene 1 ({scene1Name})
        </div>
        <div>
          <progress value={scene1Progress} max={5} /> ({scene1Progress} out of 5 done)
        </div>
        <Link to={`/survey/${name}/1`}>Go to Scene 1</Link>
        <div>
          Scene 2 ({scene2Name})
        </div>
        <div>
          <progress value={scene2Progress} max={5} /> ({scene2Progress} out of 5 done)
        </div>
        <Link to={`/survey/${name}/2`}>Go to Scene 2</Link>
      </div>
    </div>
  );
}

export default Home;

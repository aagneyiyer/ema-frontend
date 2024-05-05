import React, { useState } from 'react';
import { Link, Route, Routes } from "react-router-dom";
import ProgressBars from "./ProgressBars";
import './App.css';
import SceneSelect from "./SceneSelect";
import Home from './Home';
import Survey from './Survey';
import Record from './Record';

const name = "Aagney";
const routes = [
  { path: "/scenes/:name", name: "Select", element: <SceneSelect/> },

  { path: "/secret-garden", name: "Home", element: <Home name={"secret-garden"}/> },
  { path: "/enchanted-forest", name: "Home", element: <Home name={"enchanted-forest"}/> },
  { path: "/hidden-cove", name: "Home", element: <Home name={"hidden-cove"}/> },
  { path: "/whispering-canyon", name: "Home", element: <Home name={"whispering-canyon"}/> },
  { path: "/forgotten-temple", name: "Home", element: <Home name={"forgotten-temple"}/> },
  { path: "/lost-lagoon", name: "Home", element: <Home name={"lost-lagoon"}/> },
  { path: "/echoing-cavern", name: "Home", element: <Home name={"echoing-cavern"}/> },
  { path: "/twilight-meadow", name: "Home", element: <Home name={"twilight-meadow"}/> },
  { path: "/sapphire-citadel", name: "Home", element: <Home name={"sapphire-citadel"}/> },
  { path: "/mystery-castle", name: "Home", element: <Home name={"mystery-castle"}/> },
 
  { path: "/survey/:name/:scene", name: "Survey", element: <Survey/> },
 
  { path: "/record/:name/:scene", name: "Record", element: <Record/> }
]

function App() {
  return (
    <div className="App-header">

      {/* define routes */}
      <Routes>
        {routes.map((route) => (
          <Route key={route.name} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <Link to="/main" className="LinkClass" style={{ color: "red" }}>
            App Start
          </Link>
        </h1>
      </header>
    </div>
  );
}

export default App;

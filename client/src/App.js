import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './scenes/Main';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Torrent searcher
      </header>
      <div className="App-content">
        <Main />
      </div>
      <footer className="App-footer">
        Developed by Timothée Boussus
      </footer>
    </div>
  );
}

export default App;

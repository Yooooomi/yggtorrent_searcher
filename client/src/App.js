import React from 'react';
import './App.css';
import Main from './scenes/Main';
import API from './services/API';

class App extends React.Component {
  async componentDidMount() {
    const apiInited = await API.init();

    if (apiInited) {
      console.log('API successfully initialized to ', apiInited);
    } else {
      console.error('Could not initialize API');
    }
  }

  render() {
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
}

export default App;

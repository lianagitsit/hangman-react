import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to HANGMAN x_x</h1>
        </header>
        <p className="App-intro">
        Press any key to get started!
        </p>
        <Game />
      </div>
    );
  }
}

class Game extends Component {
  constructor(props){
    super(props);
    this.state = {
      letters: [],
      isGameOn: false,
      guessesRemaining: 10,
      blanks: []
    };
  }

  componentWillMount(){
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyUp(e) {
    var keyInput = e.key.toUpperCase();
    var code = e.keyCode;
    var newStateArray = this.state.letters.slice();

    // is the game isn't already on, initialize the board with any key
    if (!this.state.isGameOn){
      this.setState({
        isGameOn: true
      });
      this.getCurrentWord();
    
    // if the game is on, ensure the input is a letter
    } else {
      if (code < 65 || code > 90){
        e.preventDefault();
      } else {
        var pos = this.state.wordInPlay.indexOf(keyInput);
        var newBlanksState = this.state.blanks.slice();

        // if the letter is in the word, replace each matching blank
        while (pos !== -1){
          newBlanksState[pos] = keyInput;
          pos = this.state.wordInPlay.indexOf(keyInput, pos + 1);
        }


        // handle letters already guessed and losing guesses
        if (newStateArray.indexOf(keyInput) !== -1 || newBlanksState.indexOf(keyInput) !== -1){
          e.preventDefault();
        } else {
          newStateArray.push(keyInput);
        }


        this.setState({
          key: keyInput,
          letters: newStateArray,
          blanks: newBlanksState
        })
      }
    }
  }

  getCurrentWord(){
    var words = ["banana", "dog", "madonna", "hello", "symphony", "photosynthesis", "coelomate"];
    var currentWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    var blanksArray = [];

    for (var i = 0; i < currentWord.length; i++){
      blanksArray.push("_ ");
    }

    this.setState({
      wordInPlay: currentWord,
      blanks: blanksArray
    })
  }

  render(){
    var gameOnString = (<h2>Game on!</h2>);
    // var gameOffString = (<h2>Game off!</h2>);
    var gameStatus = this.state.isGameOn ? gameOnString : false;

    return(
      <div>
        <p>Last key: {this.state.key}</p>
        <p>Log: {this.state.letters}</p>
        <p>Current word: {this.state.wordInPlay}</p>
        <p>{this.state.blanks}</p>
        {gameStatus}
      </div>
    );
  }
}


export default App;

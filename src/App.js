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
      blanks: [],
      wins: 0,
      didWin: false
    };
  }

  componentWillMount(){
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyUp(e) {
    var keyInput = e.key.toUpperCase();
    var code = e.keyCode;
    var newStateArray = this.state.letters.slice();
    var newBlanksState = this.state.blanks.slice();
    var oldGuessesRemaining = this.state.guessesRemaining;

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

        // if the letter is in the word, replace each matching blank
        while (pos !== -1){
          newBlanksState[pos] = keyInput;
          pos = this.state.wordInPlay.indexOf(keyInput, pos + 1);
        }


        // handle letters already guessed and initial losing guesses
        if (newStateArray.indexOf(keyInput) !== -1 || newBlanksState.indexOf(keyInput) !== -1){
          e.preventDefault();
        } else {
          newStateArray.push(keyInput);
          this.setState((prevState) => ({
            guessesRemaining: oldGuessesRemaining - 1
          }))
        }


        this.setState({
          key: keyInput,
          letters: newStateArray,
          blanks: newBlanksState
        })

        this.checkForWin();
      }
    }
  }

  checkForWin() {
    var finalWord = this.state.blanks.join("");

    if (finalWord === this.state.wordInPlay){
      this.setState((prevState) => ({
        wins: prevState.wins + 1
      }))

      this.setState({
        didWin: true
      })
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
      blanks: blanksArray,
      didWin: false
    })
  }

  render(){
    var gameOnString = (<h2>Game on!</h2>);
    var gameStatus = this.state.isGameOn ? gameOnString : false;

    // if the word is guessed correctly, display it at the top and play music
    // then automatically reinitialize with a new word
    // ... and make the message disappear and the music stop on beginning the new game

    var winCount = this.state.wins;
    var userWin = this.state.didWin ? winCount : false;

    return(
      <div>
        {this.state.didWin && (
          <div>
            <h2>You won with {this.state.wordInPlay}!</h2>
            <audio>
              <source src="glass-clink-2.mp3" type="audio/mpeg"/>
              Your browser does not support audio.
            </audio>
          </div>
        )}
        <p>Wins: {userWin}</p>
        <p>Letters already guessed: {this.state.letters}</p>
        <p>Current word: {this.state.wordInPlay}</p>
        <p>{this.state.blanks}</p>
        <p>Guesses Remaining: {this.state.guessesRemaining}</p>
        {gameStatus}
      </div>
    );
  }
}


export default App;

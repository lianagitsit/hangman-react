import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to REACT HANGMAN!</h1>
        </header>
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
      guessesRemaining: 3,
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

        // toggles the win message once player begins new game
        if (this.state.didWin || this.state.didLose){
          this.setState({
            didWin: false,
            didLose: false
          })
        }

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

        if (newBlanksState.indexOf("_ ") === -1 || !this.state.guessesRemaining){
          this.handleWinLose();
        }
      }
    }
  }

  handleWinLose() {
    // win
    if (this.state.blanks.indexOf("_ ") === -1){
      this.setState((prevState) => ({
        wins: prevState.wins + 1
      }))

      this.setState({
        didWin: true,
        prevWordInPlay: this.state.wordInPlay
      })
    
    // loss
    } else {
      this.setState({
        didLose: true,
        prevWordInPlay: this.state.wordInPlay
      })
    }

    // automatically reinitializes the board
    this.getCurrentWord();

  }

  getCurrentWord(){
    var words = ["state", "props", "component", "react", "arrow", "lifecycle", "facebook", "node", "render"];
    var currentWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    var blanksArray = [];

    console.log("The current word is: " + currentWord);

    for (var i = 0; i < currentWord.length; i++){
      blanksArray.push("_ ");
    }

    this.setState({
      wordInPlay: currentWord,
      blanks: blanksArray,
      letters: [],
      guessesRemaining: 3
    })
  }

  render(){

    var winNum = this.state.wins;
    var winCount = winNum > 0 ? winNum : false;
    var winLoseMessage = null;

    // display win or lose message
    if (this.state.didLose){
      winLoseMessage = (<h2>You lose, the word was {this.state.prevWordInPlay}!</h2>);
    } else {
      winLoseMessage = this.state.didWin && ( <h2>You won with {this.state.prevWordInPlay}!</h2>)
      //   <div>
      //     <h2>You won with {this.state.prevWordInPlay}!</h2>
      //     {/* <audio>
      //       <source src="glass-clink-2.mp3" type="audio/mpeg"/>
      //       Your browser does not support audio.
      //     </audio> */}
      //   </div>
      // );
    }

    var startMessage = !this.state.isGameOn ? (<p className="App-intro">Press any key to get started!</p>) : false;
    var guessCount = this.state.isGameOn ? this.state.guessesRemaining : false;

    return(
      <div>
        <div className="Message-box">
          {startMessage}
          {winLoseMessage}
        </div>
        <p>Wins: {winCount}</p>
        <p>Letters already guessed: {this.state.letters}</p>
        {/* <p>Current word: {this.state.wordInPlay}</p> */}
        <p>{this.state.blanks}</p>
        <p>Guesses Remaining: {guessCount}</p>
      </div>
    );
  }
}


export default App;

import React from 'react';

var _ = require('lodash');


var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};


const Stars = (props) => {
    return (
      <div className="col-sm-5">
          {_.range(props.numberOfStars).map( i => <i key={i} className="icon-star"></i>)}
    </div>
  );
}

const Button = (props) => {
    let button;
  switch(props.answerIsCorrect) {
      case true:
            button = <button className="btn btn-success"
                                        onClick={props.acceptAnswer}>
                    <i className="icon-check"></i></button>
        break;
    case false:
      button = <button className="btn btn-danger"><i className="icon-remove"></i></button>
        break;
    default:
        button = <button className="btn" 
                                          onClick={props.checkAnswer}
                                          disabled={props.selectedNumbers.length === 0}>=</button>
      break;
  }
    return (
      <div className="col-sm-2">
      {button}
      <br /> <br />
      <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.redraws === 0}>
          <i className="icon-refresh"></i> {props.redraws}
      </button>
    </div>
  );
}

const Answer = (props) => {
    return (
      <div className="col-sm-5">
        {props.selectedNumbers.map((number, i) => 
        <div  key={i} className='answerContainer'>
            <span
                onClick={() => props.unselectNumber(number)}
            >
                {number}
            </span>
        
            {i !== props.selectedNumbers.length - 1 ? ' + ' : ''}
          </div>
        )}
    </div>
  );
}

const Numbers = (props) => {  
    const selectedNumberClass = (selectedNumber) => {
    if(props.usedNumbers.indexOf(selectedNumber) >= 0)
        return 'used';
      if(props.selectedNumbers.indexOf(selectedNumber) >= 0)
        return'selected';
  }

  return (
      <div className="container card text-center">
            <div>
          {Numbers.list.map((number, i) => 
            <span 
              key={i}
            className= {selectedNumberClass(number)}
            onClick={() => props.selectNumber(number)}>
            {number}
          </span>
          )}
      </div>
    </div>
  );
}

Numbers.list = _.range(1, 10);

const DoneFrame = (props) => {
    return (
      <div>
        <h2 className="text-center">{props.doneStatus}</h2>
      <button className="btn btn-secondary center-block" onClick={props.resetGame}>Play Again</button>
    </div>
  );
};

class Game extends React.Component{
    static randomNumber = ()=> 1 + Math.floor(Math.random()*9);
    static initialState = () => ({ 
      selectedNumbers : [],
    usedNumbers: [],
        numberOfStars : Game.randomNumber(),
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null
  });
  
    state = Game.initialState();
  
  resetGame = () => {
      this.setState(Game.initialState());
  }
  
  selectNumber = (selectedNumber) => {
      if(this.state.selectedNumbers.indexOf(selectedNumber) >= 0)
        return;      
      if(this.state.usedNumbers.indexOf(selectedNumber) >= 0)
        return;
      
      this.setState(prevState => ({
        answerIsCorrect: null,
        selectedNumbers : prevState.selectedNumbers.concat(selectedNumber)
    }));
  };
  
  unselectNumber = (selectedNumber) => {  	
        this.setState(prevState => ({
          answerIsCorrect: null,
          selectedNumbers : prevState.selectedNumbers.filter(number => number !==selectedNumber)
      }));
  };
  
  checkAnswer = () => {
      this.setState(prevState => ({
        answerIsCorrect: prevState.numberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };
  
  acceptAnswer = () => {
      this.setState(prevState => ({
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
            numberOfStars : Game.randomNumber()
    }), this.updateDoneStatus);
  };
  
  redraw = () => {
      if(this.state.redraws === 0)
        return;
    this.setState(prevState => ({
            numberOfStars : Game.randomNumber(),
      redraws : prevState.redraws - 1,
      selectedNumbers: [],
      answerIsCorrect: null
    }), this.updateDoneStatus);
  };
  
  updateDoneStatus = () => {
      this.setState(prevState => {
        if(prevState.usedNumbers.length === 9)
          return { doneStatus: 'Done. Nice !' };
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState))
          return { doneStatus: 'Game Over!' };
    });
  };
  
  possibleSolutions = ({ numberOfStars, usedNumbers }) => {
      const possibleNumbers = _.range(1, 10).filter(number => 
            usedNumbers.indexOf(number) === -1
      );
    
    return possibleCombinationSum(possibleNumbers, numberOfStars);
  };
  
  render() {
      const { selectedNumbers, usedNumbers, numberOfStars, answerIsCorrect, redraws, doneStatus} = this.state;
      return (
        <div>
          <h3> Play nine </h3>
        <div className="row">
          <Stars numberOfStars = {numberOfStars} />
          <Button 
                      selectedNumbers={selectedNumbers} 
                checkAnswer={this.checkAnswer}
                redraw={this.redraw}
                redraws={redraws}
                acceptAnswer={this.acceptAnswer}
                answerIsCorrect={answerIsCorrect}/>
          <Answer unselectNumber={this.unselectNumber} selectedNumbers={selectedNumbers}/>
          <br />
          
        </div>
        <br />
        {doneStatus ? 
            <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame} /> :
          <Numbers 
                      selectNumber={this.selectNumber} 
                selectedNumbers={selectedNumbers} 
                usedNumbers={usedNumbers}/>
        }
      </div>
    );
  }

}


class App extends React.Component{
    
  render() {
      return (
        <div>
          <Game />
      </div>
    );
  }

}


export default App;

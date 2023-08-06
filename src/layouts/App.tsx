import { Component } from 'react'
import Home from './Home'
import ChosePlayer from './ChosePlayer'

type AppState = {
  chosePlayer: boolean;
  playerOne: string;
  isAI: boolean;
};
export default class App extends Component<{}, AppState> {

  constructor(props: {}){
    super(props);
    // this.state = {
    //   chosePlayer: true,
    //   playerOne: "",
    //   isAI: false
    // };
    this.onChose = this.onChose.bind(this);
  }

  render() {
    return (
      <>
        {this.state.chosePlayer ?
          <Home isAi={this.state.isAI} playerOne={this.state.playerOne} />
        :
          <ChosePlayer onChose={this.onChose}/>
        }
      </>
    )
  }

  onChose(playerColor: string, PlayerType: string){
    const isAI:boolean = PlayerType == "AI";
    this.setState({
      isAI: isAI,
      playerOne: playerColor,
      chosePlayer: true,
    })
  }
}

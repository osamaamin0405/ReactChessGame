import { Component } from 'react'
import { DndProvider } from 'react-dnd';
import TilePiece from '../components/TilePiece'
import ChessPiece from '../components/ChessPiece';
import ChessGame from '../services/gameSetting';
import { HTML5Backend } from 'react-dnd-html5-backend'
import Chess from '../services/Chess';
import Board from '../services/board/Board';
import Move from '../services/move/Move';
import MoveStatus from '../services/move/MoveStatus';
import PromotedBox from '../components/PromotedBox';
import MinMax from '../services/Ai/MinMAx';
import Btn from './Btn';
import {GiPreviousButton, GiNextButton} from "react-icons/gi";
import FenInput from './FenInput';
// const notionXKeys = ["A", "B", "C", "D", "E", "F", "G", "H"],
//   notionYKeys = ["1", "2", "3", "4", "5", "6", "7", "8"];


type ChessGameState = {
  chessBoard: Board;
  selectedLegalMoves: number[];
  promotedBox: boolean,
  promotedMove: Move,
  fenText?:string,
}

type ChessGameProps = {
  theme?: string;
  isAi: boolean;
  playerOne: string;
};

export default class Home extends Component<ChessGameProps, ChessGameState> {

  private gameSetting: ChessGame;
  private boardColor: BoardColor;
  private gameServices: Chess;
  private AI: MinMax;
  constructor(props: ChessGameProps) {
    super(props);
    this.gameSetting = new ChessGame("gray_shadow");
    this.AI = new MinMax(3);
    this.gameServices = new Chess();
    this.boardColor = this.gameSetting.theme.getBoardColor();
    this.state = {
      chessBoard: this.gameServices.initialGame(),
      selectedLegalMoves: [],
      promotedBox: false,
      promotedMove: null,
      fenText:'',
    }

  }

  // aiPlay(ai:MinMax){
  //   let newBoard = this.state.chessBoard;
  //   while(!newBoard.isGameOver){
  //     const bestMove = ai.execute(newBoard);
  //     const moveTransition = newBoard.currPlayer.makMove(bestMove);
  //     if(moveTransition.status == MoveStatus.isDone){

  //       newBoard = moveTransition.board;
  //     }
  //   }
  // }


  move(currPosition: number, candidatePosition: number) {
    if(this.state.chessBoard.isGameOver){
      console.log(MoveStatus.getState(3));
    }
    let pieceLegalMoves: Move[] = this.state.chessBoard.currPlayer.legalMoves;
    for (let move of pieceLegalMoves) {
      if (currPosition == move.currCoordinate && move.destinationCoordinate == candidatePosition) {
        if(move.type == "p")
        {
          this.setState({promotedBox: true});
          this.setState({promotedMove: move})
        }else{
          let moveTransition = this.state.chessBoard.currPlayer.makMove(move);
          if (moveTransition.status == MoveStatus.isDone) {
            this.setState({ chessBoard: moveTransition.board, fenText: moveTransition
                  .board.getFenFormat()});

            break;
          }
        }
      }
    }

  }


  promoterMove(pieceName: string){
    let promotedMove: Move = this.state.promotedMove;
    promotedMove.promotedPiece = pieceName;
    let moveTransition = this.state.chessBoard.currPlayer.makMove(promotedMove);
    if (moveTransition.status == MoveStatus.isDone) {
      this.setState({ chessBoard: moveTransition.board, promotedBox:false, promotedMove:null });
    }
  }

  onDragStart(props:PieceProps){
    //show dot Hits
    let legalPos = this.state.chessBoard.currPlayer.legalPositions(props.piece.position)
    this.setState({selectedLegalMoves: legalPos});
  }
  onDragEnd(){
    this.setState({selectedLegalMoves: []})
  }

  setTileColor(i:number){
    if(this.state.selectedLegalMoves.indexOf(i) != -1)
      return "#ff0";
    return  (Math.round(i + ((i + 4) / 8)) % 2) == 0 ? this.gameSetting.theme.getBoardColor().dark : this.gameSetting.theme.getBoardColor().light
  }

  readFenFile(fen: string){
    console.log(fen);
    if(Board.isFenFormat(fen)){
      this.setState({chessBoard: Board.fenToBoard(fen)})
    }
    
  }

  prevMove(){}

  nextMove(){}

  render() {
    return (
      <>
        {
          this.state.promotedBox && 
          (
            <PromotedBox 
              theme={this.gameSetting.theme}
              alliance={this.state.chessBoard.currPlayer.getAlliance()}
              onSelectPiece={this.promoterMove.bind(this)}
            />
          )
        }
        <div className='chess-engine'>
          <FenInput defaultValue={this.state.fenText} onApply={this.readFenFile.bind(this)}/>
          <div className='chess-board-engine flex gap-2'>
            <div className='players flex flex-col justify-between items-center'>
              <div className='player-one'>
                <img className='user-image' src='./assets/users/ai.png'></img>
                <div className='user-name'>AI</div>
              </div>
              
              <div className='player-two'>
                <img className='user-image' src='./assets/users/ai.png'></img>
                <div className='user-name'>AI</div>
              </div>
            </div>
            <div className='chess-board grid'>
              <DndProvider backend={HTML5Backend}>
                {
                  this.state.chessBoard.getGameBoard.map((e, i) => {
                    return <TilePiece
                      key={i + 1}
                      pieceProps={{
                        width: "60px",
                        height: "60px",
                        color: this.setTileColor(i),
                        index: i,
                      }}
                      movFunction={this.move.bind(this)}
                    >
                      <ChessPiece
                        position={i}
                        piece={e.getPiece()}
                        onDragStart={this.onDragStart.bind(this)}
                        onDragEnd = {this.onDragEnd.bind(this)}
                        image={e.isOccupied() ? this.gameSetting.theme.getPieceImage(e.getPiece().toString()) : ''}
                      ></ChessPiece>
                    </TilePiece>
                  })
                }
              </DndProvider>
            </div>
            <div className='moves-history'>
              <textarea
              className
                ='input h-full'
              placeholder='Moves Log'
              disabled>
              </textarea>
              <div className='controllers'>
                <ul className='flex list-none gap-2 justify-center items-center text-3xl text-slate-300 '>
                  <li>
                    <Btn onClick={this.prevMove.bind(this)}><GiPreviousButton title="Previous Move" /></Btn>
                  </li>
                  <li>
                    <Btn onClick={this.nextMove.bind(this)}><GiNextButton title="Next Move"/></Btn>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

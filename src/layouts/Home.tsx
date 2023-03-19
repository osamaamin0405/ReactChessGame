import React, { Component } from 'react'
import { DndProvider } from 'react-dnd';
import TilePiece from '../components/TilePiece'
import ChessPiece from '../components/ChessPiece';
import ChessGame from '../services/gameSetting';
import { HTML5Backend } from 'react-dnd-html5-backend'
import Chess from '../services/Chess';
import Board from '../services/board/Board';
import Move from '../services/move/Move';
import MoveStatus from '../services/move/MoveStatus';
import BoardUtils from '../services/board/BoardUtils';
const notionXKeys = ["A", "B", "C", "D", "E", "F", "G", "H"],
  notionYKeys = ["1", "2", "3", "4", "5", "6", "7", "8"];


type ChessGameState = {
  chessBoard: Board;
  selectedLegalMoves: number[];
}
export default class Home extends Component<ChessGameProps, ChessGameState> {

  private gameSetting: ChessGame;
  private boardColor: BoardColor;
  gameServices: Chess;
  constructor(props: ChessGameProps) {
    super(props);
    
    this.gameSetting = new ChessGame("gray_shadow", { name: 'osama', isAi: false }, { name: 'Ai', isAi: true });
    this.gameServices = new Chess();
    this.boardColor = this.gameSetting.theme.getBoardColor();
    this.state = {
      chessBoard: this.gameServices.initialGame(),
      selectedLegalMoves: [],
    }
  }


  move(currPosition: number, candidatePosition: number) {
    // console.log(this.state.chessBoard)
    if(this.state.chessBoard.currPlayer.isInCheckMate()){
      console.log(MoveStatus.getState(3));
    }
    let pieceLegalMoves: Move[] = this.state.chessBoard.currPlayer.legalMoves.flat();
    for (let move of pieceLegalMoves) {
      if (currPosition == move.currCoordinate && move.destinationCoordinate == candidatePosition) {
        let moveTransition = this.state.chessBoard.currPlayer.makMove(move);
        
        if (moveTransition.status == MoveStatus.isDone) {
          this.setState({ chessBoard: moveTransition.board });
        }
        console.log(moveTransition)
      }
    }
  }

  onDragStart(props:PieceProps){
    let legalPos = this.state.chessBoard.currPlayer.legalPositions(props.piece.position)
    // console.log(legalPos)
    this.setState({selectedLegalMoves: legalPos});
  }
  onDragEnd(){
    this.setState({selectedLegalMoves: []})
  }

  setTileColor(i:number){
    if(this.state.selectedLegalMoves.indexOf(i) > -1) return "#0ff";
    return  (Math.round(i + ((i + 4) / 8)) % 2) == 0 ? this.gameSetting.theme.getBoardColor().dark : this.gameSetting.theme.getBoardColor().light
  }

  render() {
    return (
      <div className='boarder-container grid'>
        <div className='y-notion'>
          {
            notionYKeys.map((v) => {
              return <span key={v}>{v}</span>
            })
          }
        </div>
        <div className='grid' style={{ gridTemplateColumns: "repeat(8, 60px)" }}>
          <DndProvider options={{ondrag: ()=>{console.log("d")}}} backend={HTML5Backend}>
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
        <div className='x-notion'>
          {
            notionXKeys.map((v) => {
              return <span key={v}>{v}</span>
            })
          }
        </div>
      </div>
    );
  }
}

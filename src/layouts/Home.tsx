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
const notionXKeys = ["A", "B", "C", "D", "E", "F", "G", "H"],
  notionYKeys = ["1", "2", "3", "4", "5", "6", "7", "8"];


type ChessGameState = {
  chessBoard: Board;
  selectedLegalMoves: number[];
  promotedBox: boolean,
  promotedMove: Move,
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
    if(this.state.chessBoard.currPlayer.isInCheckMate()){
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
            this.setState({ chessBoard: moveTransition.board });
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
    return  (Math.round(i + ((i + 4) / 8)) % 2) == 0 ? this.gameSetting.theme.getBoardColor().dark : this.gameSetting.theme.getBoardColor().light
  }

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
            <div className='fen-input flex  items-center gap-2'>
              <input className='input my-5 grow' placeholder='FEN file formate'/>
              <Btn className='secondary-btn bg-sky-800 px-4 w-[200px]'>Apply</Btn>
            </div>
            <div className='chess-board-engine flex gap-2'>
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
              <div className='moves-history '>
                <textarea
                className
                  ='input h-full'
                placeholder='Moves Log'
                disabled
              ></textarea>
              </div>
            </div>
          </div>
          
      </>
    );
  }
}

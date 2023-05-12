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
import FenInput from '../components/FenInput';
import {PlayerInfo} from "../components/PlayerInfo";
import {Controllers} from "../components/Controllers";
import {HistoryLink} from "../components/HistoryLink";
import {HistoryList} from "../components/HistoryList";

type ChessGameState = {
  chessBoard: Board;
  selectedLegalMoves: number[];
  promotedBox: boolean,
  promotedMove: Move,
  fenText?:string,
  historyMoves?: string[][];
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
      historyMoves: [],
    }
  }

  componentDidMount() {
    this.setState({fenText: this.state.chessBoard.getFenFormat()})
  }

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
            this.updateMoveStates(moveTransition.board, move);
            break;
          }
        }
      }
    }

  }


  updateMoveStates(newBoard: Board, move: Move){
    const fenText: string = newBoard.getFenFormat();
    this.setState({chessBoard: newBoard, fenText:fenText});
    this.state.historyMoves.push([move.toString(), fenText]);
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
    const isWhite:boolean       = (Math.round(i + ((i + 4) / 8)) % 2) != 0,
          whiteKingPos :number  = this.state.chessBoard.whitePlayer.king.position,
          blackKingPos :number  = this.state.chessBoard.blackPlayer.king.position,
          whiteInCheck :boolean = this.state.chessBoard.whitePlayer.isInCheck(),
          blackInCheck :boolean = this.state.chessBoard.blackPlayer.isInCheck(),
          whiteColor:string     = " bg-slate-100 ",
          blackColor:string     = " bg-slate-500 ",
          isOccupiedPos:boolean  = this.state.chessBoard.getTile(i).isOccupied();
    let returnedClasses: string = (isWhite ? whiteColor : blackColor)
    if(this.state.selectedLegalMoves.indexOf(i) != -1){
      if(isOccupiedPos)returnedClasses += " occupied-bg "
      else returnedClasses += " dot-hint ";
    }
    if(whiteInCheck && i == whiteKingPos)               returnedClasses += " check-color ";
    if(blackInCheck && i == blackKingPos)               returnedClasses += " check-color ";
    return returnedClasses;
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
              <PlayerInfo name={"AI"} />
              <PlayerInfo name={"Human"} />
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
                        index: i,
                      }}
                      className={this.setTileColor(i)}
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
            <div className='moves-history w-[200px]'>
              <div
              className="h-full w-full border-2 border-slate-500 rounded p-2 text-slate-300 select-none"
              >
                {
                  this.state.historyMoves.length == 0
                    ? 'Moves History'
                    : <HistoryList list={this.state.historyMoves} onClickItem={this.readFenFile.bind(this)} />
                }
              </div>
              <Controllers nextEvent={this.nextMove.bind(this)} prevEvent={this.prevMove.bind(this)} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

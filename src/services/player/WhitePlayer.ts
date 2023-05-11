import { QueenSideCastleMove } from "./../move/Move";
import Alliance from "../board/Alliance";
import Board from "../board/Board";
import Move from "../move/Move";
import Piece from "../piece/Piece";
import Player from "./Player";

export default class WhitePlayer extends Player {
  constructor(board: Board, legalMoves: Move[], opponentLegalMoves: Move[]) {
    super(board, legalMoves, opponentLegalMoves);
  }

  public getActivePieces(): Piece[] {
    return this._board.whitePieces;
  }
  public getOpponent(): Player {
    return this._board.blackPlayer;
  }
  public getAlliance(): Alliance {
    return Board.Alliances.white;
  }

  public getAvailableCastle():string{
    let castlingString:string ="";
    const [whiteQueenCastles, whiteKingCastle] = [ this.CanCastle(56, 58,  [57, 58, 59]) ,
        this.CanCastle(63, 62,  [61, 62])];

    if(whiteKingCastle) castlingString += "K"
    if(whiteQueenCastles) castlingString += "Q"
    return castlingString;
  }
}

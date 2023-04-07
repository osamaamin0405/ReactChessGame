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
}

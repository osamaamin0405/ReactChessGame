import Alliance from "../board/Alliance";
import Board from "../board/Board";
import Move from "../move/Move";
import Piece from "../piece/Piece";
import Player from "./Player";

export default class BlackPlayer extends Player {
  constructor(board: Board, legalMoves: Move[], opponentLegalMoves: Move[]) {
    super(board, legalMoves, opponentLegalMoves);
  }

  public getActivePieces(): Piece[] {
    return this._board.blackPieces;
  }

  public getOpponent(): Player {
    return this._board.whitePlayer;
  }
  public getAlliance(): Alliance {
    return Board.Alliances.black;
  }
}

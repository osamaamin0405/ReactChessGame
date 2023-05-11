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


  public getAvailableCastle():string{
    let castlingString: string = "",
      [blackQueenCastle, blackKingCastle] = [
        this.CanCastle(0, 2,  [1, 2, 3]),
        this.CanCastle(7, 6, [6, 5]),
      ];

    if(blackKingCastle) castlingString += "k"
    if(blackQueenCastle) castlingString += 'q'
    return castlingString
  }

}

import { Bishop, King, Knight, Pawn, Queen, Rook } from "../piece";
import Piece from "../piece/Piece";
import Player from "../player/Player";
import Alliance from "./Alliance";
import Board from "./Board";
import BoardUtils from "./BoardUtils";

export default class Builder {
  public boardConfig: Piece[] = new Array<Piece>(BoardUtils.TILES_CELLS);
  public _enPassantPawn: Piece;
  private _moveMaker: Alliance;
  public setMoveMaker(moveMaker: Alliance): Builder {
    this._moveMaker = moveMaker;
    return this;
  }

  public get moveMaker(): Alliance {
    return this._moveMaker;
  }

  public setPiece(piece: Piece): Builder {
    this.boardConfig[piece.position] = piece;
    return this;
  }

  setEnPassantPawn(pawn: Piece) {
    this._enPassantPawn = pawn;
  }

  // create instance of piece object from piece string
  createPiece(piece: string, index: number): Piece {
    switch (piece) {
      case "p":
        return new Pawn(index, Board.Alliances.black);
      case "P":
        return new Pawn(index, Board.Alliances.white);
      case "r":
        return new Rook(index, Board.Alliances.black);
      case "R":
        return new Rook(index, Board.Alliances.white);
      case "b":
        return new Bishop(index, Board.Alliances.black);
      case "B":
        return new Bishop(index, Board.Alliances.white);
      case "n":
        return new Knight(index, Board.Alliances.black);
      case "N":
        return new Knight(index, Board.Alliances.white);
      case "q":
        return new Queen(index, Board.Alliances.black);
      case "Q":
        return new Queen(index, Board.Alliances.white);
      case "k":
        return new King(index, Board.Alliances.black);
      case "K":
        return new King(index, Board.Alliances.white);
    }
    throw new Error("Invalid piece type: " + piece);
  }

  public build(): Board {
    return new Board(this);
  }
}

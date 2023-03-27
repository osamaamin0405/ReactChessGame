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

  public build(): Board {
    return new Board(this);
  }
}

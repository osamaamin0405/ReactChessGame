import Alliance from "../board/Alliance";
import Board from "../board/Board";
import Move from "../move/Move";
import Bishop from "./Bishop";
import Knight from "./Knight";
import Queen from "./Queen";
import Rook from "./Rook";

export default abstract class Piece {
  protected _isFirstMove: boolean;
  protected abstract _name: string;

  protected piecePosition: number;
  protected _alliance: Alliance;

  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirstMove: boolean = true
  ) {
    this.piecePosition = piecePosition;
    this._alliance = alliance;
    this._isFirstMove = isFirstMove;
  }

  public get position(): number {
    return this.piecePosition;
  }
  getAlliance(): string {
    return this._alliance.name;
  }

  public get alliance(): Alliance {
    return this._alliance;
  }

  toString(): string {
    return this._name;
  }

  public get name(): string {
    return this._name;
  }

  get isFirstMove(): boolean {
    return this._isFirstMove;
  }

  set isFirstMove(value: boolean) {
    this._isFirstMove = value;
  }

  public equals(obj: any): boolean {
    if (obj instanceof Piece) {
      return (
        this.alliance.name == obj.alliance.name &&
        this.position == obj.position &&
        this.name == this.name
      );
    }
    return false;
  }

  establishPromotion(
    promotedPiece: string,
    distanceCoordinates: number,
    alliance: Alliance
  ): Piece {
    throw new Error("overrides on Pawn");
  }

  public abstract createInstance(): Piece;

  public abstract movePiece(position: number, alliance: Alliance): Piece;

  public abstract getLegalMoves(board: Board): Move[];
}

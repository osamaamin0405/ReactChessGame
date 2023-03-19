import Alliance from "../board/Alliance";
import Board from "../board/Board";
import Move from "../move/Move";
import MoveStatus from "../move/MoveStatus";
import Piece from "../piece/Piece";
import TransitionMove from "./TransitionMove";

export default abstract class Player {
  protected _board: Board;
  protected _legalMoves: Move[][];
  protected _opponentLegalMoves: Move[][];
  protected _king: Piece;
  private _isInCheck: boolean;
  private _isInCheckMate: boolean;
  constructor(
    board: Board,
    legalMoves: Move[][],
    opponentLegalMoves: Move[][]
  ) {
    this._board = board;
    this._legalMoves = legalMoves;
    this._opponentLegalMoves = opponentLegalMoves;
    this._king = this.establishKing();
    this._isInCheck = !(
      Player.attacksOnTile(this._king.position, this._opponentLegalMoves.flat())
        .length == 0
    );
  }

  legalPositions(piecePos: number): number[] {
    const legalPositions: number[] = [];
    for (let move of this._legalMoves.flat()) {
      if (move.currCoordinate == piecePos)
        legalPositions.push(move.destinationCoordinate);
    }
    return legalPositions;
  }

  public static attacksOnTile(
    position: number,
    opponentLegalMoves: Move[]
  ): Move[] {
    const attacksMove: Move[] = [];
    for (let move of opponentLegalMoves) {
      if (position === move.getDestinationCoordinates()) {
        attacksMove.push(move);
      }
    }
    return attacksMove;
  }

  protected establishKing(): Piece {
    for (let piece of this.getActivePieces()) {
      if (piece.name == "k" || piece.name == "K") {
        return piece;
      }
    }
    throw new Error("Invalid Game Board");
  }

  isLegalMove(move: Move): boolean {
    return this._legalMoves.flat().includes(move);
  }

  private hasEscapeMove(): boolean {
    for (let move of this._legalMoves.flat()) {
      let moveTransition = this.makMove(move);
      if (moveTransition.status == 0) {
        return true;
      }
    }

    return false;
  }

  public isInCheck() {
    return this._isInCheck;
  }

  public isInCheckMate() {
    return this._isInCheck && !this.hasEscapeMove();
  }

  public get king(): Piece {
    return this._king;
  }

  public get legalMoves(): Move[][] {
    return this._legalMoves;
  }

  // TODO: implement this methods below
  public isCastled() {
    return false;
  }

  public makMove(move: Move): TransitionMove {
    if (!this.isLegalMove(move)) {
      return new TransitionMove(this._board, move, MoveStatus.IllegalMove);
    }

    const board: Board = move.execute();
    console.log(board.toString());
    const attacksOnKing = Player.attacksOnTile(
      board.currPlayer.getOpponent().king.position,
      board.currPlayer.legalMoves.flat()
    );
    if (!(attacksOnKing.length == 0)) {
      return new TransitionMove(board, move, MoveStatus.LEAVES_PLAYER_IN_CHECk);
    }
    return new TransitionMove(board, move, MoveStatus.isDone);
  }

  public abstract getActivePieces(): Piece[];
  public abstract getOpponent(): Player;
  public abstract getAlliance(): Alliance;
}

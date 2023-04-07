import Alliance from "../board/Alliance";
import Board from "../board/Board";
import Move, { KingSideCastleMove, QueenSideCastleMove } from "../move/Move";
import MoveStatus from "../move/MoveStatus";
import Piece from "../piece/Piece";
import TransitionMove from "./TransitionMove";

export default abstract class Player {
  protected _board: Board;
  protected _legalMoves: Move[];
  protected _opponentLegalMoves: Move[];
  protected _king: Piece;
  private _isInCheck: boolean;
  private _isCastled: boolean = false;
  constructor(board: Board, legalMoves: Move[], opponentLegalMoves: Move[]) {
    this._board = board;
    this._legalMoves = legalMoves;
    this._opponentLegalMoves = opponentLegalMoves;
    this._king = this.establishKing();
    this._isInCheck = !(
      Player.attacksOnTile(this._king.position, this._opponentLegalMoves)
        .length == 0
    );
    this.establishCastle();
  }

  legalPositions(piecePos: number): number[] {
    const legalPositions: number[] = [];
    for (let move of this._legalMoves) {
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
    return this._legalMoves.includes(move);
  }

  private hasEscapeMove(): boolean {
    for (let move of this._legalMoves) {
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

  public get legalMoves(): Move[] {
    return this._legalMoves;
  }

  // TODO: implement this methods below
  public get isCastled() {
    return this._isCastled;
  }

  public set isCastled(value: boolean) {
    this._isCastled = value;
  }

  public makMove(move: Move): TransitionMove {
    if (!this.isLegalMove(move)) {
      return new TransitionMove(this._board, move, MoveStatus.IllegalMove);
    }

    const board: Board = move.execute();
    const attacksOnKing = Player.attacksOnTile(
      board.currPlayer.getOpponent().king.position,
      board.currPlayer.legalMoves
    );
    if (!(attacksOnKing.length == 0)) {
      return new TransitionMove(board, move, MoveStatus.LEAVES_PLAYER_IN_CHECk);
    }
    return new TransitionMove(board, move, MoveStatus.isDone);
  }

  private establishCastle() {
    this.QueenSideCastle(56, 58, 59, [57, 58, 59]); // whitePlayer Castle
    this.KingSideCastle(63, 62, 61, [61, 62]); // whitePlayer Castle
    this.QueenSideCastle(0, 2, 3, [1, 2, 3]); // blackPlayer Castle
    this.KingSideCastle(7, 6, 5, [6, 5]); // blackPlayer Castle
  }

  private CanCastle(
    rookPos: number,
    kingCastlePos: number,
    mustEmptyTile: number[]
  ): boolean {
    const rook: Piece = this._board.getTile(rookPos).getPiece();
    let canCastle = false;
    if (
      rook &&
      rook.isFirstMove &&
      this._king.isFirstMove &&
      Player.attacksOnTile(kingCastlePos, this._opponentLegalMoves)
    ) {
      for (let tilePosition of mustEmptyTile) {
        if (this._board.getTile(tilePosition).isOccupied()) {
          canCastle = false;
          break;
        }
        canCastle = true;
      }
    }
    return canCastle;
  }

  private QueenSideCastle(
    rookPos: number,
    kingCastlePos: number,
    rookCastlePos: number,
    mustEmptyTiles: number[]
  ) {
    const rook: Piece = this._board.getTile(rookPos).getPiece();
    if (this.CanCastle(rookPos, kingCastlePos, mustEmptyTiles)) {
      this._legalMoves.push(
        new QueenSideCastleMove(
          this._board,
          this._king,
          rook,
          kingCastlePos,
          rookCastlePos
        )
      );
    }
  }
  private KingSideCastle(
    rookPos: number,
    kingCastlePos: number,
    rookCastlePos: number,
    mustEmptyTiles: number[]
  ) {
    const rook: Piece = this._board.getTile(rookPos).getPiece();
    if (this.CanCastle(rookPos, kingCastlePos, mustEmptyTiles)) {
      this._legalMoves.push(
        new KingSideCastleMove(
          this._board,
          this._king,
          rook,
          kingCastlePos,
          rookCastlePos
        )
      );
    }
  }

  public abstract getActivePieces(): Piece[];
  public abstract getOpponent(): Player;
  public abstract getAlliance(): Alliance;
}

import Move, {
  PawnAttack,
  PawnEnPassantMove,
  PawnJump,
  PawnMove,
} from "./../move/Move";
import Alliance from "../board/Alliance";
import Board from "../board/Board";
import Tile from "../board/Tile";
import Piece from "./Piece";
import BoardUtils from "../board/BoardUtils";

export default class Pawn extends Piece {
  protected _name: string;
  private static candidateCoordinates: Array<number> = [8, 16, 7, 9];
  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirstMove: boolean = true
  ) {
    super(piecePosition, alliance, isFirstMove);
    this._name = alliance.isWhite ? "P" : "p";
    // this.enPassant = this.findEnPassant()
  }

  //override
  public getLegalMoves(board: Board): Move[] {
    let candidateDistance: number,
      legalMoves: Move[] = [];

    for (let currCandidateOffset of Pawn.candidateCoordinates) {
      candidateDistance =
        this.piecePosition +
        this._alliance.getDirection() * currCandidateOffset;

      try {
        legalMoves.push(
          this.noneAttachedMoves(
            board,
            currCandidateOffset,
            candidateDistance
          ) as Move
        );
      } catch (e) {
        try {
          legalMoves.push(
            this.attackMove(
              board,
              currCandidateOffset,
              candidateDistance
            ) as Move
          );
        } catch (e) {}
      }
    }
    try {
      legalMoves.push(this.enPassantAttack(board));
    } catch (e) {}
    return legalMoves;
  }

  private noneAttachedMoves(
    board: Board,
    currCoordinates: number,
    distanceCandidate: number
  ): Move {
    let candidateTile = board.getTile(distanceCandidate),
      candidateTile2 = board.getTile(distanceCandidate - 8);
    if (currCoordinates == 8 && !candidateTile.isOccupied()) {
      return new PawnMove(board, this, distanceCandidate);
    } else if (
      currCoordinates == 16 &&
      this._isFirstMove &&
      !candidateTile2.isOccupied() &&
      !candidateTile.isOccupied()
    ) {
      return new PawnJump(board, this, distanceCandidate);
    }
    throw new Error("Attack Move Or Invalid Position");
  }

  private attackMove(
    board: Board,
    currCoordinates: number,
    distanceCandidate: number
  ) {
    let candidateTile = board.getTile(distanceCandidate),
      candidateTilePiece = candidateTile.getPiece();
    if (
      (currCoordinates == 7 || currCoordinates == 9) &&
      candidateTile.isOccupied() &&
      candidateTilePiece.alliance.name != this.alliance.name
    ) {
      return new PawnAttack(board, this, distanceCandidate);
    }
    throw new Error("None Attack Move");
  }

  private enPassantAttack(board: Board): Move {
    const enPassantTiles = this.getEnPassantTiles(board);
    for (let enPassantTile of enPassantTiles) {
      const piece: Piece = enPassantTile.getPiece();
      if (
        enPassantTile.isOccupied() &&
        piece.alliance.name != this.alliance.name
      ) {
        if (piece.equals(board.enPassantPawn)) {
          const calculateDistanceCoordinate = Math.abs(
            board.enPassantPawn.position * this.alliance.getDirection() + 8
          );
          console.log(calculateDistanceCoordinate);
          return new PawnEnPassantMove(
            board,
            this,
            board.enPassantPawn,
            calculateDistanceCoordinate
          );
        }
      }
    }

    throw new Error("No enPassant");
  }

  private getEnPassantTiles(board: Board): Tile[] {
    if (BoardUtils.isFirstColumn[this.position]) {
      return [board.getTile(this.position + 1)];
    } else if (BoardUtils.isEighthColumn[this.position]) {
      return [board.getTile(this.position - 1)];
    }

    return [board.getTile(this.position + 1), board.getTile(this.position - 1)];
  }

  public createInstance(): Piece {
    return new Pawn(this.position, this.alliance);
  }

  public movePiece(position: number, alliance: Alliance): Piece {
    return new Pawn(position, alliance, false);
  }
}

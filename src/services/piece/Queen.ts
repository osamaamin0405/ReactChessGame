import { AttackMove, MajorMove } from "../move/Move";
import Board from "../board/Board";
import BoardUtils from "../board/BoardUtils";
import Move from "../move/Move";
import Tile from "../board/Tile";
import Piece from "./Piece";
import Alliance from "../board/Alliance";

export default class Queen extends Piece {
  protected _name: string;
  private static candidateCoordinates: Array<number> = [
    -9, 9, -7, 7, 1, -1, 8, -8,
  ]; //extended from bishop and rook

  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirstMove: boolean = true
  ) {
    super(piecePosition, alliance, isFirstMove);
    this._name = alliance.isWhite ? "Q" : "q";
  }

  public getLegalMoves(board: Board): Move[] {
    let legalMoves: Move[] = []; // all legal moves for this piece
    for (let candidateCoordinatesOffset of Queen.candidateCoordinates) {
      let distanceCandidateCoordinates = this.piecePosition;
      while (
        BoardUtils.isValidTileCoordinates(distanceCandidateCoordinates) &&
        this.stopMove(distanceCandidateCoordinates)
      ) {
        distanceCandidateCoordinates += candidateCoordinatesOffset;
        if (
          (candidateCoordinatesOffset == 1 ||
            candidateCoordinatesOffset == -1) &&
          !BoardUtils.isSameRow(this.position, distanceCandidateCoordinates)
        )
          continue;
        // Exceptions
        if (
          !BoardUtils.isValidTileCoordinates(distanceCandidateCoordinates) ||
          this.firstColumnExclusion(
            this.piecePosition,
            candidateCoordinatesOffset
          ) ||
          this.eightColumnExclusion(
            this.piecePosition,
            candidateCoordinatesOffset
          )
        )
          break;
        let tile: Tile = board.getTile(distanceCandidateCoordinates);
        // tile is not empty
        if (!tile.isOccupied()) {
          legalMoves.push(
            new MajorMove(board, this, distanceCandidateCoordinates)
          );
        } else {
          // not occupied tile
          let piece: Piece = tile.getPiece();
          if (piece.getAlliance() == this.alliance.name) break;
          else
            legalMoves.push(
              new AttackMove(board, this, distanceCandidateCoordinates)
            );
          break;
        }
      }
    }
    return legalMoves;
  }

  stopMove(distanceCandidateCoordinates: number): boolean {
    if (BoardUtils.isFirstColumn[this.position]) {
      return !BoardUtils.isEighthColumn[distanceCandidateCoordinates];
    } else if (BoardUtils.isEighthColumn[this.position]) {
      return !BoardUtils.isFirstColumn[distanceCandidateCoordinates];
    }

    return !(
      BoardUtils.isEighthColumn[distanceCandidateCoordinates] ||
      BoardUtils.isFirstColumn[distanceCandidateCoordinates]
    );
  }

  private firstColumnExclusion(
    currPosition: number,
    candidateOffset: number
  ): boolean {
    return (
      BoardUtils.isFirstColumn[currPosition] &&
      (candidateOffset == -1 || candidateOffset == -9 || candidateOffset == 7)
    );
  }

  private eightColumnExclusion(
    currPosition: number,
    candidateOffset: number
  ): boolean {
    return (
      BoardUtils.isEighthColumn[currPosition] &&
      (candidateOffset == 1 || candidateOffset == 9 || candidateOffset == -7)
    );
  }

  public createInstance(): Piece {
    return new Queen(this.position, this.alliance);
  }

  public movePiece(position: number, alliance: Alliance): Piece {
    return new Queen(position, alliance, true);
  }
}

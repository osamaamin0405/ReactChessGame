import { AttackMove, MajorMove } from "../move/Move";
import Board from "../board/Board";
import BoardUtils from "../board/BoardUtils";
import Move from "../move/Move";
import Tile from "../board/Tile";
import Piece from "./Piece";
import Alliance from "../board/Alliance";

export default class Bishop extends Piece {
  protected _value: number = 330;
  protected _name: string;
  private static candidateCoordinates: Array<number> = [-9, 9, -7, 7];
  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirstMove: boolean = true
  ) {
    super(piecePosition, alliance, isFirstMove);
    this._name = alliance.isWhite ? "B" : "b";
  }

  public getLegalMoves(board: Board): Move[] {
    let legalMoves: Move[] = []; // all legal moves for this piece
    for (let candidateCoordinatesOffset of Bishop.candidateCoordinates) {
      let distanceCandidateCoordinates = this.position;
      while (
        BoardUtils.isValidTileCoordinates(distanceCandidateCoordinates) &&
        this.stopMove(distanceCandidateCoordinates)
      ) {
        distanceCandidateCoordinates += candidateCoordinatesOffset;
        // Exceptions
        if (
          !BoardUtils.isValidTileCoordinates(distanceCandidateCoordinates) ||
          this.exclusions(candidateCoordinatesOffset)
        ) {
          continue;
        }
        let tile: Tile = board.getTile(distanceCandidateCoordinates);
        // tile is not empty
        if (!tile.isOccupied()) {
          legalMoves.push(
            new MajorMove(board, this, distanceCandidateCoordinates)
          );
        } else {
          //occupied tile
          let piece: Piece = tile.getPiece();
          if (piece.getAlliance() == this._alliance.name) break;
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
      (candidateOffset == -9 || candidateOffset == 7)
    );
  }

  private eightColumnExclusion(
    currPosition: number,
    candidateOffset: number
  ): boolean {
    return (
      BoardUtils.isEighthColumn[currPosition] &&
      (candidateOffset == 9 || candidateOffset == -7)
    );
  }

  private exclusions(candidateOffset: number): boolean {
    return (
      this.firstColumnExclusion(this.position, candidateOffset) ||
      this.eightColumnExclusion(this.position, candidateOffset)
    );
  }

  public createInstance(): Piece {
    return new Bishop(this.position, this.alliance);
  }

  public movePiece(position: number, alliance: Alliance): Piece {
    return new Bishop(position, alliance, false);
  }
}

import { AttackMove, MajorMove } from "../move/Move";
import Board from "../board/Board";
import BoardUtils from "../board/BoardUtils";
import Move from "../move/Move";
import Tile from "../board/Tile";
import Piece from "./Piece";
import Alliance from "../board/Alliance";

export default class Rook extends Piece {
  protected _name: string;
  private static candidateCoordinates: Array<number> = [1, -1, 8, -8];

  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirstMove: boolean = true
  ) {
    super(piecePosition, alliance, isFirstMove);
    this._name = alliance.isWhite ? "R" : "r";
  }

  public getLegalMoves(board: Board): Move[] {
    let legalMoves: Move[] = []; // all legal moves for this piece
    for (let candidateCoordinatesOffset of Rook.candidateCoordinates) {
      let distanceCandidateCoordinates = this.position;
      while (BoardUtils.isValidTileCoordinates(distanceCandidateCoordinates)) {
        distanceCandidateCoordinates += candidateCoordinatesOffset;
        if (
          (candidateCoordinatesOffset == 1 ||
            candidateCoordinatesOffset == -1) &&
          !BoardUtils.isSameRow(this.position, distanceCandidateCoordinates)
        ) {
          continue;
        }
        if (
          !BoardUtils.isValidTileCoordinates(distanceCandidateCoordinates) ||
          this.firstColumnExclusion(
            this.position,
            distanceCandidateCoordinates
          ) ||
          this.eightColumnExclusion(this.position, distanceCandidateCoordinates)
        )
          // Exceptions
          continue;
        let tile: Tile = board.getTile(distanceCandidateCoordinates);
        // tile is not empty
        if (!tile.isOccupied()) {
          legalMoves.push(
            new MajorMove(board, this, distanceCandidateCoordinates)
          );
        } else {
          // not occupied tile
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

  private firstColumnExclusion(
    currPosition: number,
    candidateOffset: number
  ): boolean {
    return BoardUtils.isFirstColumn[currPosition] && candidateOffset == -1;
  }

  private eightColumnExclusion(
    currPosition: number,
    candidateOffset: number
  ): boolean {
    return BoardUtils.isEighthColumn[currPosition] && candidateOffset == 1;
  }

  public createInstance(): Piece {
    return new Rook(this.position, this.alliance);
  }

  public movePiece(position: number, alliance: Alliance): Piece {
    return new Rook(position, alliance, false);
  }
}

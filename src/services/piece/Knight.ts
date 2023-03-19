import Alliance from "../board/Alliance";
import Board from "../board/Board";
import BoardUtils from "../board/BoardUtils";
import Move, { AttackMove, MajorMove } from "../move/Move";
import Tile from "../board/Tile";
import Piece from "./Piece";

export default class Knight extends Piece {
  protected _name: string;
  private static candidateCoordinates: Array<number> = [
    -17, -15, -10, -6, 17, 15, 10, 6,
  ];
  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirsMove: boolean = false
  ) {
    super(piecePosition, alliance, isFirsMove);
    this._name = alliance.isWhite ? "N" : "n";
  }

  //override
  public getLegalMoves(board: Board): Move[] {
    let candidateDistance: number,
      legalMoves: Move[] = [];

    for (let currCandidate of Knight.candidateCoordinates) {
      candidateDistance = this.piecePosition + currCandidate;

      if (
        !BoardUtils.isValidTileCoordinates(candidateDistance) ||
        this.Exclusions(this.piecePosition, currCandidate)
      ) {
        continue;
      }
      let tile: Tile = board.getTile(candidateDistance);

      if (!tile.isOccupied())
        legalMoves.push(new MajorMove(board, this, candidateDistance));
      else {
        const piece: Piece = tile.getPiece(),
          alliance: string = piece.getAlliance();
        if (this._alliance.name != alliance)
          legalMoves.push(new AttackMove(board, this, candidateDistance));
      }
    }
    return legalMoves;
  }

  firstColumnExclusion(currPosition: number, currCandidate: number): boolean {
    return (
      BoardUtils.isFirstColumn[currPosition] &&
      (currCandidate == -17 ||
        currCandidate == -10 ||
        currCandidate == 6 ||
        currCandidate == 15)
    );
  }

  secondeColumnExclusion(currPosition: number, currCandidate: number): boolean {
    return (
      BoardUtils.isSecondeColumn[currPosition] &&
      (currCandidate == -10 || currCandidate == 6)
    );
  }

  seventhColumnExclusion(currPosition: number, currCandidate: number): boolean {
    return (
      BoardUtils.isSeventhColumn[currPosition] &&
      (currCandidate == 10 || currCandidate == -6)
    );
  }

  eighthColumnExclusion(currPosition: number, currCandidate: number): boolean {
    return (
      BoardUtils.isEighthColumn[currPosition] &&
      (currCandidate == 17 ||
        currCandidate == 10 ||
        currCandidate == -6 ||
        currCandidate == -15)
    );
  }

  Exclusions(currPosition: number, candidatePosition: number): boolean {
    return (
      this.firstColumnExclusion(currPosition, candidatePosition) ||
      this.secondeColumnExclusion(currPosition, candidatePosition) ||
      this.seventhColumnExclusion(currPosition, candidatePosition) ||
      this.eighthColumnExclusion(currPosition, candidatePosition)
    );
  }

  public createInstance(): Piece {
    return new Knight(this.position, this.alliance);
  }

  public movePiece(position: number, alliance: Alliance): Piece {
    return new Knight(position, alliance, false);
  }
}

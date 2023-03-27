import Alliance from "../board/Alliance";
import Board from "../board/Board";
import BoardUtils from "../board/BoardUtils";
import Move, { AttackMove, MajorMove } from "../move/Move";
import Tile from "../board/Tile";
import Piece from "./Piece";

export default class King extends Piece {
  protected _value: number = 10000;
  protected _name: string;
  private static candidateCoordinates: Array<number> = [
    -9, -7, -8, -1, 1, 7, 8, 9,
  ];
  constructor(
    piecePosition: number,
    alliance: Alliance,
    isFirstMove: boolean = true
  ) {
    super(piecePosition, alliance, isFirstMove);
    this._name = alliance.isWhite ? "K" : "k";
  }

  //override
  public getLegalMoves(board: Board): Move[] {
    let candidateDistance: number,
      legalMoves: Move[] = [];
    for (let currCandidate of King.candidateCoordinates) {
      candidateDistance = this.position + currCandidate;
      if (
        !BoardUtils.isValidTileCoordinates(candidateDistance) ||
        this.Exclusions(currCandidate)
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
      (currCandidate == -1 || currCandidate == -9 || currCandidate == 7)
    );
  }

  eighthColumnExclusion(currPosition: number, currCandidate: number): boolean {
    return (
      BoardUtils.isEighthColumn[currPosition] &&
      (currCandidate == 1 || currCandidate == 9 || currCandidate == -7)
    );
  }

  Exclusions(candidatePosition: number): boolean {
    return (
      this.firstColumnExclusion(this.position, candidatePosition) ||
      this.eighthColumnExclusion(this.position, candidatePosition)
    );
  }

  public createInstance(): Piece {
    return new King(this.position, this.alliance);
  }

  public movePiece(position: number, alliance: Alliance): Piece {
    return new King(position, alliance, false);
  }
}

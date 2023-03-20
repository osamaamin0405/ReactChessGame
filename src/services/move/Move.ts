import Piece from "../piece/Piece";
import Board from "../board/Board";
import Builder from "../board/Builder";

export default abstract class Move {
  protected board: Board;
  protected _piece: Piece;
  protected distanceCoordinates: number;
  constructor(board: Board, piece: Piece, distanceCoordinates: number) {
    this.board = board;
    this._piece = piece;
    this.distanceCoordinates = distanceCoordinates;
  }

  getDestinationCoordinates(): number {
    return this.distanceCoordinates;
  }
  get destinationCoordinate(): number {
    return this.distanceCoordinates;
  }

  get piece() {
    return this._piece;
  }

  // executeV1(builder: Builder): Board {
  //   // builder.setPiece(
  //   //   this._piece.movePiece(
  //   //     this.getDestinationCoordinates(),
  //   //     this._piece.alliance
  //   //   )
  //   // );
  //   // builder.setMoveMaker(this.board.currPlayer.getOpponent().getAlliance());
  //   // return builder.build();
  // }

  public get currCoordinate(): number {
    return this._piece.position;
  }

  public onExecute(callback: Function) {
    if (callback) {
      callback.call(this);
    }
    return this;
  }

  executeBuilder(): Builder {
    const builder = new Builder();
    for (let piece of this.board.currPlayer.getActivePieces()) {
      //Todo: objects compare and equals pieces
      if (!this._piece.equals(piece)) {
        builder.setPiece(piece);
      }
    }

    for (let piece of this.board.currPlayer.getOpponent().getActivePieces()) {
      builder.setPiece(piece);
    }
    //TODO: implement actually moving the piece
    builder.setPiece(
      this._piece.movePiece(this.distanceCoordinates, this._piece.alliance)
    );
    builder.setMoveMaker(this.board.currPlayer.getOpponent().getAlliance());
    return builder;
  }

  execute(): Board {
    const builder = this.executeBuilder();
    return builder.build();
  }
}

export class MajorMove extends Move {
  constructor(board: Board, piece: Piece, distanceCoordinates: number) {
    super(board, piece, distanceCoordinates);
  }
}

export class AttackMove extends Move {
  constructor(board: Board, piece: Piece, distanceCoordinates: number) {
    super(board, piece, distanceCoordinates);
  }
}

export class PawnMove extends Move {}

export class PawnAttack extends AttackMove {
  constructor(board: Board, piece: Piece, distanceCoordinate: number) {
    super(board, piece, distanceCoordinate);
  }
}

export class PawnEnPassantMove extends PawnAttack {
  private attackedPawn: Piece;
  constructor(
    board: Board,
    piece: Piece,
    attackedPawn: Piece,
    distanceCoordinate: number
  ) {
    super(board, piece, distanceCoordinate);
    this.attackedPawn = attackedPawn;
  }

  execute(): Board {
    const builder = this.executeBuilder();
    delete builder.boardConfig[this.attackedPawn.position];
    return builder.build();
  }
}

export class PawnJump extends PawnMove {
  execute(): Board {
    const builder = this.executeBuilder();
    builder.setEnPassantPawn(
      this.piece.movePiece(this.distanceCoordinates, this.piece.alliance)
    );
    return builder.build();
  }
}

export class CastleMove extends Move {
  protected rook;
  protected rookDist;
  constructor(
    board: Board,
    king: Piece,
    rook: Piece,
    kingDist: number,
    rookDist: number
  ) {
    super(board, king, kingDist);
    this.rook = rook;
    this.rookDist = rookDist;
  }

  execute(): Board {
    const builder = this.executeBuilder();
    delete builder.boardConfig[this.rook.position];
    builder.setPiece(this.rook.movePiece(this.rookDist, this.rook.alliance));
    return builder.build();
  }
}

export class KingSideCastleMove extends CastleMove {}

export class QueenSideCastleMove extends CastleMove {}

export class FactoryMove {
  constructor() {
    throw new Error("not instantiable");
  }

  static createMove(
    board: Board,
    currCoordinate: number,
    distanceCoordinate: number
  ): Move {
    for (let move of board.getAllLegalMove) {
      if (
        move.currCoordinate === currCoordinate &&
        move.destinationCoordinate === distanceCoordinate
      ) {
        return move;
      }
    }
    throw new Error("Invalid Move Coordinates");
  }

  public factory() {
    throw new Error("FactoryMove");
  }
}

// export class NullMove extends Move {}

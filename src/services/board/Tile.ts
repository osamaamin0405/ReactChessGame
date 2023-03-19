import Piece from "../piece/Piece";
// import BoardUtils from "./BoardUtils";

export default abstract class Tile {
  protected tileCoordinate: number;
  // private static emptyTilesCash: { [i: number]: EmptyTile } =
  //   this.createAllPossibleEmptyTiles();
  constructor(tileCoordinate: number) {
    this.tileCoordinate = tileCoordinate;
  }

  public abstract isOccupied(): boolean;
  public abstract getPiece(): Piece;

  // private static createAllPossibleEmptyTiles(): { [i: number]: EmptyTile } {
  //   let emptyTiles: { [i: number]: EmptyTile } = {};
  //   for (let i = 0; i < BoardUtils.TILES_CELLS; i++) {
  //     emptyTiles[i] = new EmptyTile(i);
  //   }
  //   return emptyTiles;
  // }

  public static CreateTile(tileCoordinate: number, piece: Piece): Tile {
    return piece != null
      ? new OccupiedTile(tileCoordinate, piece)
      : new EmptyTile(tileCoordinate);
  }
}

export class EmptyTile extends Tile {
  constructor(tileCoordinate: number) {
    super(tileCoordinate);
  }

  public isOccupied(): boolean {
    return false;
  }

  public getPiece(): Piece {
    return null;
  }
}

export class OccupiedTile extends Tile {
  protected piece: Piece;
  constructor(tileCoordinate: number, piece: Piece) {
    super(tileCoordinate);
    this.piece = piece;
  }

  getPiece(): Piece {
    return this.piece;
  }

  public isOccupied(): boolean {
    return true;
  }
}

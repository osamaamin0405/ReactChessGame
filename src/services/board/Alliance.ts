import Player from "../player/Player";

export default abstract class Alliance {
  abstract getDirection(): number;
  protected abstract _name: string;
  abstract get name(): string;
  abstract get isWhite(): boolean;
  abstract get isBlack(): boolean;
  abstract chosePlayer(whitePlayer: Player, blackPlayer: Player): Player;
  public equals(obj: any): boolean {
    return obj instanceof Alliance && obj.name === this._name;
  }
}

export class White extends Alliance {
  chosePlayer(whitePlayer: Player, _: Player): Player {
    return whitePlayer;
  }
  protected _name: string = "White";
  getDirection(): number {
    return -1;
  }

  public get name(): string {
    return this._name;
  }

  public get isWhite(): boolean {
    return true;
  }

  public get isBlack(): boolean {
    return false;
  }
}

export class Black extends Alliance {
  chosePlayer(_: Player, blackPlayer: Player): Player {
    return blackPlayer;
  }
  protected _name: string = "Black";
  getDirection(): number {
    return 1;
  }

  public get name(): string {
    return this._name;
  }

  public get isWhite(): boolean {
    return false;
  }

  public get isBlack(): boolean {
    return true;
  }
}

import Board from "./board/Board";

export default class Chess {
  private _board: Board;

  constructor() {
    this._board = Board.createStandardGame();
  }

  public get board(): Board {
    return this._board;
  }

  initialGame() {
    return this._board;
  }
}

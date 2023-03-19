import Board from "../board/Board";
import Move from "../move/Move";

export default class TransitionMove {
  readonly board: Board;
  readonly move: Move;
  readonly status: number;
  constructor(board: Board, move: Move, status: number) {
    this.board = board;
    this.move = move;
    this.status = status;
  }
}

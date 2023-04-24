import Board from "../board/Board";
import Move from "../move/Move";

export default interface MoveStrategy {
  execute(board: Board): Move;
}

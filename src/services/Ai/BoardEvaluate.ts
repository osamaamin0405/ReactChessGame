import Board from "../board/Board";

export default interface BoardEvaluate {
  evaluate(board: Board, depth: number): number;
}

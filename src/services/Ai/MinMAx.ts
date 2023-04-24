import Board from "../board/Board";
import Move from "../move/Move";
import MoveStatus from "../move/MoveStatus";
import ChessBoardEvaluator from "./AdvancedEvaluator";
import BoardEvaluate from "./BoardEvaluate";
import MoveStrategy from "./MoveStrategy";
import StanderBoardEvaluate from "./StanderBoardEvaluate";

export default class MinMax implements MoveStrategy {
  private readonly boardEvaluator: BoardEvaluate;
  private readonly depth: number;

  constructor(searchDepth: number) {
    this.boardEvaluator = new StanderBoardEvaluate();
    this.depth = searchDepth;
  }

  execute(board: Board): Move {
    let bestMove: Move | undefined;
    let bestValue = -Infinity;
    for (const move of board.currPlayer.legalMoves) {
      const moveTransition = board.currPlayer.makMove(move);
      if (moveTransition.status !== MoveStatus.isDone) continue;
      const value = this.minimax(
        moveTransition.board,
        this.depth - 1,
        -Infinity,
        Infinity,
        !board.currPlayer.getAlliance().isWhite
      );
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
    return bestMove;
  }

  private minimax(
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
  ): number {
    if (depth === 0 || board.isGameOver) {
      return this.boardEvaluator.evaluate(board, depth);
    }

    const legalMoves = board.currPlayer.legalMoves;
    let bestValue = maximizingPlayer ? -Infinity : Infinity;
    for (const move of legalMoves) {
      const moveTransition = board.currPlayer.makMove(move);
      if (moveTransition.status !== MoveStatus.isDone) continue;
      const value = this.minimax(
        moveTransition.board,
        depth - 1,
        alpha,
        beta,
        !maximizingPlayer
      );
      if (maximizingPlayer) {
        bestValue = Math.max(bestValue, value);
        alpha = Math.max(alpha, value);
      } else {
        bestValue = Math.min(bestValue, value);
        beta = Math.min(beta, value);
      }
      if (beta <= alpha) break;
    }
    return bestValue;
  }
}

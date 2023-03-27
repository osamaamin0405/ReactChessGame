import Board from "../board/Board";
import Move from "../move/Move";
import MoveStatus from "../move/MoveStatus";
import BoardEvaluate from "./BoardEvaluate";
import MoveStrategy from "./MoveStartegy";
import StanderBoardEvaluate from "./StanderBoardEvaluate";

export default class MinMax implements MoveStrategy {
  private boardEvaluator: BoardEvaluate;
  private depth: number;
  constructor(searchDepth: number) {
    this.boardEvaluator = new StanderBoardEvaluate();
    this.depth = searchDepth;
  }
  execute(board: Board): Move {
    let lowestSeenValue: number = Number.MAX_VALUE,
      highSeenValue: number = Number.MIN_VALUE,
      currValue: number,
      bestMove: Move;

    for (let move of board.currPlayer.legalMoves.flat()) {
      let moveTransition = board.currPlayer.makMove(move);
      if (moveTransition.status == MoveStatus.isDone) {
        currValue = board.currPlayer.getAlliance().isWhite
          ? this.min(moveTransition.board, this.depth - 1)
          : this.max(moveTransition.board, this.depth - 1);
        if (
          board.currPlayer.getAlliance().isWhite &&
          currValue >= highSeenValue
        ) {
          highSeenValue = currValue;
          bestMove = move;
        } else if (
          board.currPlayer.getAlliance().isBlack &&
          currValue <= lowestSeenValue
        ) {
          lowestSeenValue = currValue;
          bestMove = move;
        }
      }
    }

    return bestMove;
  }

  private isGameOver(board: Board): boolean {
    return (
      board.whitePlayer.isInCheckMate() || board.blackPlayer.isInCheckMate()
    );
  }

  private min(board: Board, depth: number): number {
    if (depth == 0 || this.isGameOver(board)) {
      return this.boardEvaluator.evaluate(board, depth);
    }
    let lowestSeenValue: number = Number.MAX_VALUE;
    for (let move of board.currPlayer.legalMoves.flat()) {
      const moveTransition = board.currPlayer.makMove(move);
      if (moveTransition.status == MoveStatus.isDone) {
        const currVal = this.max(moveTransition.board, depth - 1);
        if (currVal < lowestSeenValue) lowestSeenValue = currVal;
      }
    }
    return lowestSeenValue;
  }

  private max(board: Board, depth: number): number {
    if (depth == 0 /* || game js over*/) {
      return this.boardEvaluator.evaluate(board, depth);
    }
    let highSeenValue: number = Number.MIN_VALUE;
    for (let move of board.currPlayer.getOpponent().legalMoves.flat()) {
      const moveTransition = board.currPlayer.makMove(move);
      if (moveTransition.status == MoveStatus.isDone) {
        const currVal = this.min(moveTransition.board, depth - 1);
        if (currVal > highSeenValue) highSeenValue = currVal;
      }
    }
  }
}

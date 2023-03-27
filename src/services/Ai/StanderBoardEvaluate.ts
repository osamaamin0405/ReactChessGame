import Board from "../board/Board";
import Player from "../player/Player";
import BoardEvaluate from "./BoardEvaluate";

export default class StanderBoardEvaluate implements BoardEvaluate {
  private CHECK_BOUNCE: number = 50;
  private CHECK_BOUNCE_MATE: number = 10000;
  private DEPTH_BOUNCE: number = 100;
  private CASTLE_BOUNCE: number = 60;
  evaluate(board: Board, depth: number): number {
    return (
      this.scorePlayer(board.whitePlayer, depth) -
      this.scorePlayer(board.blackPlayer, depth)
    );
  }

  scorePlayer(player: Player, depth: number): number {
    return (
      this.piceValue(player) +
      this.mobility(player) +
      this.check(player) +
      this.checkMate(player, depth) +
      this.castled(player)
    );
  }
  castled(player: Player): number {
    return player.isCastled ? this.CASTLE_BOUNCE : 0;
  }
  checkMate(player: Player, depth: number): number {
    return player.getOpponent().isInCheckMate()
      ? this.CHECK_BOUNCE_MATE + this.depthBounce(depth)
      : 0;
  }
  depthBounce(depth: number): number {
    return depth == 0 ? 1 : this.DEPTH_BOUNCE * depth;
  }

  check(player: Player): number {
    return player.getOpponent().isInCheck() ? this.CHECK_BOUNCE : 0;
  }
  mobility(player: Player): number {
    return player.legalMoves.flat().length;
  }
  piceValue(player: Player): number {
    let pieceScore: number;
    for (let piece of player.getActivePieces()) {
      pieceScore += piece.value;
    }
    return pieceScore;
  }
}

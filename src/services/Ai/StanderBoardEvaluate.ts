import Board from "../board/Board";
import MoveStatus from "../move/MoveStatus";
import Player from "../player/Player";
import BoardEvaluate from "./BoardEvaluate";

export default class StanderBoardEvaluate implements BoardEvaluate {
  private CHECK_BOUNCE: number = 50;
  private CHECK_BOUNCE_MATE: number = 10000;
  private DEPTH_BOUNCE: number = 100;
  private CASTLE_BOUNCE: number = 60;
  private alpha: number = -Infinity;
  private beta: number = Infinity;

  evaluate(board: Board, depth: number): number {
    return (
      this.scorePlayer(board.whitePlayer, depth) -
      this.scorePlayer(board.blackPlayer, depth)
    );
  }

  scorePlayer(player: Player, depth: number): number {
    let pieceScore: number = this.piceValue(player);
    let mobilityScore: number = this.mobility(player);
    let attackedPieceScore: number = this.checkAttackedPiece(player);
    let pawnStructureScore: number =
      this.evaluatePawnStructureAndPassedPawns(player);
    return (
      pieceScore +
      mobilityScore +
      attackedPieceScore +
      pawnStructureScore +
      this.check(player) +
      this.checkMate(player, depth) +
      this.castled(player)
    );
  }

  checkAttackedPiece(player: Player): number {
    let attackedPieceScore = 0;
    for (let move of player.legalMoves) {
      if (move.isAttack()) {
        attackedPieceScore += move.attackedPiece.value / 10;
      }
    }
    return attackedPieceScore;
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
    return player.legalMoves.length;
  }

  piceValue(player: Player): number {
    let pieceScore: number = 0;
    for (let piece of player.getActivePieces()) {
      pieceScore += piece.value;
    }
    return pieceScore;
  }

  evaluatePawnStructure(player: Player): number {
    let pawnStructureScore = 0;

    const pawns = player
      .getActivePieces()
      .filter((piece) => piece.name.toLowerCase() === "p");

    for (let pawn of pawns) {
      // Check for doubled pawns
      const sameFilePawns = pawns.filter(
        (otherPawn) =>
          otherPawn !== pawn &&
          otherPawn.XYPosition()[0] === pawn.XYPosition()[0]
      );
      if (sameFilePawns.length > 1) {
        pawnStructureScore -= 10;
      }

      // Check for isolated pawns
      const adjacentFiles = ["a", "b", "c", "d", "e", "f", "g", "h"].filter(
        (file) =>
          Math.abs(file.charCodeAt(0) - pawn.XYPosition()[0].charCodeAt(0)) <= 1
      );
      const adjacentPawns = pawns.filter(
        (otherPawn) =>
          otherPawn !== pawn &&
          adjacentFiles.includes(otherPawn.XYPosition()[0])
      );
      if (adjacentPawns.length === 0) {
        pawnStructureScore -= 20;
      }
    }

    return pawnStructureScore;
  }

  evaluatePassedPawns(player: Player): number {
    let passedPawnScore = 0;

    const pawns = player
      .getActivePieces()
      .filter((piece) => piece.name.toLowerCase() === "p");

    for (let pawn of pawns) {
      const rank = pawn.XYPosition()[1];
      const file = pawn.XYPosition()[0];

      // Check if pawn is passed
      let isPassed = true;
      for (let otherPawn of player.getOpponent().getActivePieces()) {
        if (
          otherPawn.name.toLowerCase() === "p" &&
          otherPawn.XYPosition()[0] === file &&
          ((player.getAlliance().isWhite && otherPawn.XYPosition()[1] > rank) ||
            (player.getAlliance().isBlack && otherPawn.XYPosition()[1] < rank))
        ) {
          isPassed = false;
          break;
        }
      }

      if (isPassed) {
        passedPawnScore += 20;
      }
    }

    return passedPawnScore;
  }

  evaluatePawnPromotion(player: Player): number {
    let promotionScore = 0;

    const pawns = player
      .getActivePieces()
      .filter((piece) => piece.name.toLowerCase() === "p");

    for (let pawn of pawns) {
      if (
        (player.getAlliance().isWhite && pawn.XYPosition()[1] === 8) ||
        (player.getAlliance().isBlack && pawn.XYPosition()[1] === 1)
      ) {
        promotionScore += 50;
      }
    }

    return promotionScore;
  }

  evaluatePawnStructureAndPassedPawns(player: Player): number {
    return (
      this.evaluatePawnStructure(player) +
      this.evaluatePassedPawns(player) +
      this.evaluatePawnPromotion(player)
    );
  }
}

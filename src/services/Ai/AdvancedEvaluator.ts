import Board from "../board/Board";
import { Pawn } from "../piece";
import Piece from "../piece/Piece";
import BoardEvaluate from "./BoardEvaluate";

export default class ChessBoardEvaluator implements BoardEvaluate {
  // Returns a numerical evaluation of the current board position
  public evaluate(board: Board, depth: number): number {
    let score = 0;

    // Evaluate each piece on the board
    for (let piece of board.allActivePieces) {
      // Call evaluation functions for each piece type
      switch (piece.name.toLowerCase()) {
        case "p":
          score += this.evaluatePawn(board, piece, piece.row, piece.col);
          break;
        case "n":
          score += this.evaluateKnight(board, piece, piece.row, piece.col);
          break;
        case "b":
          score += this.evaluateBishop(board, piece, piece.row, piece.col);
          break;
        case "r":
          score += this.evaluateRook(board, piece, piece.row, piece.col);
          break;
        case "q":
          score += this.evaluateQueen(board, piece, piece.row, piece.col);
          break;
        case "k":
          score += this.evaluateKing(board, piece, piece.row, piece.col);
          break;
      }
    }

    score = board.currPlayer.getAlliance().isWhite ? score : -score;
    console.log(board.currPlayer);

    return score;
  }

  // Evaluation function for pawns
  private evaluatePawn(
    board: Board,
    pawn: Piece,
    row: number,
    col: number
  ): number {
    let score = 1;

    // Increase score for pawns that have advanced towards the opponent's side of the board
    if (pawn.alliance.isBlack && row > 3) {
      score += row - 3;
    } else if (pawn.alliance.isWhite && row < 4) {
      score += 4 - row;
    }

    // Decrease score for isolated pawns
    if (this.isIsolatedPawn(board, pawn, col)) {
      score -= 0.5;
    }

    // Decrease score for doubled pawns
    if (this.isDoubledPawn(board, pawn, col)) {
      score -= 0.5;
    }

    return score;
  }

  // Returns true if the specified pawn is isolated
  private isIsolatedPawn(board: Board, pawn: Piece, col: number): boolean {
    // Check if there are no pawns of the same color on adjacent columns
    const adjacentCols = [col - 1, col + 1];
    for (const adjacentCol of adjacentCols) {
      if (adjacentCol >= 0 && adjacentCol < 8) {
        const piece = board
          .getTile(pawn.getPosition(pawn.row, adjacentCol))
          .getPiece();
        if (piece) {
          if (pawn.isSibling(piece)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  // Returns true if the specified pawn is doubled
  private isDoubledPawn(board: Board, pawn: Piece, col: number): boolean {
    // Check if there is another pawn of the same color on the same column
    for (let row = 0; row < 8; row++) {
      if (row != pawn.row) {
        let piece = board.getTile(pawn.getPosition(row, col)).getPiece();
        if (piece) {
          if (pawn.isSibling(piece)) {
            return false;
          }
        }
      }
    }

    return false;
  }

  // Evaluation function for knights
  private evaluateKnight(
    board: Board,
    knight: Piece,
    row: number,
    col: number
  ): number {
    let score = 3;

    // Increase score for knights that are in the center of the board
    if ((row == 3 || row == 4) && (col == 3 || col == 4)) {
      score += 1;
    }

    // Decrease score for knights that are on the edge of the board
    if (row == 0 || row == 7 || col == 0 || col == 7) {
      score -= 0.5;
    }

    // Decrease score for knights that are blocked by their own pieces
    if (this.isBlocked(board, knight, row, col)) {
      score -= 1;
    }

    return score;
  }

  // Returns true if the specified knight is blocked by its own pieces
  private isBlocked(
    board: Board,
    knight: Piece,
    row: number,
    col: number
  ): boolean {
    const blockingSquares: [number, number][] = [
      [row - 2, col - 1],
      [row - 2, col + 1],
      [row - 1, col - 2],
      [row - 1, col + 2],
      [row + 1, col - 2],
      [row + 1, col + 2],
      [row + 2, col - 1],
      [row + 2, col + 1],
    ];

    for (const [r, c] of blockingSquares) {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const piece = board.getTile(r + 8 * c).getPiece();
        if (
          piece instanceof Piece &&
          piece.alliance.name == knight.alliance.name
        ) {
          return true;
        }
      }
    }

    return false;
  }

  // Evaluation function for bishops
  private evaluateBishop(
    board: Board,
    bishop: Piece,
    row: number,
    col: number
  ): number {
    let score = 3;

    // Increase score for bishops that are on the opponent's half of the board
    if (
      (bishop.alliance.isWhite && row > 3) ||
      (bishop.alliance.isBlack && row < 4)
    ) {
      score += 1;
    }

    // Decrease score for bishops that are on the same diagonal as their own pawns
    if (this.isBlockedByOwnPawn(board, bishop, row, col)) {
      score -= 0.5;
    }

    return score;
  }

  // Returns true if the specified bishop is blocked by its own pawns
  private isBlockedByOwnPawn(
    board: Board,
    bishop: Piece,
    row: number,
    col: number
  ): boolean {
    const pawnsOnDiagonal: Pawn[] = [];

    // Find all pawns on the same diagonal as the bishop
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
      const piece = board.getTile(r + 8 * c).getPiece();
      if (
        piece instanceof Pawn &&
        piece.alliance.name == bishop.alliance.name
      ) {
        pawnsOnDiagonal.push(piece);
      }
    }
    for (let r = row - 1, c = col + 1; r >= 0 && c < 8; r--, c++) {
      const piece = board.getTile(r + 8 * c).getPiece();
      if (
        piece instanceof Pawn &&
        piece.alliance.name == bishop.alliance.name
      ) {
        pawnsOnDiagonal.push(piece);
      }
    }
    for (let r = row + 1, c = col - 1; r < 8 && c >= 0; r++, c--) {
      const piece = board.getTile(r + 8 * c).getPiece();
      if (
        piece instanceof Pawn &&
        piece.alliance.name == bishop.alliance.name
      ) {
        pawnsOnDiagonal.push(piece);
      }
    }
    for (let r = row + 1, c = col + 1; r < 8 && c < 8; r++, c++) {
      const piece = board.getTile(r + 8 * c).getPiece();
      if (
        piece instanceof Pawn &&
        piece.alliance.name == bishop.alliance.name
      ) {
        pawnsOnDiagonal.push(piece);
      }
    }

    // Check if any of the pawns on the diagonal are blocking the bishop's path
    for (const pawn of pawnsOnDiagonal) {
      if (
        (bishop.row < pawn.row && row > pawn.row) ||
        (bishop.row > pawn.row && row < pawn.row)
      ) {
        return true;
      }
    }

    return false;
  }

  // Evaluation function for rooks
  private evaluateRook(
    board: Board,
    rook: Piece,
    row: number,
    col: number
  ): number {
    let score = 5;

    // Increase score for rooks that are on the opponent's half of the board
    if (
      (rook.alliance.isWhite && row > 3) ||
      (rook.alliance.isBlack && row < 4)
    ) {
      score += 1;
    }

    // Increase score for rooks that are on open files (i.e., no pawns of either color)
    const pawnsOnFile = this.getPawnsOnFile(board, col);
    if (pawnsOnFile.length == 0) {
      score += 1;
    }

    // Increase score for rooks that are on the same file as their own pawns
    const ownPawnsOnFile = pawnsOnFile.filter(
      (pawn) => pawn.alliance.name == rook.alliance.name
    );
    if (ownPawnsOnFile.length > 0) {
      score += 0.5;
    }

    return score;
  }

  // Returns all pawns on the specified file
  private getPawnsOnFile(board: Board, col: number): Pawn[] {
    const pawnsOnFile: Pawn[] = [];
    for (let row = 0; row < 8; row++) {
      const piece = board.getTile(row + 8 * col);
      if (piece instanceof Pawn) {
        pawnsOnFile.push(piece);
      }
    }
    return pawnsOnFile;
  }

  private evaluateQueen(
    board: Board,
    queen: Piece,
    row: number,
    col: number
  ): number {
    let score = 9;

    // Increase score for queens that are on the opponent's half of the board
    if (
      (queen.alliance.isWhite && row > 3) ||
      (queen.alliance.isBlack && row < 4)
    ) {
      score += 1;
    }

    // Increase score for queens that are on open diagonals
    const openDiagonals = this.getOpenDiagonals(board, row, col);
    if (openDiagonals.length > 0) {
      score += openDiagonals.length / 2;
    }

    // Increase score for queens that are on open files or ranks
    const openFiles = this.getOpenFiles(board, row);
    const openRanks = this.getOpenRanks(board, col);
    if (openFiles.length == 0 || openRanks.length == 0) {
      score += 1;
    }

    return score;
  }

  // Returns all open diagonals that the specified position is on
  private getOpenDiagonals(
    board: Board,
    row: number,
    col: number
  ): [number, number][] {
    const openDiagonals: [number, number][] = [];

    // Check top-left to bottom-right diagonal
    for (
      let i = Math.min(row, col), j = Math.min(row, col);
      i < 8 && j < 8;
      i++, j++
    ) {
      if (i != row && j != col && !board.getTile(i + 8 * j).isOccupied()) {
        openDiagonals.push([i, j]);
      }
    }

    // Check top-right to bottom-left diagonal
    for (
      let i = Math.min(row, 7 - col), j = Math.max(0, col - row);
      i < 8 && j >= 0;
      i++, j--
    ) {
      if (i != row && j != col && !board.getTile(i + 8 * j).isOccupied()) {
        openDiagonals.push([i, j]);
      }
    }

    return openDiagonals;
  }

  // Returns all open files that the specified position is on
  private getOpenFiles(board: Board, row: number): number[] {
    const openFiles: number[] = [];
    for (let col = 0; col < 8; col++) {
      const piece = board.getTile(row + 8 * col).isOccupied();
      if (!piece) {
        openFiles.push(col);
      }
    }
    return openFiles;
  }

  // Returns all open ranks that the specified position is on
  private getOpenRanks(board: Board, col: number): number[] {
    const openRanks: number[] = [];
    for (let row = 0; row < 8; row++) {
      const piece = board.getTile(row + 8 * col).isOccupied();
      if (!piece) {
        openRanks.push(row);
      }
    }
    return openRanks;
  }

  // Evaluation function for kings
  private evaluateKing(
    board: Board,
    king: Piece,
    row: number,
    col: number
  ): number {
    let score = 100;

    // Decrease score for kings that are on the edges of the board
    if (row == 0 || row == 7 || col == 0 || col == 7) {
      score -= 20;
    }

    // Decrease score for kings that are in the middle of the board
    if (row == 3 || row == 4 || col == 3 || col == 4) {
      score -= 10;
    }

    // Check if the king is in check and decrease the score accordingly
    if (this.isKingInCheck(board, king)) {
      score -= 30;
    }

    return score;
  }

  isKingInCheck(board: Board, king: Piece): boolean {
    if (king.alliance.isBlack) {
      return board.blackPlayer.isInCheck();
    } else if (king.alliance.isWhite) {
      return board.whitePlayer.isInCheck();
    }
    return false;
  }
}

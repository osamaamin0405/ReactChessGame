export default abstract class BoardUtils {
  static isFirstColumn: boolean[] = BoardUtils.initColumns(0);
  static isSecondeColumn: boolean[] = BoardUtils.initColumns(1);
  static isSeventhColumn: boolean[] = BoardUtils.initColumns(6);
  static isEighthColumn: boolean[] = BoardUtils.initColumns(7);
  static TILES_CELLS: number = 64;
  static NUM_COLS: number = 8;
  private constructor() {
    throw new Error("BoardUtils cannot be instantiated", {});
  }

  // get Column boolean index
  public static initColumns(columnNumber: number): boolean[] {
    const columns: boolean[] = Array(64).fill(false);

    do {
      columns[columnNumber] = true;
      columnNumber += 8;
    } while (columnNumber < 64);

    return columns;
  }

  static isSameRow(
    piecePosition: number,
    distanceCandidateCoordinates: number
  ): boolean {
    // console.log(piecePosition, distanceCandidateCoordinates);
    piecePosition = Math.floor((piecePosition / 8) % 64);
    distanceCandidateCoordinates = Math.floor(
      (distanceCandidateCoordinates / 8) % 64
    );
    return piecePosition == distanceCandidateCoordinates;
  }

  public static isValidTileCoordinates(coordinates: number) {
    return 0 <= coordinates && coordinates < BoardUtils.TILES_CELLS;
  }
}

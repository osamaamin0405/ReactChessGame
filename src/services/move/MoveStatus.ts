abstract class MoveStatus {
  static readonly isDone = 0;
  static readonly IllegalMove = 1;
  static readonly LEAVES_PLAYER_IN_CHECk = 2;
  static readonly CHECK_MATE = 3;

  static getState(status: number) {
    switch (status) {
      case 0:
        return "Move Done";
      case 1:
        return "Illegal Move";
      case 2:
        return "Can't Lave Kin On Check";
      case 3:
        return "Game Over";
      case 4:
        return "Select Pawn Promotion";
    }
  }
}

export default MoveStatus;

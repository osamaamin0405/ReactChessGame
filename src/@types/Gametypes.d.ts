
type ThemeName =
  | "brown_shadow"
  | "brown_noShadow"
  | "gray_noShadow"
  | "gray_shadow"
  | "black_noShadow"
  | "black_shadow";

type PieceName = "b" | "n" | "p" | "q" | "r" | "k" | undefined;

type BoardPieceProps = {
  width: string;
  height: string;
  index: number;
};

type AvailableBoardColors = { [key: string]: BoardColor };

type BoardColor = {
  light: string;
  dark: string;
};

type NotationIndex = {
  x: string;
  y: string;
};

type PieceColor = "b" | "w" | undefined;

type ChessPiece = {
  type: PieceName;
  color: PieceColor;
};

type PieceProps = {
  value?: ChessPiece;
  image?: string | null;
  position: number;
  piece;
  onDragStart?: CallableFunction;
  onDragEnd?: CallableFunction;
};

type ChessBoard = (ChessPiece | null)[][];

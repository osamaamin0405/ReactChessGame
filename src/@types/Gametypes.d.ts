type BoardPiece = {
  value?: ChessPiece;
  pieceProps: BoardPieceProps;
  children: React.Children;
  movFunction: CallableFunction;
  onPromote?: CallableFunction;
};

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
  color: string;
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

interface Player {
  name: string;
  isAi: boolean;
  isWhite?: boolean;
}

type ChessGameProps = {
  theme?: string;
  isAi: boolean;
};

type ChessBoard = (ChessPiece | null)[][];

import { Knight, Pawn, Bishop, King, Queen, Rook } from "../piece";
import Piece from "../piece/Piece";
import BlackPlayer from "../player/BlackPlayer";
import Player from "../player/Player";
import WhitePlayer from "../player/WhitePlayer";
import Alliance, { Black, White } from "./Alliance";
import BoardUtils from "./BoardUtils";
import Builder from "./Builder";
import Move from "../move/Move";
import Tile from "./Tile";

export default class Board {
  private builder: Builder;
  private readonly gameBoard: Tile[];
  private readonly _enPassantPawn: Piece;
  private Alliances: { white: Alliance; black: Alliance };
  static Alliances: { white: Alliance; black: Alliance } = {
    white: new White(),
    black: new Black(),
  };
  private readonly _whitePieces: Piece[];
  private readonly _blackPieces: Piece[];
  private readonly _whitePlayer: Player;
  private readonly _blackPlayer: Player;
  private readonly _currPlayer: Player;
  private readonly _whiteLegalMoves: Move[];
  private readonly _blackLegalMoves: Move[];

  constructor(builder: Builder) {
    this.builder = builder;
    this.gameBoard = this.createGameBoard();
    this.Alliances = Board.Alliances;
    this._enPassantPawn = builder._enPassantPawn;
    console.log(this.enPassantPawn);
    this._whitePieces = this.getActivePieces(this.Alliances.white);
    this._blackPieces = this.getActivePieces(this.Alliances.black);
    this._whiteLegalMoves = this.getLegalMoves(this._whitePieces);
    this._blackLegalMoves = this.getLegalMoves(this._blackPieces);

    this._whitePlayer = new WhitePlayer(
      this,
      this._whiteLegalMoves,
      this._blackLegalMoves
    );
    this._blackPlayer = new BlackPlayer(
      this,
      this._blackLegalMoves,
      this._whiteLegalMoves
    );
    this._currPlayer = builder.moveMaker.chosePlayer(
      this.whitePlayer,
      this.blackPlayer
    );
  }

  public getLegalMoves(activePieces: Piece[]): Move[] {
    let legalMoves: Move[] = [];
    for (let piece of activePieces) {
      legalMoves.push(...piece.getLegalMoves(this));
    }
    return legalMoves;
  }

  public toString(): string {
    let gameBoard: string = "";
    for (let i = 0; i < BoardUtils.TILES_CELLS; i++) {
      gameBoard += `${this.gameBoard[i].getPiece()?.toString() || "_"}`;
      if ((i + 1) % BoardUtils.NUM_COLS == 0) gameBoard += "\n";
    }
    return gameBoard;
  }

  public get isGameOver(): boolean {
    return this.whitePlayer.isInCheckMate() || this.blackPlayer.isInCheckMate();
  }

  public get allActivePieces(): Piece[] {
    return this._whitePieces.concat(this._blackPieces);
  }

  private getActivePieces(alliance: Alliance): Piece[] {
    const activePieces: Piece[] = [];
    for (let tile of this.gameBoard) {
      const piece: Piece = tile.getPiece();
      if (tile.isOccupied() && piece.alliance.equals(alliance)) {
        activePieces.push(piece);
      }
    }
    return activePieces;
  }
  private createGameBoard(): Tile[] {
    const tiles: Tile[] = [];

    for (let i = 0; i < BoardUtils.TILES_CELLS; i++) {
      tiles.push(Tile.CreateTile(i, this.builder.boardConfig[i]));
    }

    return tiles;
  }

  static createStandardGame() {
    const builder: Builder = new Builder();
    // Black Team
    builder.setPiece(new Rook(0, Board.Alliances.black));
    builder.setPiece(new Knight(1, Board.Alliances.black));
    builder.setPiece(new Bishop(2, Board.Alliances.black));
    builder.setPiece(new Queen(3, Board.Alliances.black));
    builder.setPiece(new King(4, Board.Alliances.black));
    builder.setPiece(new Bishop(5, Board.Alliances.black));
    builder.setPiece(new Knight(6, Board.Alliances.black));
    builder.setPiece(new Rook(7, Board.Alliances.black));
    builder.setPiece(new Pawn(8, Board.Alliances.black));
    builder.setPiece(new Pawn(9, Board.Alliances.black));
    builder.setPiece(new Pawn(10, Board.Alliances.black));
    builder.setPiece(new Pawn(11, Board.Alliances.black));
    builder.setPiece(new Pawn(12, Board.Alliances.black));
    builder.setPiece(new Pawn(13, Board.Alliances.black));
    builder.setPiece(new Pawn(14, Board.Alliances.black));
    builder.setPiece(new Pawn(15, Board.Alliances.black));

    // White Team
    builder.setPiece(new Pawn(48, Board.Alliances.white));
    builder.setPiece(new Pawn(49, Board.Alliances.white));
    builder.setPiece(new Pawn(50, Board.Alliances.white));
    builder.setPiece(new Pawn(51, Board.Alliances.white));
    builder.setPiece(new Pawn(52, Board.Alliances.white));
    builder.setPiece(new Pawn(53, Board.Alliances.white));
    builder.setPiece(new Pawn(54, Board.Alliances.white));
    builder.setPiece(new Pawn(55, Board.Alliances.white));
    builder.setPiece(new Rook(56, Board.Alliances.white));
    builder.setPiece(new Knight(57, Board.Alliances.white));
    builder.setPiece(new Bishop(58, Board.Alliances.white));
    builder.setPiece(new Queen(59, Board.Alliances.white));
    builder.setPiece(new King(60, Board.Alliances.white));
    builder.setPiece(new Bishop(61, Board.Alliances.white));
    builder.setPiece(new Knight(62, Board.Alliances.white));
    builder.setPiece(new Rook(63, Board.Alliances.white));
    builder.setMoveMaker(Board.Alliances.white);
    return builder.build();
  }

  getTile(_candidateDistance: number): Tile {
    return this.gameBoard[_candidateDistance];
  }

  static isFenFormat(fen: string) {
    return fen.split(" ").length === 6;

  }

  static fenToBoard(fen: string): Board {
    // Split FEN string into separate components
    const fenParts: string[] = fen.split(" ");

    if (!Board.isFenFormat(fen)) throw new Error("Invalid Fen format ");

    // Extract board
    const boardFen: string = fenParts[0].split("/").join("");
    const activeColor: string = fenParts[1];
    const enPassantPawn: string = fenParts[3].split("").join("");
    const builder: Builder = new Builder();
    // Convert board FEN to 1D array
    let piecePos: number = 0;
    for (let i = 0; i < boardFen.length; i++) {
      const char: string = boardFen.charAt(i);
      if (isNaN(parseInt(char))) {
        //push pieces into builder array
        // console.log(builder.createPiece(char, i), char);
        const [col, row] = BoardUtils.XYPosition(piecePos),
          piece: Piece = builder.createPiece(char, piecePos),
            notionIndex = col + (row +1);
        console.log(notionIndex, enPassantPawn);
        if (notionIndex == enPassantPawn && piece.name.toUpperCase() == "P") builder.setEnPassantPawn(piece);
        builder.setPiece(piece);
        piecePos += 1;
      } else {
        piecePos += parseInt(char);
      }
      // console.log(piecePos);
    }
    builder.setMoveMaker(
      activeColor == "w" ? Board.Alliances.white : Board.Alliances.black
    );
    return builder.build();
  }

  getFenFormat():string{
    let fenFile:string = this.toString().split("\n").join("/"),
      castleString:string =  this.whitePlayer.getAvailableCastle() + this.blackPlayer.getAvailableCastle();
    fenFile = fenFile
      .replaceAll("________", "8")
      .replaceAll("_______", "7")
      .replaceAll("______", "6")
      .replaceAll("_____", "5")
      .replaceAll("____", "4")
      .replaceAll("___", "3")
      .replaceAll("__", "2")
      .replaceAll("_", "1");
    fenFile = fenFile.substring(0, fenFile.length-1);


    fenFile += this.currPlayer.getAlliance().isWhite ? " w " : " b ";
    fenFile += castleString == "" ? "-" : castleString;
    fenFile += this.enPassantPawn != null ?
            " " + BoardUtils.XYPosition(this.enPassantPawn.position + (8) * this.currPlayer.getAlliance().getDirection()).join("")
            : " -";
    fenFile += " 0 1";

    return fenFile;
  }

  public get currPlayer(): Player {
    return this._currPlayer;
  }

  public get getGameBoard(): Tile[] {
    return this.gameBoard;
  }

  public get getAllLegalMove(): Move[] {
    return this._whiteLegalMoves.concat(this._blackLegalMoves);
  }

  public get enPassantPawn(): Piece {
    return this._enPassantPawn;
  }

  public get whitePieces() {
    return this._whitePieces;
  }

  public get blackPieces() {
    return this._blackPieces;
  }

  public get blackPlayer(): Player {
    return this._blackPlayer;
  }

  public get whitePlayer(): Player {
    return this._whitePlayer;
  }
}

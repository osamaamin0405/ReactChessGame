import Move from "../move/Move";

export default class SearchController {
  private nodes: [];
  private fh: any;
  private fhf: any;
  private time: string;
  private start: boolean;
  private stop: boolean;
  private thinking: boolean;
  private best: Move;
  private depth: number;
  constructor() {}

  private searchPosition() {
    let bestMove,
      bestScore: number = -Infinity,
      currantDepth = 0;
    for (currantDepth = 1; currantDepth < this.depth; ++currantDepth) {
      if (this.stop == true) {
        break;
      }
    }
    this.thinking = false;
    this.best = bestMove;
  }
}

import {Board} from "./board/board";
import {RandomBoardGenerator} from "./board/generators/random_board_generator";

export class UnsupportedBoardGenerator extends Error {}

export interface IPuzzleGameSettings {
    boardHeight: number;
    boardWidth: number;
    boardGenerator: "random_board_generator";

    // If given, will be used instead of the above params
    initialBoardState?: Array<Array<number|null>>;
}

export const DEFAULT_GAME_SETTINGS: IPuzzleGameSettings = {
    boardHeight: 4,
    boardWidth: 4,
    boardGenerator: "random_board_generator",
};

export class PuzzleGame {

    public readonly board: Board;

    constructor(private readonly settings: IPuzzleGameSettings = DEFAULT_GAME_SETTINGS) {
        if (settings.initialBoardState) {
            this.board = new Board(settings.initialBoardState);
        } else {
            // More board generators can be created for different levels of game difficulty
            if (settings.boardGenerator != "random_board_generator") {
                throw new UnsupportedBoardGenerator();
            }

            this.board = new RandomBoardGenerator().generate(settings.boardHeight, settings.boardWidth);
        }
    }

}

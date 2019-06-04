import * as _ from "lodash";

import {Board} from "../game/board/board";
import {PuzzleGame} from "../game/puzzle_game";
import {ConsoleUIController} from "../io/output/console_ui_controller";
import {ITextualUIController} from "../io/output/textual_ui_controller";
import {GameState} from "../puzzle_game_controller";
import {IGameUIRenderer} from "./game_ui_renderer";

export class TextualGameUIRenderer implements IGameUIRenderer {

    constructor(private ui: ITextualUIController = new ConsoleUIController()) {}

    public renderBoard(board: Board) {
        const [horSep, verSep] = board.isSorted() ?
            ["*", "*"] : ["-", "|"];

        const maxDigits = (board.width * board.height - 1).toString().length;
        const tileWidth = maxDigits + 2;

        const printRuler = () => this.ui.println(
            horSep.repeat((tileWidth + 1) * board.width + 1),
        );

        const printRow = (x: number) => this.ui.println(
            verSep + _.range(board.width)
                .map((y) => board.tileAt(x, y))
                .map((tile) => tile.isBlank ? "" : tile.value.toString())
                .map((v) => " ".repeat(maxDigits - v.length) + v)
                .map((v) => " " + v + " ")
                .join(verSep)
            + verSep,
        );

        printRuler();
        _.range(board.height).forEach((x) => {
            printRow(x);
            printRuler();
        });
    }

    public render(state: GameState, game: PuzzleGame) {
        this.ui.clearScreen();
        this.renderBoard(game.board);
        this.ui.println();
        switch (state) {
            case GameState.OngoingGame:
                this.ui.println("Press the arrow keys to move the blank tile, or q to quit.");
                break;
            case GameState.Victory:
                this.ui.println("Victory! Play again? (y/n)");
                break;
            case GameState.Quit:
                this.ui.println("Goodbye!");
                break;
        }
        this.ui.flush();
    }

}

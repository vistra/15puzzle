import {DEFAULT_GAME_SETTINGS, IPuzzleGameSettings, PuzzleGame} from "./game/puzzle_game";
import {ConsoleInputReader} from "./io/input/console_input_reader";
import {IInputReader, InputKey} from "./io/input/input_reader";
import {IGameUIRenderer} from "./ui/game_ui_renderer";
import {TextualGameUIRenderer} from "./ui/textual_game_ui_renderer";
import {assertUnreachable} from "./utils";
import {Direction} from "./game/board/board";

export enum GameState {
    OngoingGame = "ongoing_game",
    Victory = "victory",
    Quit = "quit",
}

export class PuzzleGameController {

    private game: PuzzleGame;
    private state: GameState;
    private userQuit: boolean = false;

    private readonly inputHandlers: {
        [state in GameState]: Partial<{
            [input in InputKey]: () => void
        }>
    } = {
        [GameState.OngoingGame]: {
            [InputKey.Up]: () => { this.game.board.moveBlankTile(Direction.Up); },
            [InputKey.Down]: () => { this.game.board.moveBlankTile(Direction.Down); },
            [InputKey.Left]: () => { this.game.board.moveBlankTile(Direction.Left); },
            [InputKey.Right]: () => { this.game.board.moveBlankTile(Direction.Right); },
            [InputKey.Quit]: () => { this.userQuit = true; },
        },
        [GameState.Victory]: {
            [InputKey.Yes]: () => { this.newGame(); },
            [InputKey.No]: () => { this.userQuit = true; },
        },
        [GameState.Quit]: {},
    };

    constructor(
        private gameSettings: IPuzzleGameSettings = DEFAULT_GAME_SETTINGS,
        private inputReader: IInputReader = new ConsoleInputReader(),
        private uiRenderer: IGameUIRenderer = new TextualGameUIRenderer(),
    ) {}

    public getState(): GameState {
        return this.state;
    }

    public async run() {
        this.newGame();
        while (this.state != GameState.Quit) {
            this.renderUI();
            await this.handleInput();
            this.updateState();
        }
        this.renderUI(); // Render the 'quit' state

        this.inputReader.close();
    }

    private async handleInput() {
        const input: InputKey = await this.inputReader.readInputKey();
        const handler = this.inputHandlers[this.state][input];
        if (handler) {
            handler();
        }
    }

    private updateState() {
        if (this.userQuit) {
            this.state = GameState.Quit;
        }
        switch (this.state) {
            case GameState.OngoingGame:
                if (this.game.board.isSorted()) {
                    this.state = GameState.Victory;
                }
                break;
            case GameState.Victory:
                if (!this.game.board.isSorted()) {
                    this.state = GameState.OngoingGame;
                }
                break;
            case GameState.Quit:
                break;
            default:
                assertUnreachable(this.state);
        }
    }

    private renderUI() {
        this.uiRenderer.render(this.state, this.game);
    }

    private newGame() {
        this.game = new PuzzleGame(this.gameSettings);
        this.state = GameState.OngoingGame;
    }

}

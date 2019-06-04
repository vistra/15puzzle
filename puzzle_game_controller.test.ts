import { expect } from "chai";
import {ConsoleInputReader} from "./io/input/console_input_reader";
import {InMemoryTextualUIController} from "./io/output/in_memory_ui_controller";
import {GameState, PuzzleGameController} from "./puzzle_game_controller";
import {TextualGameUIRenderer} from "./ui/textual_game_ui_renderer";
import {sleep} from "./utils";

describe("Puzzle game controller tests", () => {
    const createEnv = (initialBoardState?: Array<Array<number|null>>): {
        inputReader: ConsoleInputReader,
        gc: PuzzleGameController,
    } => {
        const inputReader = new ConsoleInputReader(true);
        const gc = new PuzzleGameController(
            {
                boardHeight: 2,
                boardWidth: 2,
                boardGenerator: "random_board_generator",
                initialBoardState: initialBoardState || [
                    [1, 2],
                    [null, 3],
                ],
            },
            inputReader,
            new TextualGameUIRenderer(new InMemoryTextualUIController()),
        );
        return {
            inputReader,
            gc,
        };
    };

    it("should play a simple game", async () => {
        const { inputReader, gc } = createEnv();

        const runPromise = gc.run();
        await sleep(10);
        expect(gc.getState()).to.equal(GameState.OngoingGame);
        inputReader.triggerKeyPress("right");
        await sleep(10);
        expect(gc.getState()).to.equal(GameState.Victory);
        inputReader.triggerKeyPress("left");
        await sleep(10);
        expect(gc.getState()).to.equal(GameState.Victory);
        inputReader.triggerKeyPress("y");
        await sleep(10);
        expect(gc.getState()).to.equal(GameState.OngoingGame);
        inputReader.triggerKeyPress("right");
        await sleep(10);
        expect(gc.getState()).to.equal(GameState.Victory);
        inputReader.triggerKeyPress("n");
        await sleep(10);
        expect(gc.getState()).to.equal("quit");
        await runPromise;
    });

    it("should exit in the middle", async () => {
        const { inputReader, gc } = createEnv();
        const runPromise = gc.run();
        await sleep(10);
        expect(gc.getState()).to.equal(GameState.OngoingGame);
        inputReader.triggerKeyPress("q");
        await sleep(10);
        expect(gc.getState()).to.equal("quit");
        await runPromise;
    });

});

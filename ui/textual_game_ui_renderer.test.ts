import {expect} from "chai";
import {PuzzleGame} from "../game/puzzle_game";
import {InMemoryTextualUIController} from "../io/output/in_memory_ui_controller";
import {GameState} from "../puzzle_game_controller";
import {TextualGameUIRenderer} from "./textual_game_ui_renderer";
import {Direction} from "../game/board/board";

const buildEnv = (state: GameState = GameState.OngoingGame): {
    renderer: TextualGameUIRenderer,
    ui: InMemoryTextualUIController,
    game: PuzzleGame,
    state: GameState,
} => {
    const ui =  new InMemoryTextualUIController();
    return {
        ui,
        game: new PuzzleGame(),
        state,
        renderer: new TextualGameUIRenderer(ui),
    };
};

describe("TextualGameUIRenderer tests", () => {
   it("should display an ongoing game", () => {
        const { renderer, game, state, ui }  = buildEnv(GameState.OngoingGame);
        renderer.render(state, game);
        expect(ui.text.length).to.be.greaterThan(10);
        expect(ui.text).to.contain("Press the arrow keys");
   });
   it("should display a victory", () => {
        const { renderer, game, state, ui }  = buildEnv(GameState.Victory);
        renderer.render(state, game);
        expect(ui.text.length).to.be.greaterThan(10);
        expect(ui.text).to.contain("Play again?");
   });
   it("should display a goodbye message", () => {
        const { renderer, game, state, ui }  = buildEnv(GameState.Quit);
        renderer.render(state, game);
        expect(ui.text.length).to.be.greaterThan(10);
        expect(ui.text).to.contain("Goodbye!");
   });
   it("should change between renders", () => {
        const { renderer, game, state, ui }  = buildEnv(GameState.OngoingGame);
        renderer.render(state, game);
        const text1 = ui.text;
        game.board.moveBlankTile(Direction.Up);
        renderer.render(state, game);
        const text2 = ui.text;
        game.board.moveBlankTile(Direction.Down);
        renderer.render(state, game);
        const text3 = ui.text;
        expect(text1.length).to.equal(text2.length);
        expect(text2.length).to.equal(text3.length);
        expect(text1 != text2 || text1 != text3).to.be.true;
   });
});

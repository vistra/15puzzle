import {PuzzleGame} from "../game/puzzle_game";
import {GameState} from "../puzzle_game_controller";

export interface IGameUIRenderer {

    render(state: GameState, game: PuzzleGame);

}

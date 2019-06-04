import * as cli from "cli";
import {PuzzleGameController} from "./puzzle_game_controller";

const args: {
    width: number,
    height: number,
} = cli.parse({
    height: ["h", "Board height (at least 2)", "num", 4],
    width: ["w", "Board width (at least 2)", "num", 4],
});

if (args.width < 2 || args.height < 2) {
    console.error("Invalid board dimensions: both height and width must be at least 2.");
    process.exit(1);
}

const gameController = new PuzzleGameController({
    boardHeight: args.height,
    boardWidth: args.width,
    boardGenerator: "random_board_generator",
});
gameController.run()
    .then(
        () => process.exit(0),
        (e) => {
            console.error(e);
            process.exit(1);
        },
    );

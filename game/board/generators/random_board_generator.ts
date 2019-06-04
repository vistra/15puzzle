import {Board, Direction} from "../board";
import {IBoardGenerator} from "../board_generator";

import * as assert from "assert";
import * as _ from "lodash";
import {assertUnreachable} from "../../../utils";

export class InvalidDimensionsError extends Error {}

function inversions(l: number[]): number {
    let p = 0;
    for (let i = 0; i < l.length; i++) {
        for (let j = i + 1; j < l.length; j++) {
            if (l[i] > l[j]) {
                p++;
            }
        }
    }
    return p;
}

function randomTransposition(l: number[]): number[] {
    const ij = _.shuffle(_.range(l.length)).slice(0, 2);
    return l.map(
        (v, ind) =>
            ind == ij[0] ? l[ij[1]]
            : ind == ij[1] ? l[ij[0]]
            : v,
    );
}

export class RandomBoardGenerator implements IBoardGenerator {

    public generate(height: number, width: number): Board {
        // In each attempt, we draw a sortable board.
        // The reason for multiple attempts is for the slim
        // chance of drawing the sorted board.
        for (let attempt = 0; attempt < 100; attempt++) {
            if (!_.every([height, width].map((x) => Number.isInteger(x) && x >= 2))) {
                throw new InvalidDimensionsError();
            }

            // Draw an even permutation of the numbers
            const numbers = _.range(1, height * width);
            const permutation = _.shuffle(numbers);
            const evenPermutation = inversions(permutation) % 2 == 0 ? permutation : randomTransposition(permutation);
            assert(inversions(evenPermutation) % 2 == 0);

            // Add the blank tile and build the board
            const items = evenPermutation.concat([null]);
            const initialBoardState = _.chunk(items, width);
            const board = new Board(initialBoardState);

            // The blank is located at the bottom-right corner,
            // move the blank to a random position
            _.times(_.random(board.height), () => board.moveBlankTile(Direction.Up));
            _.times(_.random(board.width), () => board.moveBlankTile(Direction.Left));

            if (!board.isSorted()) {
                return board;
            }
        }

        // Should practically never happen.
        assertUnreachable("100 attempts were not enough to draw an unsorted board");
    }

}

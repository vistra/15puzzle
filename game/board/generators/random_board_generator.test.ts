import {expect} from "chai";

import * as _ from "lodash";
import {InvalidDimensionsError, RandomBoardGenerator} from "./random_board_generator";

describe("Random Board Generator tests", () => {

    it("should throw when given invalid dimensions", () => {
        expect(() => new RandomBoardGenerator().generate(0, 0)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(-1, 1)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(1, -1)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(1.5, 1)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(1, 1.5)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(1, 1)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(1, 0)).to.throw(InvalidDimensionsError);
        expect(() => new RandomBoardGenerator().generate(0, 1)).to.throw(InvalidDimensionsError);
    });

    it("should create a board with the appropriate dimensions", () => {
        const board = new RandomBoardGenerator().generate(10, 20);
        expect(board.height).to.equal(10);
        expect(board.width).to.equal(20);
    });

    it("should most probably return two different boards", () => {
        const gen = new RandomBoardGenerator();
        const DIM = 100;
        const board1 = gen.generate(DIM, DIM);
        const board2 = gen.generate(DIM, DIM);

        expect(_.zip(
            _.range(DIM),
            _.range(DIM),
        ).map(
            (xy) => board1.tileAt(xy[0], xy[1]).isEqual(board2.tileAt(xy[0], xy[1])),
        ).filter((eq) => !eq).length == 0);

    });

    it("should generate sortable and unsorted boards", () => {
        const gen = new RandomBoardGenerator();
        _.times(100, () => {
            const board = gen.generate(2, 2);
            expect(board.isSortable()).to.be.true;
            expect(board.isSorted()).to.be.false;
        });
    });
});

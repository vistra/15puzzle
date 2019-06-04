import {expect} from "chai";
import {concat} from "../../utils";
import {Board, Direction, InvalidBoardError, OutOfBoundsError} from "./board";
import {Tile} from "./tile";

describe("Board Tests", () => {

    const tilesEq = (c1, c2) => c1.isBlank ? c2.isBlank : c1.value == c2.value;

    const isBoardInState = (board: Board, state: Array<Array<number|null>>) =>
        concat(
            state.map((row, i) =>
                row.map(
                    (val, j) => tilesEq(board.tileAt(i, j), new Tile(val)),
                ),
            ),
        ).filter( (x) => !x).length == 0;

    const VALID_BOARD_INIT = [
        [2, 3, 5],
        [1, 4, null],
    ];

    it("should initialize successfully", () => {
        expect(() => new Board(VALID_BOARD_INIT)).to.not.throw();
    });

    it("should throw invalid board exception (empty board)", () => {
        expect(() => new Board(
            [],
        )).to.throw(InvalidBoardError);

        expect(() => new Board(
            [[]],
        )).to.throw(InvalidBoardError);

        expect(() => new Board(
            [[], []],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (one dimensional board)", () => {
        expect(() => new Board(
            [[1, 2]],
        )).to.throw(InvalidBoardError);

        expect(() => new Board(
            [[1], [2]],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (invalid values)", () => {
        expect(() => new Board(
            [
                [-2, 3, 6],
                [1, 4, null],
            ],
        )).to.throw(InvalidBoardError);
        expect(() => new Board(
            [
                [2, 3, 5.5],
                [1, 4, null],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (numbers not consecutive)", () => {
        expect(() => new Board(
            [
                [2, 3, 6],
                [1, 4, null],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (numbers dont start at 1)", () => {
        expect(() => new Board(
            [
                [2, 3, 6],
                [5, 4, null],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (repeating number)", () => {
        expect(() => new Board(
            [
                [2, 3, 5],
                [1, 2, null],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (dimensions mismatch)", () => {
        expect(() => new Board(
            [
                [2, 3, 5],
                [1, 2],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (no blank)", () => {
        expect(() => new Board(
            [
                [2, 3, 5],
                [1, 4, 6],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should throw invalid board exception (more than one blank)", () => {
        expect(() => new Board(
            [
                [2, 3, null],
                [1, 4, null],
            ],
        )).to.throw(InvalidBoardError);
    });

    it("should properly calculate board dimensions", () => {
        const board = new Board(VALID_BOARD_INIT);
        expect(board.width).to.equal(VALID_BOARD_INIT[0].length);
        expect(board.height).to.equal(VALID_BOARD_INIT.length);
    });

    it("Should get tile at location", () => {
        const board = new Board(VALID_BOARD_INIT);
        VALID_BOARD_INIT.forEach((row, i) => {
            row.forEach((c, j) => {
                expect(
                    tilesEq(board.tileAt(i, j), new Tile(c)),
                ).to.be.true;
            });
        });
    });

    it("Should throw when out of bounds", () => {
        const board = new Board(VALID_BOARD_INIT);
        expect(() => board.tileAt(-1, 0)).to.throw(OutOfBoundsError);
        expect(() => board.tileAt(0, -1)).to.throw(OutOfBoundsError);
        expect(() => board.tileAt(0, VALID_BOARD_INIT[0].length)).to.throw(OutOfBoundsError);
        expect(() => board.tileAt(VALID_BOARD_INIT.length, 0)).to.throw(OutOfBoundsError);
    });

    it("Should properly move the blank in each direction", () => {
        const BOARD1 = [
            [2, 3],
            [1, null],
        ];

        const BOARD2 = [
            [2, 3],
            [null, 1],
        ];

        const BOARD3 = [
            [null, 3],
            [2, 1],
        ];

        const BOARD4 = [
            [3, null],
            [2, 1],
        ];

        const board = new Board(BOARD1);
        expect(isBoardInState(board, BOARD1)).to.be.true;
        board.moveBlankTile(Direction.Down);
        expect(isBoardInState(board, BOARD1)).to.be.true;
        board.moveBlankTile(Direction.Left);
        expect(isBoardInState(board, BOARD2)).to.be.true;
        board.moveBlankTile(Direction.Left);
        expect(isBoardInState(board, BOARD2)).to.be.true;
        board.moveBlankTile(Direction.Up);
        expect(isBoardInState(board, BOARD3)).to.be.true;
        board.moveBlankTile(Direction.Up);
        expect(isBoardInState(board, BOARD3)).to.be.true;
        board.moveBlankTile(Direction.Right);
        expect(isBoardInState(board, BOARD4)).to.be.true;
        board.moveBlankTile(Direction.Right);
        expect(isBoardInState(board, BOARD4)).to.be.true;
    });

    it("Should detect that the board is sorted", () => {
        expect(new Board([
            [1, 2, 3],
            [4, 5, null],
        ]).isSorted()).to.be.true;
        expect(new Board([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, null],
        ]).isSorted()).to.be.true;
        expect(new Board([
            [1, 2],
            [3, null],
        ]).isSorted()).to.be.true;
    });

    it("Should detect that the board is unsorted", () => {
        expect(new Board([
            [1, 2, 3],
            [4, null, 5],
        ]).isSorted()).to.be.false;
        expect(new Board([
            [null, 1, 2],
            [3, 4, 5],
        ]).isSorted()).to.be.false;
        expect(new Board([
            [1, 2, 3],
            [null, 4, 5],
        ]).isSorted()).to.be.false;
    });

    it("Should detect that the board is sorted (or unsorted) after movement", () => {
        const board = new Board([
            [1, 2, 3],
            [4, null, 5],
        ]);
        expect(board.isSorted()).to.be.false;
        board.moveBlankTile(Direction.Right);
        expect(board.isSorted()).to.be.true;
        board.moveBlankTile(Direction.Left);
        expect(board.isSorted()).to.be.false;
    });

    it("Should detect that a board is sortable", () => {
        expect(new Board([
            [1, 2, 3],
            [4, null, 5],
        ]).isSortable()).to.be.true;
        expect(new Board([
            [1, null],
            [3, 2],
        ]).isSortable()).to.be.true;
        expect(new Board([
            [null, 1],
            [3, 2],
        ]).isSortable()).to.be.true;
        expect(new Board([
            [1, 2],
            [3, null],
        ]).isSortable()).to.be.true;
        expect(new Board([
            [2, 1, 3, 4],
            [12, 6, 8, 7],
            [9, 10, 11, 5],
            [13, 15, 14, null],
        ]).isSortable()).to.be.true;
    });

    it("Should detect that a board is not sortable", () => {
        expect(new Board([
            [2, 1],
            [3, null],
        ]).isSortable()).to.be.false;
        expect(new Board([
            [3, 2],
            [1, null],
        ]).isSortable()).to.be.false;
        expect(new Board([
            [2, 1, 3, 4],
            [5, 6, 8, 7],
            [9, 10, 11, 12],
            [13, 15, 14, null],
        ]).isSortable()).to.be.false;
    });

});

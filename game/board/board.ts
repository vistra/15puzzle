import * as _ from "lodash";
import {assertUnreachable, concat} from "../../utils";
import {Tile} from "./tile";

export class InvalidBoardError extends Error {}
export class OutOfBoundsError extends Error {}

export enum Direction {
    Left = "left",
    Right = "right",
    Up = "up",
    Down = "down",
}

const DIRECTION_XY_OFFSET: {[s in Direction]: [number, number]} = {
    [Direction.Left]: [0, -1],
    [Direction.Right]: [0, 1],
    [Direction.Up]: [-1, 0],
    [Direction.Down]: [1, 0],
};

interface ITilePosition {
    x: number;
    y: number;
}

export class Board {

    get width(): number {
        return this.state[0].length;
    }

    get height(): number {
        return this.state.length;
    }

    private state: Tile[][];

    constructor(initState: Array<Array<number|null>>) {
        this.state = initState.map(
            (row) => row.map((v) => new Tile(v)),
        );
        this.validateState();
    }

    public tileAt(x: number, y: number): Tile {
        if (x < 0 || y < 0 || x >= this.height || y >= this.width) {
            throw new OutOfBoundsError();
        }

        return this.state[x][y];
    }

    public moveBlankTile(dir: Direction) {
        const {x, y} = this.getBlankTilePosition();
        const xyOffset = DIRECTION_XY_OFFSET[dir];

        const otherTileX = Math.max(0, Math.min(this.height - 1, x + xyOffset[0]));
        const otherTileY = Math.max(0, Math.min(this.width - 1, y + xyOffset[1]));

        const c = this.tileAt(x, y);
        const otherC = this.tileAt(otherTileX, otherTileY);

        this.state[x][y] = otherC;
        this.state[otherTileX][otherTileY] = c;
    }

    public isSorted(): boolean {
        const flattenedValues: Array<number|null> = concat(this.state)
            .map((tile) => tile.isBlank ? null : tile.value);

        const n = flattenedValues.filter((x) => x != null).length;

        return _.isEqual(flattenedValues.slice(0, n), _.range(1, n + 1));
    }

    public isSortable(): boolean {
        const blankPos = this.getBlankTilePosition();
        const blankDistance = this.height - blankPos.x - 1 + this.width - blankPos.y - 1;

        const flatPosToXY = (pos) => [
            Math.floor(pos / this.width),
            pos % this.width,
        ];
        const tileValRep = (tile) => tile.isBlank ? this.height * this.width : tile.value;

        let inversions = 0;
        for (let flatPos1 = 0; flatPos1 < this.height * this.width; flatPos1++) {
            const xy1 = flatPosToXY(flatPos1);
            const tile1 = this.tileAt(xy1[0], xy1[1]);
            const val1 = tileValRep(tile1);
            for (let flatPos2 = flatPos1 + 1; flatPos2 < this.height * this.width; flatPos2++) {
                const xy2 = flatPosToXY(flatPos2);
                const tile2 = this.tileAt(xy2[0], xy2[1]);
                const val2 = tileValRep(tile2);

                if (val1 > val2) {
                    inversions++;
                }
            }
        }

        return (inversions % 2) == (blankDistance % 2);
    }

    private validateState() {
        const valuesSorted = Array.prototype.concat.apply([], this.state)
            .filter((x: Tile) => !x.isBlank)
            .map((x: Tile) => x.value)
            .sort((a, b) => a - b);

        if (
            this.state.length < 2 ||
            this.state[0].length < 2
        ) {
            throw new InvalidBoardError("A board must be two dimensional (height, width > 1)");
        }

        if (this.state.find((r) => r.length != this.state[0].length)) {
            throw new InvalidBoardError("Inconsistent board dimensions");
        }

        if (valuesSorted.filter((x) => !(Number.isInteger(x) && x > 0)).length) {
            throw new InvalidBoardError("Not all positive integers");
        }

        if (valuesSorted.length != (this.height * this.width - 1)) {
            throw new InvalidBoardError("More or less than 1 blank");
        }

        if (valuesSorted[0] != 1) {
            throw new InvalidBoardError("Not starting at 1");
        }

        if (_.uniq(valuesSorted).length != valuesSorted.length ||
            valuesSorted[valuesSorted.length - 1] != (this.height * this.width - 1)) {
            throw new InvalidBoardError("Not consecutive");
        }
    }

    private getBlankTilePosition(): ITilePosition {
        for (const x of _.range(this.height)) {
            for (const y of _.range(this.width)) {
                if (this.state[x][y].isBlank) {
                    return {
                        x,
                        y,
                    };
                }
            }
        }

        assertUnreachable("No blank tile");
    }

}

export class ValueRequestedForBlankTileError extends Error {}

export class Tile {
    constructor(
        private _value: number | null,
    ) {}

    get isBlank(): boolean {
        return this._value == null;
    }

    get value(): number {
        if (this.isBlank) {
            throw new ValueRequestedForBlankTileError();
        }
        return this._value;
    }

    public isEqual(otherTile: Tile): boolean {
        return this.isBlank && otherTile.isBlank ||
            (!this.isBlank && !otherTile.isBlank  && this.value == otherTile.value);
    }
}

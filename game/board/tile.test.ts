import { expect } from "chai";
import {Tile, ValueRequestedForBlankTileError} from "./tile";

describe("Board Tile Tests", () => {
    const value = 1;

    it("should fail to return value", () => {
        expect(() => new Tile(null).value).to.throw(ValueRequestedForBlankTileError);
    });

    it("should be blank", () => {
        expect(new Tile(null).isBlank).to.be.true;
    });

    it("should succeed in returning value", () => {
        expect(new Tile(value).value).to.equal(value);
    });

    it("should not be blank", () => {
        expect(new Tile(value).isBlank).to.be.false;
    });

    it("should be equal", () => {
        expect(new Tile(value).isEqual(new Tile(value))).to.be.true;
        expect(new Tile(null).isEqual(new Tile(null))).to.be.true;
    });

    it("should not be equal", () => {
        expect(new Tile(value).isEqual(new Tile(null))).to.be.false;
        expect(new Tile(null).isEqual(new Tile(value))).to.be.false;
    });

});

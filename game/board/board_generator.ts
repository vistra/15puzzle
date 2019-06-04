import {Board} from "./board";

export interface IBoardGenerator {
    generate(height: number, width: number): Board;
}

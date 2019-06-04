import {ITextualUIController} from "./textual_ui_controller";

export class InMemoryTextualUIController implements ITextualUIController {
    private _text: string;

    constructor() {
        this.clearScreen();
    }

    get text(): string {
        return this._text;
    }

    public clearScreen() {
        this._text = "";
    }

    public println(s: string = "") {
        this._text += s + "\n";
    }

    public flush() {
        return;
    }
}

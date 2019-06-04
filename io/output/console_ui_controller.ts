import {ITextualUIController} from "./textual_ui_controller";
const clear = require("clear");

export class ConsoleUIController implements ITextualUIController {

    private buffer: string = "";

    public clearScreen() {
        clear();
        this.clearBuffer();
    }

    public println(s: string = "") {
        this.buffer += s + "\n";
    }

    public flush() {
        process.stdout.write(this.buffer);
        this.clearBuffer();
    }

    private clearBuffer() {
        this.buffer = "";
    }

}

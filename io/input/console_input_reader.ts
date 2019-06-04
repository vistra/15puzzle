import {InputKey, IInputReader} from "./input_reader";
const keypress = require("keypress");
import {EventEmitter} from "events";
import * as tty from "tty";

const INPUT_KEY_EVENT = "key_hit_event";

const keyMap: {[name: string]: InputKey} = {
    up: InputKey.Up,
    down: InputKey.Down,
    left: InputKey.Left,
    right: InputKey.Right,
    q: InputKey.Quit,
    y: InputKey.Yes,
    n: InputKey.No,
};

export class ConsoleInputReader implements IInputReader {

    private ee: EventEmitter = new EventEmitter();
    private started = false;

    constructor(private simulationMode: boolean = false) {}

    public start() {
        if (!this.simulationMode && !this.started) {
            // make `process.stdin` begin emitting "keypress" events
            keypress(process.stdin);

            // listen for the "keypress" event
            process.stdin.on("keypress", this.keyPressCallback);

            if (typeof process.stdin.setRawMode == "function") {
                process.stdin.setRawMode(true);
            } else {
                (tty as any).setRawMode(true);
            }
            // process.stdin.resume();
        }
        this.started = true;
    }

    public close() {
        if (!this.simulationMode) {
            process.stdin.off("keypress", this.keyPressCallback);
            if (typeof process.stdin.setRawMode == "function") {
                process.stdin.setRawMode(false);
            } else {
                (tty as any).setRawMode(false);
            }
        }
    }

    public async readInputKey(): Promise<InputKey> {
        if (!this.started) {
            this.start();
        }
        return new Promise((resolve) => {
            this.ee.once(INPUT_KEY_EVENT, (key: InputKey) => {
                resolve(key);
            });
        });
    }

    public triggerKeyPress(keyName: string) {
        const key = keyMap[keyName];
        if (key != null) {
            this.triggerInputKeyPress(key);
        }
    }

    public triggerInputKeyPress(key: InputKey) {
        this.emit(key);
    }

    private keyPressCallback = (ch, key) => {
        if (key) {
            if (key.ctrl && key.name == "c") {
                process.stdin.pause();
            } else {
                this.triggerKeyPress(key.name);
            }
        }
    };

    private emit(key: InputKey) {
        this.ee.emit(INPUT_KEY_EVENT, key);
    }

}

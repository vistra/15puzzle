export enum InputKey {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
    Quit = "quit",
    Yes = "yes",
    No = "no",
}

export const InputKeys: InputKey[] = [
    InputKey.Down, InputKey.Left, InputKey.No, InputKey.Quit, InputKey.Right, InputKey.Up, InputKey.Yes,
];

export interface IInputReader {

    readInputKey(): Promise<InputKey>;
    close();

}

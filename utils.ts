import * as assert from "assert";

export function concat<T = any>(arrs: T[][]) {
    return Array.prototype.concat.apply([], arrs);
}

export function assertUnreachable(x: any): never {
    assert(false, "Unreachable code executed: " +  x);
    throw new Error("unreachable"); // To satisfy TypeScript, which is not aware of the assertion
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

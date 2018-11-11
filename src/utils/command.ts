import { exec } from 'child_process';
import * as util from 'util';

// std is Unix I/O streams
export type stdType = {
    stdout: string;
    stderr: string;
};

export abstract class Command {
    public static async execute(cmd: string): Promise<string> {
        const execPromise = util.promisify(exec);
        const std: stdType = await execPromise(cmd);

        return std.stdout;
    }
}

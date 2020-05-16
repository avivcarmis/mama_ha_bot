import {readFileSync} from 'fs';
import {resolve} from 'path';

const TUVIA = 'טוביה';

export function readFromFile(path: string, replacements: {[key: string]: string} = {}): string[] {
    const file = resolve('assets', path + '.txt');
    const result = readFileSync(file).toString().split('\n').map(s => s.trim()).filter(s => s);
    for (let i = 0; i < result.length; i++) {
        for (const key of Object.keys(replacements)) {
            const value = replacements[key];
            while (result[i].indexOf(key) > -1) {
                result[i] = result[i].replace(key, value);
            }
        }
    }
    return result;
}

export function readFromFileWithTuvia(path: string, name: string): string[] {
    return readFromFile(path, {[TUVIA]: name});
}

export function responseText(options: string[]): string {
    const index = Math.floor(Math.random() * options.length);
    return options[index];
}

import {readFile} from 'fs';
import {resolve} from 'path';
import {Member} from "./members";

const TUVIA = 'טוביה';

export async function readFromFile(path: string): Promise<string[]> {
    const file = resolve('assets', path + '.txt');
    const buffer = await readFilePromise(file);
    return buffer.toString().split('\n').map(s => s.trim()).filter(s => s);
}

export async function readFromFileWithTuvia(path: string, member: Member): Promise<string[]> {
    const options = await readFromFile(`${path}_@${member.gender}`);
    const result = [];
    for (const option of options) {
        for (const name of member.names) {
            const value = replaceAll(option, TUVIA, name);
            result.push(value);
        }
    }
    return result;
}

export function responseText(options: string[]): string {
    const index = Math.floor(Math.random() * options.length);
    return options[index];
}

function readFilePromise(path: string): Promise<Buffer> {
    return new Promise((resolve,  reject) => {
        readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function replaceAll(v: string, toReplace: string, replaceWith: string): string {
    let result = v;
    while (result.indexOf(toReplace) > -1) {
        result = result.replace(toReplace, replaceWith);
    }
    return result
}

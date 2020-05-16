import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {extractName} from "./members";

const KEYWORD = 'תיפול על';
const MIN_TOTAL = 5;
const MAX_TOTAL = 7;
const MIN_WAIT = 1000 * 3;
const MAX_WAIT = 1000 * 10;

export function roastHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    if (value?.indexOf(KEYWORD) != 0) {
        return false;
    }
    const username = extractName(value.substr(KEYWORD.length));
    if (!username) {
        return false;
    }
    roast(bot, msg, username);
    return true;
}

async function roast(bot: TelegramBot, msg: TelegramBot.Message, name: string) {
    const roasts = readFromFileWithTuvia('roast', name);
    const total = randomInt(MIN_TOTAL, MAX_TOTAL);
    for (let i = 0; i < total; i++) {
        await singleRoast(bot, msg, roasts);
    }
}

async function singleRoast(bot: TelegramBot, msg: TelegramBot.Message, roasts: string[]) {
    bot.sendMessage(msg.chat.id, responseText(roasts));
    const wait = randomInt(MIN_WAIT, MAX_WAIT);
    await new Promise(resolve => {
        setTimeout(() => resolve(), wait);
    });
}

function randomInt(min: number, max: number): number {
    return min + (Math.random() * (max - min));
}

import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {extractName, extractUsername} from "./members";

const KEYWORD = 'תאנוס את';
const DURATION = 1000 * 60 * 5;

export function rapeHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    if (value?.indexOf(KEYWORD) != 0) {
        return false;
    }
    const restOfMessage = value.substr(KEYWORD.length);
    const username = extractUsername(restOfMessage);
    const name = extractName(restOfMessage);
    if (!name) {
        return false;
    }
    rape(bot, username, name);
    return true;
}

function rape(bot: TelegramBot, username: string, name: string) {
    const end = Date.now() + DURATION;
    const responses = readFromFileWithTuvia('rape', name);
    bot.on('message', msg => {
        if (Date.now() >= end) {
            return;
        }
        if (msg.from?.username === username) {
            bot.sendMessage(msg.chat.id, responseText(responses));
        }
    });
}

import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {extractMember, extractUsername, Member} from "./members";

const KEYWORD = 'תאנוס את';
const DURATION = 1000 * 60 * 5;

export function rapeHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    if (value?.indexOf(KEYWORD) != 0) {
        return false;
    }
    const restOfMessage = value.substr(KEYWORD.length);
    const username = extractUsername(restOfMessage);
    if (!username) {
        return false;
    }
    const member = extractMember(restOfMessage);
    rape(bot, username, member);
    return true;
}

async function rape(bot: TelegramBot, username: string, member: Member) {
    const end = Date.now() + DURATION;
    const responses = await readFromFileWithTuvia('rape', member);
    bot.on('message', msg => {
        if (Date.now() >= end) {
            return;
        }
        if (msg.from?.username === username) {
            bot.sendMessage(msg.chat.id, responseText(responses));
        }
    });
}

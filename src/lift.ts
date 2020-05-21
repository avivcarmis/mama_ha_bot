import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {extractMember, getMe, Member} from "./members";

const KEYWORD = 'תרים ל';
const SELF_KEYWORD = 'תרים לי';

export function liftHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    if (value?.indexOf(SELF_KEYWORD) == 0) {
        const member = getMe(msg);
        lift(bot, msg, member);
        return true;

    }
    if (value?.indexOf(KEYWORD) == 0) {
        const member = extractMember(value.substr(KEYWORD.length));
        if (!member) {
            return false;
        }
        lift(bot, msg, member);
        return true;

    }
    return false;
}

async function lift(bot: TelegramBot, msg: TelegramBot.Message, member: Member) {
    const roasts = await readFromFileWithTuvia('up', member);
    bot.sendMessage(msg.chat.id, responseText(roasts));
}

import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {extractMember, getMe, Member} from "./members";

const KEYWORD = 'תיפול על';
const SELF_KEYWORD = 'תיפול עלי';

export function roastHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    if (value?.indexOf(SELF_KEYWORD) == 0) {
        const member = getMe(msg);
        roast(bot, msg, member);
        return true;

    }
    if (value?.indexOf(KEYWORD) == 0) {
        const member = extractMember(value.substr(KEYWORD.length));
        if (!member) {
            return false;
        }
        roast(bot, msg, member);
        return true;

    }
    return false;
}

async function roast(bot: TelegramBot, msg: TelegramBot.Message, member: Member) {
    const roasts = await readFromFileWithTuvia('roast', member);
    bot.sendMessage(msg.chat.id, responseText(roasts));
}

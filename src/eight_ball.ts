import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {getMe, Member} from "./members";

const KEYWORD = 'לדעתך';

export function eightBallHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    if (value?.indexOf(KEYWORD) == 0) {
        eightBall(bot, msg, getMe(msg));
        return true;

    }
    return false;
}

async function eightBall(bot: TelegramBot, msg: TelegramBot.Message, sender: Member) {
    const replies = await readFromFileWithTuvia('eight_ball', sender);
    bot.sendMessage(msg.chat.id, responseText(replies));
}

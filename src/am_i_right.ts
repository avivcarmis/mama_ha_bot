import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {getMe, Member} from "./members";

const KEYWORDS = [
    '?',
    '?!'
];

export function genericQuestionHandler(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim();
    for (const keyword of KEYWORDS) {
        if (value?.endsWith(keyword)) {
            genericQuestion(bot, msg, getMe(msg));
            return true;
        }
    }
    return false;
}

async function genericQuestion(bot: TelegramBot, msg: TelegramBot.Message, sender: Member) {
    const replies = await readFromFileWithTuvia('generic_question', sender);
    bot.sendMessage(msg.chat.id, responseText(replies), {reply_to_message_id: msg.message_id});
}

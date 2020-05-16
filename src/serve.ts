import * as TelegramBot from "node-telegram-bot-api";
import {readFromFile, readFromFileWithTuvia, responseText} from "./text";
import {rapeHandler} from "./rape";
import {roastHandler} from "./roast";
import {extractName} from "./members";

type Handler = (bot: TelegramBot, msg: TelegramBot.Message)=> boolean;

const KEYWORD = 'בוט';

const handlers: Array<Handler> = [
    rapeHandler,
    roastHandler
];

const pending = new Set<number>();

export function serve(bot: TelegramBot) {
    const noHandlerReplies = readFromFile('no_handler_reply');
    bot.on('message', msg => {
        if (!msg.from?.id) {
            return;
        }
        if (isCall(msg)) {
            pending.add(msg.from?.id);
            const username = extractName(msg.from?.username || '');
            const replies = readFromFileWithTuvia('reply', username);
            bot.sendMessage(msg.chat.id, responseText(replies));
        } else if (pending.has(msg.from?.id)) {
            pending.delete(msg.from?.id);
            let handled = false;
            for (const handler of handlers) {
                if (handler(bot, msg)) {
                    handled = true;
                }
            }
            if (!handled) {
                bot.sendMessage(msg.chat.id, responseText(noHandlerReplies));
            }
        }
    });
}

function isCall(msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim().split(' ');
    return value?.length === 1 && value[0].indexOf(KEYWORD) > -1;
}

import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {rapeHandler} from "./rape";
import {roastHandler} from "./roast";
import {extractMember} from "./members";

type Handler = (bot: TelegramBot, msg: TelegramBot.Message)=> boolean;

const KEYWORD = 'בוט';

const handlers: Array<Handler> = [
    rapeHandler,
    roastHandler
];

const pending = new Set<number>();

export async function serve(bot: TelegramBot) {
    bot.on('message', async msg => {
        if (!msg.from?.id) {
            return;
        }
        if (isCall(msg)) {
            pending.add(msg.from?.id);
            const member = extractMember(msg.from?.username || '');
            const replies = await readFromFileWithTuvia('reply', member);
            await bot.sendMessage(msg.chat.id, responseText(replies));
        } else if (pending.has(msg.from?.id)) {
            pending.delete(msg.from?.id);
            let handled = false;
            for (const handler of handlers) {
                if (handler(bot, msg)) {
                    handled = true;
                }
            }
            if (!handled) {
                const member = extractMember(msg.from?.username || '');
                const noHandlerReplies = await readFromFileWithTuvia('no_handler_reply', member);
                await bot.sendMessage(msg.chat.id, responseText(noHandlerReplies));
            }
        }
    });
}

function isCall(msg: TelegramBot.Message): boolean {
    const value = msg.text?.trim().split(' ');
    return value?.length === 1 && value[0].indexOf(KEYWORD) > -1;
}

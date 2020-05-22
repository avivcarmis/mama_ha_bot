import * as TelegramBot from "node-telegram-bot-api";
import {readFromFileWithTuvia, responseText} from "./text";
import {rapeHandler} from "./rape";
import {roastHandler} from "./roast";
import {extractMember} from "./members";
import {liftHandler} from "./lift";
import {eightBallHandler} from "./eight_ball";
import {genericQuestionHandler} from "./am_i_right";

type Handler = (bot: TelegramBot, msg: TelegramBot.Message)=> boolean;

const KEYWORD = 'בוט';

const handlers: Array<Handler> = [
    rapeHandler,
    roastHandler,
    liftHandler,
    eightBallHandler,
    genericQuestionHandler
];

const pending = new Set<number>();

export async function serve(bot: TelegramBot) {
    bot.on('message', async msg => {
        if (!msg.from?.id) {
            return;
        }
        const rest = isCall(msg);
        if (rest !== null) {
            msg.text = rest;
            const handled = tryToServe(bot, msg);
            if (!handled) {
                pending.add(msg.from?.id);
                const member = extractMember(msg.from?.username || '');
                const replies = await readFromFileWithTuvia('reply', member);
                await bot.sendMessage(msg.chat.id, responseText(replies), {reply_to_message_id: msg.message_id});
            }
        } else if (pending.has(msg.from?.id)) {
            pending.delete(msg.from?.id);
            const handled = tryToServe(bot, msg);
            if (!handled) {
                const member = extractMember(msg.from?.username || '');
                const noHandlerReplies = await readFromFileWithTuvia('no_handler_reply', member);
                await bot.sendMessage(msg.chat.id, responseText(noHandlerReplies), {reply_to_message_id: msg.message_id});
            }
        }
    });
}

function isCall(msg: TelegramBot.Message): string | null {
    const words = msg.text?.trim().split(' ')!;
    if (words[0] && words[0].indexOf(KEYWORD) == 0) {
        return words?.slice(1).join(' ').trim();
    }
    return null;
}

function tryToServe(bot: TelegramBot, msg: TelegramBot.Message): boolean {
    for (const handler of handlers) {
        if (handler(bot, msg)) {
            return true;
        }
    }
    return false;
}

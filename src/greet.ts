import * as TelegramBot from 'node-telegram-bot-api';
import {readFromFile, responseText} from "./text";

export async function greetNewMembers(bot: TelegramBot, myId: number) {
    const selfResponses = await readFromFile('self_greetings');
    const othersResponses = await readFromFile('others_greetings');
    bot.on('new_chat_members', msg => {
        if (msg.new_chat_members && msg.new_chat_members[0].id === myId) {
            bot.sendMessage(msg.chat.id, responseText(selfResponses));
        } else {
            bot.sendMessage(msg.chat.id, responseText(othersResponses));
        }
    });
}

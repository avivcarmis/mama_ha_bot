import * as TelegramBot from "node-telegram-bot-api";
import {getRandomMember, Member} from "./members";
import {lift} from "./lift";
import {roast} from "./roast";

const TIMES_PER_DAY = 2.5;
const START_HOUR_OF_DAY = 10;
const END_HOUR_OF_DAY = 22;

type randomThing = (bot: TelegramBot, chatId: number, member: Member, requireTuvia: boolean, replyMsgId?: number) => any;

const randomThings: Array<randomThing> = [
    lift,
    roast
];

export function doRandomThings(bot: TelegramBot, chatId: number) {
    setInterval(() => handleRandomThings(bot, chatId), 1000 * 60);
}

function handleRandomThings(bot: TelegramBot, chatId: number) {
    if (!shouldDoRandomThings()) {
        return;
    }
    const member = getRandomMember();
    const index = Math.floor(Math.random() * randomThings.length);
    const thing = randomThings[index];
    thing(bot, chatId, member, true);
}

function shouldDoRandomThings(): boolean {
    if (!isValidTime()) {
        return false;
    }
    const totalHours = END_HOUR_OF_DAY - START_HOUR_OF_DAY;
    const totalMinutes = totalHours * 60;
    const probability = TIMES_PER_DAY / totalMinutes;
    return Math.random() < probability;
}

function isValidTime(): boolean {
    const hour = new Date().getHours();
    return hour >= START_HOUR_OF_DAY && hour < END_HOUR_OF_DAY;
}

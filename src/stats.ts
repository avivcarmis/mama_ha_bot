import * as TelegramBot from "node-telegram-bot-api";
import {Collection} from "./db";
import {getMember, getRandomName, getUsernames} from "./members";
import {readFromFileWithTuvia, responseText} from "./text";
import {generatePieChart} from "./pie_chart";

const SUMMARY_HOUR_OF_DAY = 20;
const PIE_CHART_FILE = 'bar.png';

type MemberStats = {
    username: string;
    messages: number;
    words: number;
    chars: number;
};

export async function doStats(bot: TelegramBot, chatId: number) {
    const collection = new Collection<MemberStats>('member_stats.db');
    await collection.init();
    bot.on('message', msg => handleMessage(collection, chatId, msg));
    registerSummary(bot, chatId, collection);
}

async function handleMessage(collection: Collection<MemberStats>, chatId: number, msg: TelegramBot.Message) {
    if (msg.chat.id != chatId) {
        return;
    }
    const username = msg.from?.username
    if (!username) {
        return;
    }
    const words = msg.text?.trim().split(/\s/g).filter(Boolean).length;
    const chars = msg.text?.length;
    let doc = await collection.findOnd({username});
    if (!doc) {
        doc = emptyEntry(username);
        await collection.insertOne(doc);
    }
    doc.messages++;
    doc.words += words || 0;
    doc.chars += chars || 0;
    await collection.updateOne({username}, doc);
}

function emptyEntry(username: string): MemberStats {
    return {username, chars: 0, messages: 0, words: 0};
}

function registerSummary(bot: TelegramBot, chatId: number, collection: Collection<MemberStats>) {
    const now = new Date();
    const summaryTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        SUMMARY_HOUR_OF_DAY,
        0,
        0,
        0
    );
    const diff = (summaryTime as any) - (now as any);
    setTimeout(() => {
        doSummary(bot, chatId, collection);
        registerSummary(bot, chatId, collection);
    }, diff);
}

async function doSummary(bot: TelegramBot, chatId: number, collection: Collection<MemberStats>) {
    const memberMap = await buildMemberMap(collection);
    let max = 0, maxUsername: string | null = null;
    for (const username of Object.keys(memberMap)) {
        if (memberMap[username].messages > max) {
            max = memberMap[username].messages;
            maxUsername = username;
        }
    }
    if (maxUsername) {
        const stats = memberMap[maxUsername];
        const member = getMember(maxUsername);
        const messages = await readFromFileWithTuvia('most_talk', member);
        await bot.sendMessage(chatId, responseText(messages));
        await bot.sendMessage(chatId, `${stats.messages} הודעות\n${stats.words} מילים\n${stats.chars} תווים`);
        sendPieChart(bot ,chatId, Object.values(memberMap));
    }
    cleanData(collection);
}

async function buildMemberMap(collection: Collection<MemberStats>): Promise<{[username: string]: MemberStats}> {
    const result: {[username: string]: MemberStats} = {};
    const usernames = getUsernames();
    for (const username of usernames) {
        let doc = await collection.findOnd({username});
        if (!doc) {
            doc = emptyEntry(username);
        }
        result[username] = doc;
    }
    return result;
}

async function cleanData(collection: Collection<MemberStats>) {
    const usernames = getUsernames();
    for (const username of usernames) {
        let doc = await collection.findOnd({username});
        if (doc) {
            await collection.updateOne({username}, emptyEntry(username));
        }
    }
}

async function sendPieChart(bot: TelegramBot, chatId: number, stats: MemberStats[]) {
    const title = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
    const data = stats.map(entry => ({y: entry.messages, name: getRandomName(entry.username)}));
    await generatePieChart(title, data, PIE_CHART_FILE);
    await bot.sendPhoto(chatId, PIE_CHART_FILE);
}

import * as TelegramBot from "node-telegram-bot-api";

export type Member = {
    names: string[];
    gender: 'male' | 'female';
}

const PEOPLE: {[key: string]: Member} = {
    'Mamzzz234': {
        names: [
            'מאמא',
            'המאמא',
            'מאמאשלי',
            'המאמא הזאת',
            'אדוה',
            'אדווה',
            'חדווים',
        ],
        gender: "female"
    },
    'Yyy895': {
        names: [
            'יקמיר',
            'יקווווורר',
            'ישמיר',
            'יקוויר',
            'יקיר',
            'מקיורק',
        ],
        gender: "male"
    },
    'kala_mir': {
        names: [
            'למיר',
            'למור',
            'לימור',
            'קלמיר',
            'למיר בלי בצל',
            'הררי',
            'ליאור',
        ],
        gender: "female"
    },
    'Najikun': {
        names: [
            'מתון',
            'משוד',
            'מתןןןןןןן',
            'משוש',
            'מתן',
            'מתוד',
        ],
        gender: "male"
    },
    'iobla': {
        names: [
            'איבוב',
            'אבוב',
            'אבבבייייייב',
            'אביב',
            'חביב',
            'מאמא הבן',
        ],
        gender: "male"
    },
}

export function extractUsername(restOfMessage: string): string {
    let username = restOfMessage.trim().split(' ')[0];
    if (username.charAt(0) === '@') {
        username = username.substr(1);
    }
    return username;
}

export function extractMember(restOfMessage: string): Member {
    const username = extractUsername(restOfMessage);
    return PEOPLE[username] || memberByName(username) || {names: [username], gender: "male"};
}

function memberByName(name: string): Member | null {
    for (const member of Object.values(PEOPLE)) {
        if (member.names.indexOf(name) > -1) {
            return member;
        }
    }
    return null;
}

export function getMe(message: TelegramBot.Message): Member {
    return message?.from?.username && PEOPLE[message?.from?.username] || {names: ['טוביה'], gender: "male"};
}

export function getRandomMember(): Member {
    const options = Object.values(PEOPLE);
    const index = Math.floor(Math.random() * options.length);
    return options[index];
}

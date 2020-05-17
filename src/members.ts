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
        ],
        gender: "female"
    },
    'Yyy895': {
        names: [
            'יקמיר',
            'יקווווורר',
            'ישמיר',
            'יקוויר'
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
            'הררי'
        ],
        gender: "female"
    },
    'Najikun': {
        names: [
            'מתון',
            'משוד',
            'מתןןןןןןן',
            'משוש'
        ],
        gender: "male"
    },
    'iobla': {
        names: [
            'איבוב',
            'אבוב',
            'אבבבייייייב'
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
    return PEOPLE[username] || {names: [username], gender: "male"};
}

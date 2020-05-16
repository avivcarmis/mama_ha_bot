const PEOPLE: {[key: string]: string} = {
    'Mamzzz234': 'מאמא',
    'Yyy895': 'יקמיר',
    'kala_mir': 'למיר',
    'Najikun': 'מתון',
    'iobla': 'איבוב',
}

export function extractUsername(restOfMessage: string): string {
    let username = restOfMessage.trim().split(' ')[0];
    if (username.charAt(0) === '@') {
        username = username.substr(1);
    }
    return username;
}

export function extractName(restOfMessage: string): string {
    const username = extractUsername(restOfMessage);
    return PEOPLE[username] || username;
}

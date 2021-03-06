import * as TelegramBot from 'node-telegram-bot-api';
import {greetNewMembers} from "./greet";
import {serve} from "./serve";
import {doRandomThings} from "./random_things";
import {doStats} from "./stats";

const TOKEN = '1232754419:AAFGeEwzFanrU9RV4VR7nunDekRG9MvqZFY';
const MY_ID = 1232754419;

const bot = new TelegramBot(TOKEN, {polling: true});

greetNewMembers(bot, MY_ID);
serve(bot);
doStats(bot, -1001217422900);
doRandomThings(bot, -1001217422900);

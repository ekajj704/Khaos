"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const discord_js_1 = require("discord.js");
const randomQuote_1 = require("./randomQuote");
const randomChaos_1 = require("./randomChaos");
const randomPet_1 = require("./randomPet");
const randomMeme_1 = require("./randomMeme");
const client = new discord_js_1.Client({
    intents: [discord_js_1.IntentsBitField.Flags.MessageContent, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.Guilds]
});
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("BOT IS READY TO KILL"); //message when bot is online
    yield (0, randomQuote_1.fetchAllQuotes)(client);
    console.log("QUOTES FILED FOR CRIMINAL CASES");
    yield (0, randomChaos_1.fetchAllChaosImages)(client);
    console.log("CHAOS RUNNING RAMPANT");
    yield (0, randomPet_1.fetchAllPetImages)(client);
    console.log("PETS PETTED");
    yield (0, randomMeme_1.fetchAllMemeImages)(client);
    console.log("MEMES STOLEN");
}));
client.on('messageCreate', (messages) => {
    (0, randomQuote_1.randomQuote)(messages, client);
    (0, randomChaos_1.randomChaos)(messages, client);
    (0, randomPet_1.randomPet)(messages, client);
    (0, randomMeme_1.randomMeme)(messages, client);
});
client.login(process.env.TOKEN);

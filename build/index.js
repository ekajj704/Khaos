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
const randomChaos_1 = require("./randomChaos");
const client = new discord_js_1.Client({
    intents: [discord_js_1.IntentsBitField.Flags.MessageContent, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.Guilds]
});
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("BOT IS READY TO KILL"); //message when bot is online
    /*await fetchAllQuotes(client);
    console.log("QUOTES FILED FOR CRIMINAL CASES");*/
    yield (0, randomChaos_1.fetchAllChaosImages)(client);
    console.log("CHAOS RUNNING RAMPANT");
    /*await fetchAllPetImages(client);
    console.log("PETS PETTED");
    await fetchAllMemeImages(client);
    console.log("MEMES STOLEN");*/
}));
client.on('messageCreate', (messages) => {
    /*randomQuote(messages, client);
    randomChaos(messages, client);
    randomPet(messages, client);
    randomMeme(messages, client);*/
});
client.login(process.env.TOKEN);

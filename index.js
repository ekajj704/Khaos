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
const client = new discord_js_1.Client({
    intents: [discord_js_1.IntentsBitField.Flags.MessageContent, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.Guilds]
});
let lastQuoteRefresh = 0;
let quotes = [];
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("BOT IS ONLINE"); //message when bot is online
    yield fetchAllQuotes();
    console.log(quotes.length);
}));
client.on('messageCreate', (messages) => {
    randomQuote(messages);
});
client.login(process.env.TOKEN);
function randomQuote(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messages.content.toLowerCase() === "random-quote") {
            yield fetchAllQuotes();
            let randomQuote = Math.round(Math.random() * quotes.length);
            messages.reply(quotes[randomQuote]);
        }
    });
}
function fetchAllQuotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = client.channels.cache.get("880187045119680532");
        let lastQuoteDate;
        let quoteGetter = 0;
        let stop = 0;
        // Create message pointer
        let message = yield channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
        while (message) {
            if (stop != 0) {
                lastQuoteRefresh = lastQuoteDate;
                return;
            }
            yield channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                messagePage.forEach((msg) => {
                    if (msg.createdTimestamp < lastQuoteRefresh) {
                        stop++;
                        console.log(`${msg.createdTimestamp} < ${lastQuoteRefresh}`);
                        return;
                    }
                    if (msg.content.includes('"')) {
                        quotes.push(msg.content);
                    }
                    if (quoteGetter === 0) {
                        lastQuoteDate = msg.createdTimestamp;
                        quoteGetter++;
                    }
                });
                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
        }
        lastQuoteRefresh = lastQuoteDate;
    });
}

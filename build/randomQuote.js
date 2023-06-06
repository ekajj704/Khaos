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
exports.fetchAllQuotes = exports.randomQuote = void 0;
let lastQuoteRefresh = 0;
let quotes = [];
function randomQuote(interaction, client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchAllQuotes(client);
        let randomQuote = Math.round(Math.random() * quotes.length);
        interaction.reply(quotes[randomQuote]);
    });
}
exports.randomQuote = randomQuote;
function fetchAllQuotes(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = client.channels.cache.get("880187045119680532");
        let lastQuoteDate;
        let dateGetter = 0;
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
                        return;
                    }
                    if (msg.content.includes('"') && !msg.author.bot) {
                        quotes.push(msg.content);
                    }
                    if (dateGetter === 0) {
                        lastQuoteDate = msg.createdTimestamp;
                        dateGetter++;
                    }
                });
                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
        }
        lastQuoteRefresh = lastQuoteDate;
    });
}
exports.fetchAllQuotes = fetchAllQuotes;

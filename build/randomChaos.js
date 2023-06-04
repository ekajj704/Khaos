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
exports.fetchAllChaosImages = exports.randomChaos = void 0;
let chaosURLS = [];
let lastImageRefresh = 0;
function randomChaos(msg, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.content.toLowerCase() === "random-chaos") {
            fetchAllChaosImages(client);
            let chaosImage = Math.round(Math.random() * chaosURLS.length);
            msg.reply(chaosURLS[chaosImage]);
        }
    });
}
exports.randomChaos = randomChaos;
function fetchAllChaosImages(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = client.channels.cache.get("880188365444636772");
        let lastImageDate;
        let dateGetter = 0;
        let stop = 0;
        // Create message pointer
        let message = yield channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
        while (message) {
            if (stop != 0) {
                lastImageRefresh = lastImageDate;
                return;
            }
            yield channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                messagePage.forEach((msg) => {
                    if (msg.createdTimestamp < lastImageRefresh) {
                        stop++;
                        return;
                    }
                    if (msg.attachments.size > 0 && !msg.author.bot) {
                        msg.attachments.forEach((value) => {
                            chaosURLS.push(value.url);
                        });
                    }
                    if (dateGetter === 0) {
                        lastImageDate = msg.createdTimestamp;
                        dateGetter++;
                    }
                });
                // Update our message pointer to be last message in page of messages
                message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            });
        }
        lastImageRefresh = lastImageDate;
    });
}
exports.fetchAllChaosImages = fetchAllChaosImages;

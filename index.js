"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    intents: [discord_js_1.IntentsBitField.Flags.MessageContent, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.Guilds]
});
client.once("ready", () => {
    console.log("BOT IS ONLINE"); //message when bot is online
});
client.on('messageCreate', (messages) => {
    console.log(messages.content);
    if (messages.content.toLocaleLowerCase() === 'hello')
        messages.channel.send('Hello' + ' ' + messages.author.username); //reply hello word message with senders name
});
client.login(process.env.TOKEN);

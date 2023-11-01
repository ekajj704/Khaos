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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
require("dotenv").config();
const discord_js_1 = require("discord.js");
const randomQuote_1 = require("./randomQuote");
const randomChaos_1 = require("./randomChaos");
const randomPet_1 = require("./randomPet");
const randomMeme_1 = require("./randomMeme");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
exports.client = new discord_js_1.Client({
    intents: [discord_js_1.IntentsBitField.Flags.MessageContent, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.Guilds, discord_js_1.IntentsBitField.Flags.DirectMessages],
});
exports.client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("BOT IS READY TO KILL"); //message when bot is online
    yield (0, randomQuote_1.fetchAllQuotes)(exports.client);
    console.log("QUOTES FILED FOR CRIMINAL CASES");
    yield (0, randomChaos_1.fetchAllChaosImages)(exports.client);
    console.log("CHAOS RUNNING RAMPANT");
    yield (0, randomPet_1.fetchAllPetImages)(exports.client);
    console.log("PETS PETTED");
    yield (0, randomMeme_1.fetchAllMemeImages)(exports.client);
    console.log("MEMES STOLEN");
}));
exports.client.login(process.env.TOKEN);
let commands = new discord_js_1.Collection;
const foldersPath = node_path_1.default.join(__dirname, 'commands');
const commandFolders = node_fs_1.default.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = node_path_1.default.join(foldersPath, folder);
    const commandFiles = node_fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = node_path_1.default.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
exports.client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            yield interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}));

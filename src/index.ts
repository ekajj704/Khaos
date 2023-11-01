require("dotenv").config();
import Discord, {Channel, channelLink, ChannelManager, Client, Collection, IntentsBitField, MessageManager, quote} from "discord.js";
import { randomQuote, fetchAllQuotes } from "./randomQuote";
import { fetchAllChaosImages, randomChaos } from "./randomChaos";
import { fetchAllPetImages, randomPet } from "./randomPet";
import { fetchAllMemeImages, randomMeme } from "./randomMeme";
import fs from "node:fs";
import path from "node:path";


export const client=new Client({
    intents:[IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.DirectMessages],
});

client.once("ready", async() =>{
    console.log("BOT IS READY TO KILL"); //message when bot is online
    /*await fetchAllQuotes(client);
    console.log("QUOTES FILED FOR CRIMINAL CASES");
    await fetchAllChaosImages(client);
    console.log("CHAOS RUNNING RAMPANT");
    await fetchAllPetImages(client);
    console.log("PETS PETTED");
    await fetchAllMemeImages(client);
    console.log("MEMES STOLEN");*/
    
})

client.login(process.env.TOKEN);

let commands: Collection<string, any> = new Collection<string, any>;

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
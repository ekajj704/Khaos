require("dotenv").config();
import Discord, {Channel, channelLink, ChannelManager, Client, IntentsBitField, MessageManager, quote} from "discord.js";
import { randomQuote, fetchAllQuotes } from "./randomQuote";
import { fetchAllChaosImages, randomChaos } from "./randomChaos";
import { fetchAllPetImages, randomPet } from "./randomPet";
import { fetchAllMemeImages, randomMeme } from "./randomMeme";


const client=new Client({
    intents:[IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds]
});

client.once("ready", async() =>{
    console.log("BOT IS READY TO KILL"); //message when bot is online
    await fetchAllQuotes(client);
    console.log("QUOTES FILED FOR CRIMINAL CASES");
    await fetchAllChaosImages(client);
    console.log("CHAOS RUNNING RAMPANT");
    await fetchAllPetImages(client);
    console.log("PETS PETTED");
    await fetchAllMemeImages(client);
    console.log("MEMES STOLEN");
    
})

client.on('messageCreate', (messages) => {
    randomQuote(messages, client);
    randomChaos(messages, client);
    randomPet(messages, client);
    randomMeme(messages, client);
})

client.login(process.env.TOKEN);


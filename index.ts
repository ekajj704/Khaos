require("dotenv").config();
import Discord, {Channel, channelLink, ChannelManager, Client, IntentsBitField, MessageManager, quote} from "discord.js";
import { randomQuote, fetchAllQuotes } from "./randomQuote";
import { fetchAllChaosImages, randomChaos } from "./randomChaos";
import { fetchAllPetImages, randomPet } from "./randomPet";


const client=new Client({
    intents:[IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds]
});

client.once("ready", async() =>{
    console.log("BOT IS ONLINE"); //message when bot is online
    await fetchAllQuotes(client);
    console.log("QUOTES CACHED");
    await fetchAllChaosImages(client);
    console.log("CHAOS CACHED");
    await fetchAllPetImages(client);
    console.log("PETS CACHED");
    
})

client.on('messageCreate', (messages) => {
    randomQuote(messages, client);
    randomChaos(messages, client);
    randomPet(messages, client);
})

client.login(process.env.TOKEN);


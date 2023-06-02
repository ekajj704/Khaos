require("dotenv").config();
import {Client, IntentsBitField} from "discord.js";

const client=new Client({
    intents:[IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds ]
});

client.once("ready", () =>{
    console.log("BOT IS ONLINE"); //message when bot is online
})

client.on('messageCreate', (messages) => {
    console.log(messages.content);
    if(messages.content.toLocaleLowerCase()==='hello') 
    messages.channel.send('Hello' + ' '  + messages.author.username); //reply hello word message with senders name
})

client.login(process.env.TOKEN);
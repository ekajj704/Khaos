require("dotenv").config();
import Discord, {Channel, channelLink, ChannelManager, Client, IntentsBitField, MessageManager, quote} from "discord.js";

const client=new Client({
    intents:[IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds ]
});

let lastQuoteRefresh: number = 0;
let quotes: string[] = [];

client.once("ready", async() =>{
    console.log("BOT IS ONLINE"); //message when bot is online
    await fetchAllQuotes();
    console.log(quotes.length);
})

client.on('messageCreate', (messages) => {
    randomQuote(messages);

})

client.login(process.env.TOKEN);

async function randomQuote(messages: Discord.Message){
    if(messages.content.toLowerCase() === "random-quote"){
        await fetchAllQuotes();
        

        let randomQuote = Math.round(Math.random() * quotes.length);
        messages.reply(quotes[randomQuote]);
    }
}

    async function fetchAllQuotes(){
        const channel = (client.channels.cache.get("880187045119680532") as Discord.TextChannel);
        let lastQuoteDate: number;
        let quoteGetter = 0;
        let stop = 0;
      
        // Create message pointer
        let message = await channel.messages
          .fetch({ limit: 1 })
          .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
      
        while (message) {
            if(stop != 0){
                lastQuoteRefresh = lastQuoteDate;
                return;
            }
          await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
              messagePage.forEach((msg) => {
                if(msg.createdTimestamp < lastQuoteRefresh){
                    stop++;
                    return;
                }
                if(msg.content.includes('"')){
                    quotes.push(msg.content);
                }
                if(quoteGetter === 0){
                    lastQuoteDate = msg.createdTimestamp;
                    quoteGetter++;
                }
            });
      
              // Update our message pointer to be last message in page of messages
              message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            })
        }
        lastQuoteRefresh = lastQuoteDate;
      }
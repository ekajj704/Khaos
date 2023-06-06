import Discord from "discord.js";

let lastQuoteRefresh: number = 0;
let quotes: string[] = [];

export async function randomQuote(interaction: Discord.ChatInputCommandInteraction, client: Discord.Client){
        await fetchAllQuotes(client);
        

        let randomQuote = Math.round(Math.random() * quotes.length);
        interaction.reply(quotes[randomQuote]);
    
}

export async function fetchAllQuotes(client: Discord.Client){
    const channel = (client.channels.cache.get("880187045119680532") as Discord.TextChannel);
    let lastQuoteDate: number;
    let dateGetter = 0;
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
                if(msg.content.includes('"') && !msg.author.bot){
                    quotes.push(msg.content);
                }
                if(dateGetter === 0){
                    lastQuoteDate = msg.createdTimestamp;
                    dateGetter++;
                }
            });
      
              // Update our message pointer to be last message in page of messages
              message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            })
        }
    lastQuoteRefresh = lastQuoteDate;
}
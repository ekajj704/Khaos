import Discord from "discord.js";

let chaosURLS : string[] = [];
let lastImageRefresh = 0;

export async function randomChaos(interaction: Discord.RepliableInteraction, client: Discord.Client) {
        fetchAllChaosImages(client);
        let chaosImage = Math.round(Math.random() * chaosURLS.length);
        await interaction.reply(chaosURLS[chaosImage]);
}

export async function fetchAllChaosImages(client: Discord.Client){
    const channel = (client.channels.cache.get("880188365444636772") as Discord.TextChannel);
    let lastImageDate: number;
    let dateGetter = 0;
    let stop = 0;
      
        // Create message pointer
        let message = await channel.messages
          .fetch({ limit: 1 })
          .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
      
        while (message) {
            if(stop != 0){
                lastImageRefresh = lastImageDate;
                return;
            }
          await channel.messages
            .fetch({ limit: 100, before: message.id })
            .then(messagePage => {
              messagePage.forEach((msg) => {
                if(msg.createdTimestamp < lastImageRefresh){
                    stop++;
                    return;
                }
                if(msg.attachments.size > 0 && !msg.author.bot){
                    msg.attachments.forEach((value) => {
                        chaosURLS.push(value.url);
                    })
                }
                if(dateGetter === 0){
                    lastImageDate = msg.createdTimestamp;
                    dateGetter++;
                }
                
                
            });
      
              // Update our message pointer to be last message in page of messages
              message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
            })
        }
        lastImageRefresh = lastImageDate;
}
import Discord from "discord.js";

let petURLS : string[] = [];
let lastImageRefresh = 0;

export async function randomPet(interaction: Discord.ChatInputCommandInteraction, client: Discord.Client) {
        await fetchAllPetImages(client);
        let petImage = Math.round(Math.random() * petURLS.length);
        interaction.reply(petURLS[petImage]);
}

export async function fetchAllPetImages(client: Discord.Client){
    const channel = (client.channels.cache.get("993713449471332425") as Discord.TextChannel);
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
                        petURLS.push(value.url);
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
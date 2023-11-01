import Discord from "discord.js";

export async function Inspire(interaction: Discord.ChatInputCommandInteraction, client: Discord.Client) {
    let url = await fetch("http://inspirobot.me/api?generate=true");
    interaction.reply(await url.text());
}
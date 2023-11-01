import Discord from "discord.js";
import axios from "axios";

export async function Inspire(interaction: Discord.ChatInputCommandInteraction, client: Discord.Client) {
    let url = await (await axios.get("http://inspirobot.me/api?generate=true")).data;
    interaction.reply(await url);
}
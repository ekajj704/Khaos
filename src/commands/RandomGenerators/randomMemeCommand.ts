import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { randomMeme } from "../../randomMeme";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Generates a random image from memes"),
    async execute(interaction: ChatInputCommandInteraction){
        await randomMeme(interaction, interaction.client);
    }
}
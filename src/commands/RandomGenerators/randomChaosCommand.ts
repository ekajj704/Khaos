import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { randomChaos } from "../../randomChaos";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chaos")
        .setDescription("Generates a random image from chaos-montage"),
    async execute(interaction: ChatInputCommandInteraction){
        await randomChaos(interaction, interaction.client);
    }
}
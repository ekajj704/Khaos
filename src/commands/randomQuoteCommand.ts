import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { randomQuote } from "../randomQuote";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Generates a quote from the quotes channel"),
    async execute(interaction: ChatInputCommandInteraction){
        await randomQuote(interaction, interaction.client);
    }
}

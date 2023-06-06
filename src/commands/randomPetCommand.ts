import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { randomPet } from "../randomPet";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pet")
        .setDescription("Generates a random image from the pets channel"),
    async execute(interaction: ChatInputCommandInteraction){
        await randomPet(interaction, interaction.client);
    }
}
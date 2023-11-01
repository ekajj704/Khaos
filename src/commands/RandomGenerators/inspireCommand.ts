import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { Inspire } from "../../inspire";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inspire")
        .setDescription("Generates a random inspirational quote"),
    async execute(interaction: ChatInputCommandInteraction){
        await Inspire(interaction, interaction.client);
    }
}
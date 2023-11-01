import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { startGame } from "../../mafia";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Starts the current game of Mafia"),
    async execute(interaction: ChatInputCommandInteraction){
        startGame(interaction);
    }
}
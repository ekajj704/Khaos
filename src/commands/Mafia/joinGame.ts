import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinGame } from "../../mafia";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins the current game of Mafia"),
    async execute(interaction: ChatInputCommandInteraction){
        joinGame(interaction);
    }
}
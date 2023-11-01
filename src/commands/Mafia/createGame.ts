import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createMafiaGame } from "../../mafia";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("game")
        .setDescription("Creates a new game")
        .addSubcommand(subcommand => {
            subcommand
                .setName("mafia")
                .setDescription("A game of mafia");
            return subcommand;
        }),
    async execute(interaction: ChatInputCommandInteraction){
        createMafiaGame(interaction);
    }
}
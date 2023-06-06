"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const randomChaos_1 = require("../randomChaos");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("chaos")
        .setDescription("Generates a random image from chaos-montage"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, randomChaos_1.randomChaos)(interaction, interaction.client);
        });
    }
};

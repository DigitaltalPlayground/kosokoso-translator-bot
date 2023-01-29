import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
  name: "translate",
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('こそこそ語と日本語を相互翻訳します。言語は自動認識します。')
    .addStringOption(
      new SlashCommandStringOption()
      .setName("text")
      .setDescription("翻訳対象のテキスト")
      .setRequired(true)
    )
  ,
	async execute(interaction:CommandInteraction) {
		if(interaction.options.getString("text")
      .split("")
      .filter(c => c != "こ" && c != "そ")
      .length > 0){
        await require("./translatej").default.execute(interaction);
      }else{
        await require("./translatek").default.execute(interaction);
      }
	},
};
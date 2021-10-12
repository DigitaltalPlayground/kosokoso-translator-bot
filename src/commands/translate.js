const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');

module.exports = {
  name: "translate",
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('こそこそ語と日本語を相互翻訳します。言語は自動認識します。')
    .addStringOption(
      new SlashCommandStringOption()
      .setName("text")
      .setDescription("翻訳対象のテキスト")
      .setRequired(true)
    ),
    /**
     * @param {import("discord.js").CommandInteraction} interaction 
     */
	async execute(interaction) {
		if(interaction.options.getString("text")
      .split("")
      .filter(c => c != "こ" && c != "そ")
      .length > 0){
        await require("./translatej").execute(interaction);
      }else{
        await require("./translatek").execute(interaction);
      }
	},
};
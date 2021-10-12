const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const lib = require("../lib");

module.exports = {
	name: "translatek",
	data: new SlashCommandBuilder()
		.setName('translatek')
		.setDescription('こそこそ語を日本語に相互翻訳します')
		.addStringOption(
			new SlashCommandStringOption()
			.setName("text")
			.setDescription("翻訳対象のテキスト")
			.setRequired(true)
		)
		,
		/**
		 * @param {import("discord.js").CommandInteraction} interaction 
		 */
	async execute(interaction) {
		try{
			await interaction.reply({
				content: "`こそこそ語` から `日本語` への翻訳結果:\r\n```" +
				lib.convertCIDToText(
					lib.convertKoso1ToCID(interaction.options.getString("text"))
				)
				+ "\r\n```",
				ephemeral: true
			});
		}
		catch{
			await interaction.reply({
				content: "失敗しました...",
				ephemeral: true
			})
		}
	},
};
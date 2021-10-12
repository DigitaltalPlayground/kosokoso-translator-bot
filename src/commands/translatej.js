const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const lib = require("../lib");

module.exports = {
	name: "translatej",
	data: new SlashCommandBuilder()
		.setName('translatej')
		.setDescription('日本語をこそこそ語に相互翻訳します')
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
				content: "`日本語` から `こそこそ語` への翻訳結果:\r\n```\r\n" +
				lib.convertCIDToKoso1(
					lib.convertTextToCID(interaction.options.getString("text"))
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
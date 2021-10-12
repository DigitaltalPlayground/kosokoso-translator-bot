//@ts-check
require("dotenv").config();
const discord = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new discord.Client({
  intents: [
    discord.Intents.FLAGS.GUILD_INTEGRATIONS
  ]
});

/**
 * @type {{
 *  data: import("@discordjs/builders").SlashCommandBuilder,
 *  execute: function(import("discord.js").CommandInteraction):Promise<void>,
 *  name: string
 * }[]}
 */
const commands = fs.readdirSync(path.join(__dirname, "./commands"), {withFileTypes: true})
  .filter(d => d.isFile())
  .map(d => d.name)
  .filter(d => d.endsWith(".js"))
  .map(d => d.slice(0, -3))
  .map(d => require("./commands/" + d));

client
.on("ready", () => {
  console.log("the bot is ready now");
})
.on("interactionCreate", async (interaction) => {
  if(interaction.isCommand()){
    await commands.find(c => c.name === interaction.commandName)?.execute(interaction)
  }
})
.login(process.env.TOKEN)
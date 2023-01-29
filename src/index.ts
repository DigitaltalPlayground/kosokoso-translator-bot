import "./dotenv";
import * as discord from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { CommandInteraction } from "discord.js";

export default function Bot(token:string){
  const client = new discord.Client({
    intents: [
      discord.Intents.FLAGS.GUILD_INTEGRATIONS
    ]
  });

  const commands = fs.readdirSync(path.join(__dirname, "./commands"), {withFileTypes: true})
    .filter(d => d.isFile())
    .map(d => d.name)
    .filter(d => d.endsWith(".js"))
    .map(d => d.slice(0, -3))
    .map(d => require("./commands/" + d).default as {
      data: import("@discordjs/builders").SlashCommandBuilder,
      execute: (interaction:CommandInteraction) => Promise<void>,
      name: string
    });

  client
    .on("ready", () => {
      console.log("the bot is ready now");
    })
    .on("interactionCreate", async (interaction) => {
      if(interaction.isCommand()){
        await commands.find(c => c.name === interaction.commandName)?.execute(interaction)
      }
    })
    .login(token)
  ;
};
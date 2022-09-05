import "./dotenv"
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as fs from "fs";
import * as path from "path";

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, './commands'), {withFileTypes: true})
  .filter(d => d.isFile())
  .map(d => d.name)
  .filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

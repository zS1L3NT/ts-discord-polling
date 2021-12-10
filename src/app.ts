import BotCache from "./models/BotCache"
import GuildCache from "./models/GuildCache"
import NovaBot from "nova-bot"
import { Intents } from "discord.js"

const config = require("../config.json")

new NovaBot({
	name: "Polling#7976",
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
	cwd: __dirname,
	config,
	updatesMinutely: true,

	help: {
		message: () =>
			[
				"Welcome to Polling!",
				"Polling is a bot that helps create better Polls for your servers",
				"Built to replace the common way of polling using Discord Reactions",
				"",
				"**Make sure to set the poll channel with the **`set polls-channel`** command to see polls in a specific channel**",
				"Use `poll create` to create a poll",
				"Use `poll post` to send your poll draft to the Polls",
				"Have fun exploring Polling!"
			].join("\n"),
		icon: "https://cdn.discordapp.com/avatars/881619054044012594/8083c59550893bc0ce63bf524773655c.webp?size=128"
	},

	GuildCache,
	BotCache,

	onSetup: botCache => {
		botCache.bot.user!.setPresence({
			activities: [
				{
					name: "/help",
					type: "LISTENING"
				}
			]
		})
	}
})

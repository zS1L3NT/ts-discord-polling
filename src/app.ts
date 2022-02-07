import BotCache from "./data/BotCache"
import colors from "colors"
import config from "./config.json"
import GuildCache from "./data/GuildCache"
import NovaBot from "nova-bot"
import Tracer from "tracer"
import { Intents } from "discord.js"

global.logger = Tracer.colorConsole({
	level: process.env.LOG_LEVEL || "log",
	format: [
		"[{{timestamp}}] <{{path}}> {{message}}",
		{
			//@ts-ignore
			alert: "[{{timestamp}}] <{{path}}, Line {{line}}> {{message}}",
			warn: "[{{timestamp}}] <{{path}}, Line {{line}}> {{message}}",
			error: "[{{timestamp}}] <{{path}}, Line {{line}} at {{pos}}> {{message}}"
		}
	],
	methods: ["log", "discord", "debug", "info", "alert", "warn", "error"],
	dateformat: "dd mmm yyyy, hh:MM:sstt",
	filters: {
		log: colors.grey,
		//@ts-ignore
		discord: colors.cyan,
		debug: colors.blue,
		info: colors.green,
		//@ts-ignore
		alert: colors.yellow,
		warn: colors.yellow.bold.italic,
		error: colors.red.bold.italic
	},
	preprocess: data => {
		data.path = data.path
			.split("nova-bot")
			.at(-1)!
			.replace(/^(\/|\\)dist/, "nova-bot")
			.replaceAll("\\", "/")
		data.path = data.path
			.split("ts-discord-polling")
			.at(-1)!
			.replace(/^(\/|\\)(dist|src)/, "src")
			.replaceAll("\\", "/")
	}
})

new NovaBot({
	name: "Polling#7976",
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
	directory: __dirname,
	config,
	updatesMinutely: true,
	//@ts-ignore
	logger: global.logger,

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

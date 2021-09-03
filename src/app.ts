import {Client, Intents} from "discord.js"
import AfterEvery from "after-every"
import BotSetupHelper from "./utilities/BotSetupHelper"
import GuildCache from "./models/GuildCache"

const config = require("../config.json")

// region Initialize bot
const bot = new Client({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})
const botSetupHelper = new BotSetupHelper(bot)
const {cache: botCache} = botSetupHelper
// endregion

void bot.login(config.discord.token)
bot.on("ready", async () => {
	console.log("Logged in as Polling Bot#7976")

	let debugCount = 0

	let i = 0
	let count = bot.guilds.cache.size
	for (const guild of bot.guilds.cache.toJSON()) {
		const tag = `${(++i).toString().padStart(count.toString().length, "0")}/${count}`
		let cache: GuildCache | undefined
		try {
			cache = await botCache.getGuildCache(guild)
		} catch (err) {
			console.error(`${tag} ❌ Couldn't find a Firebase Document for Guild(${guild.name})`)
			guild.leave()
			continue
		}

		try {
			await botSetupHelper.deploySlashCommands(guild)
		} catch (err) {
			console.error(`${tag} ❌ Couldn't get Slash Command permission for Guild(${guild.name})`)
			guild.leave()
			continue
		}

		cache.updateMinutely(debugCount).then()

		console.log(`${tag} ✅ Restored cache for Guild(${guild.name})`)
	}
	console.log(`✅ All bot cache restored`)
	console.log("|")

	AfterEvery(1).minutes(async () => {
		debugCount++
		for (const guild of bot.guilds.cache.toJSON()) {
			const cache = await botCache.getGuildCache(guild)
			cache.updateMinutely(debugCount).then()
		}
	})
})

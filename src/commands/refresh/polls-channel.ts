import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "nova-bot"
import { TextChannel } from "discord.js"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "polls-channel",
		description: {
			slash: "Refresh Polls in the Poll channel",
			help: "Manually refresh the Poll channel if it has been set"
		}
	},
	execute: async helper => {
		const channel = helper.cache.guild.channels.cache.get(
			helper.cache.getPollChannelId()
		)
		if (channel instanceof TextChannel) {
			await helper.cache.updatePollChannel()
			helper.respond(
				new ResponseBuilder(Emoji.GOOD, "Poll channel refreshed")
			)
		} else {
			helper.respond(
				new ResponseBuilder(Emoji.BAD, "No Poll channel set")
			)
		}
	}
}

export default file

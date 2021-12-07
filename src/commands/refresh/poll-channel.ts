import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import ResponseBuilder, { Emoji } from "../../utilities/ResponseBuilder"
import { TextChannel } from "discord.js"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	builder: new SlashCommandSubcommandBuilder()
		.setName("poll-channel")
		.setDescription(
			"Refresh poll in the poll channel"
		),
	execute: async helper => {
		const channel = helper.cache.guild.channels.cache.get(helper.cache.getPollChannelId())
		if (channel instanceof TextChannel) {
			await helper.cache.updatePollChannel()
			helper.respond(new ResponseBuilder(
				Emoji.GOOD,
				"Poll channel refreshed"
			))
		}
		else {
			helper.respond(new ResponseBuilder(
				Emoji.BAD,
				"No poll channel set"
			))
		}
	}
}

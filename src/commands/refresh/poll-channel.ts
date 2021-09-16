import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import { TextChannel } from "discord.js"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("poll-channel")
		.setDescription(
			"Refresh poll in the poll channel"
		),
	execute: async helper => {
		const channel = helper.cache.guild.channels.cache.get(helper.cache.getPollChannelId())
		if (channel instanceof TextChannel) {
			await helper.cache.updatePollChannel()
			helper.respond(new EmbedResponse(
				Emoji.GOOD,
				"Poll channel refreshed"
			))
		}
		else {
			helper.respond(new EmbedResponse(
				Emoji.BAD,
				"No poll channel set"
			))
		}
	}
} as iInteractionSubcommandFile

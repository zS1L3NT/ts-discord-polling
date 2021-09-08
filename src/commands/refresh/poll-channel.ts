import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
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
			helper.respond("✅ Poll channel refreshed")
		}
		else {
			helper.respond("❌ No poll channel set")
		}
	}
} as iInteractionSubcommandFile

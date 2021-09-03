import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { TextChannel } from "discord.js"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("poll-channel")
		.setDescription("Set the channel that all the polls show up in")
		.addChannelOption(option =>
			option
				.setName("channel")
				.setDescription("Leave empty to unset the poll channel")
		),
	execute: async helper => {
		const channel = helper.channel("channel")
		if (channel instanceof TextChannel) {
			if (channel.id === helper.cache.getPollChannelId()) {
				helper.respond(
					"❌ This channel is already the polls channel!"
				)
			} else {
				await helper.cache.setPollChannelId(channel.id)
				helper.cache.updatePollChannel().then()
				helper.respond(
					`✅ Reminders channel reassigned to ${channel.toString()}`
				)
			}
		} else if (channel === null) {
			await helper.cache.setPollChannelId("")
			helper.respond(`✅ Poll channel unassigned`)
		} else {
			helper.respond(`❌ Please select a text channel`)
		}
	}
} as iInteractionSubcommandFile
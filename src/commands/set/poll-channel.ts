import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { GuildMember, TextChannel } from "discord.js"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

const config = require("../../../config.json")

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
		const member = helper.interaction.member as GuildMember
		if (!member.permissions.has("ADMINISTRATOR") && member.id !== config.discord.dev_id) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Only administrators can set bot channels"
			))
		}

		const channel = helper.channel("channel")
		if (channel instanceof TextChannel) {
			if (channel.id === helper.cache.getPollChannelId()) {
				helper.respond(new EmbedResponse(
					Emoji.BAD,
					"This channel is already the polls channel!"
				))
			}
			else {
				await helper.cache.setPollChannelId(channel.id)
				helper.cache.updatePollChannel().then()
				helper.respond(new EmbedResponse(
					Emoji.GOOD,
					`Reminders channel reassigned to ${channel.toString()}`
				))
			}
		}
		else if (channel === null) {
			await helper.cache.setPollChannelId("")
			helper.respond(new EmbedResponse(
				Emoji.GOOD,
				`Poll channel unassigned`
			))
		}
		else {
			helper.respond(new EmbedResponse(
				Emoji.BAD,
				`Please select a text channel`
			))
		}
	}
} as iInteractionSubcommandFile
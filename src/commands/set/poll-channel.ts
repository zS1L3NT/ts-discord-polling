import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { Emoji, GuildMember, TextChannel } from "discord.js"
import { iInteractionSubcommandFile, ResponseBuilder } from "discordjs-nova"
import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"

const config = require("../../../config.json")

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	builder: new SlashCommandSubcommandBuilder()
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
			return helper.respond(new ResponseBuilder(
				Emoji.BAD,
				"Only administrators can set bot channels"
			))
		}

		const channel = helper.channel("channel")
		if (channel instanceof TextChannel) {
			if (channel.id === helper.cache.getPollChannelId()) {
				helper.respond(new ResponseBuilder(
					Emoji.BAD,
					"This channel is already the polls channel!"
				))
			}
			else {
				await helper.cache.setPollChannelId(channel.id)
				helper.cache.updatePollChannel()
				helper.respond(new ResponseBuilder(
					Emoji.GOOD,
					`Reminders channel reassigned to ${channel.toString()}`
				))
			}
		}
		else if (channel === null) {
			await helper.cache.setPollChannelId("")
			helper.respond(new ResponseBuilder(
				Emoji.GOOD,
				`Poll channel unassigned`
			))
		}
		else {
			helper.respond(new ResponseBuilder(
				Emoji.BAD,
				`Please select a text channel`
			))
		}
	}
}
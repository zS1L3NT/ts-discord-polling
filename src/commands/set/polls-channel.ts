import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "nova-bot"
import { GuildMember, TextChannel } from "discord.js"

const config = require("../../../config.json")

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "polls-channel",
		description: {
			slash: "Set the channel that all poll embeds show up in",
			help: [
				"Sets the channel which the bot will attatch to and show all the polls",
				"This channel will be owned by the bot and unrelated messages will be cleared every minute",
				"Use this to see all the polls in a channel"
			].join("\n")
		},
		options: [
			{
				name: "channel",
				description: {
					slash: "Leave this empty if you want to unset the channel",
					help: "Leave this empty if you want to unset the channel"
				},
				type: "channel",
				requirements: "Valid Text Channel",
				required: false
			}
		]
	},
	execute: async helper => {
		const member = helper.interaction.member as GuildMember
		if (
			!member.permissions.has("ADMINISTRATOR") &&
			member.id !== config.discord.dev_id
		) {
			return helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"Only administrators can set bot channels"
				)
			)
		}

		const channel = helper.channel("channel")
		if (channel instanceof TextChannel) {
			if (channel.id === helper.cache.getPollChannelId()) {
				helper.respond(
					new ResponseBuilder(
						Emoji.BAD,
						"This channel is already the Polls channel!"
					)
				)
			} else {
				await helper.cache.setPollChannelId(channel.id)
				helper.cache.updatePollChannel()
				helper.respond(
					new ResponseBuilder(
						Emoji.GOOD,
						`Polls channel reassigned to \`#${channel.name}\``
					)
				)
			}
		} else if (channel === null) {
			await helper.cache.setPollChannelId("")
			helper.respond(
				new ResponseBuilder(Emoji.GOOD, `Poll channel unassigned`)
			)
		} else {
			helper.respond(
				new ResponseBuilder(Emoji.BAD, `Please select a text channel`)
			)
		}
	}
}

export default file

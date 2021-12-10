import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { Emoji, iButtonFile, ResponseBuilder } from "nova-bot"
import { GuildMember } from "discord.js"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const pollId = helper.interaction.message.embeds[0]!.fields!.find(
			field => field.name === "ID"
		)!.value
		const poll = helper.cache.polls.find(poll => poll.value.id === pollId)!
		const member = helper.interaction.member as GuildMember

		if (
			helper.interaction.user.id === poll.value.author_id ||
			member.permissions.has("ADMINISTRATOR")
		) {
			await helper.cache.ref
				.collection("polls")
				.doc(pollId)
				.set(
					{
						options: {
							is_closed: false
						}
					},
					{ merge: true }
				)
			helper.cache.updatePollChannel()
			helper.respond(new ResponseBuilder(Emoji.GOOD, "Poll reopened"))
		} else {
			helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"Only the creator of the Poll or admins can reopen the Poll!"
				)
			)
		}
	}
}

export default file

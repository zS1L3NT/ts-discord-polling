import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { Emoji, iButtonFile, ResponseBuilder } from "discordjs-nova"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const poll_id = helper.interaction.message.embeds[0]!.fields!.find(
			field => field.name === "ID"
		)!.value

		const vote = helper.cache.votes.find(
			res =>
				res.value.poll_id === poll_id &&
				res.value.user_id === helper.interaction.user.id
		)

		if (vote) {
			await helper.cache.ref
				.collection("votes")
				.doc(vote.value.id)
				.delete()
			helper.respond(new ResponseBuilder(Emoji.GOOD, "Vote removed"))
		} else {
			helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"You didn't respond to this poll"
				)
			)
		}
	}
}

export default file

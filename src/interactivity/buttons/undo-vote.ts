import Entry from "../../data/Entry"
import getPoll from "../../utilities/getPoll"
import GuildCache from "../../data/GuildCache"
import { Emoji, iButtonFile, ResponseBuilder } from "nova-bot"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const poll = getPoll(helper)

		const vote = helper.cache.votes.find(
			res =>
				res.value.poll_id === poll.value.id &&
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
					"You didn't respond to this Poll"
				)
			)
		}
	}
}

export default file

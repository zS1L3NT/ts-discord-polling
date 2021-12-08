import admin from "firebase-admin"
import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import Vote from "../models/Vote"
import { Emoji, iMenuFile, ResponseBuilder } from "discordjs-nova"

const file: iMenuFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const [pollId, name] = helper.value()!.split("-")

		const poll = helper.cache.polls.find(poll => poll.value.id === pollId)!
		const vote = helper.cache.votes.find(
			res =>
				res.value.poll_id === pollId &&
				res.value.user_id === helper.interaction.user.id
		)

		if (vote) {
			if (poll.value.options.is_multi_choice) {
				if (vote.value.names.includes(name)) {
					helper.respond(
						new ResponseBuilder(
							Emoji.BAD,
							"Already Voted this option"
						)
					)
				} else {
					await helper.cache.ref
						.collection("votes")
						.doc(vote.value.id)
						.update({
							keys: admin.firestore.FieldValue.arrayUnion(name)
						})
					helper.respond(
						new ResponseBuilder(Emoji.GOOD, "Vote saved")
					)
				}
			} else {
				helper.respond(
					new ResponseBuilder(
						Emoji.BAD,
						"You already responded to this Poll"
					)
				)
			}
		} else {
			await helper.cache.setVote(
				new Vote({
					id: helper.cache.ref.collection("votes").doc().id,
					user_id: helper.interaction.user.id,
					poll_id: pollId,
					names: [name]
				})
			)
			helper.respond(new ResponseBuilder(Emoji.GOOD, "Vote saved"))
		}
	}
}

export default file

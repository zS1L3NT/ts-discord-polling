import admin from "firebase-admin"
import EmbedResponse, { Emoji } from "./EmbedResponse"
import ButtonHelper from "./ButtonHelper"
import Vote from "../models/Vote"

export default class DynamicButton {
	private readonly helper: ButtonHelper

	public constructor(helper: ButtonHelper) {
		this.helper = helper
	}

	public async run() {
		const helper = this.helper

		const parts = helper.interaction.customId.split("-")
		if (parts.length !== 2) return

		const [poll_id, key] = parts
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)
		if (!poll) return

		const vote = helper.cache.votes.find(res =>
			res.value.poll_id === poll_id &&
			res.value.user_id === helper.interaction.user.id
		)

		if (vote) {
			if (poll.value.options.is_multi_choice) {
				if (vote.value.keys.includes(key)) {
					helper.respond(new EmbedResponse(
						Emoji.BAD,
						"Already voted this option"
					))
				}
				else {
					await helper.cache.ref
						.collection("votes")
						.doc(vote.value.id)
						.update({
							keys: admin.firestore.FieldValue.arrayUnion(key)
						})
					helper.respond(new EmbedResponse(
						Emoji.GOOD,
						"Vote saved"
					))
				}
			}
			else {
				helper.respond(new EmbedResponse(
					Emoji.BAD,
					"You already responded to this poll"
				))
			}
		}
		else {
			await helper.cache.setVote(new Vote({
				id: helper.cache.ref.collection("votes").doc().id,
				user_id: helper.interaction.user.id,
				poll_id,
				keys: [key]
			}))
			helper.respond(new EmbedResponse(
				Emoji.GOOD,
				"Vote saved"
			))
		}
	}

}
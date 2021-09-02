import admin from "firebase-admin"
import ButtonHelper from "./ButtonHelper"
import Response from "../models/Response"

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

		const response = helper.cache.responses.find(res =>
			res.value.poll_id === poll_id &&
			res.value.user_id === helper.interaction.user.id
		)

		if (response) {
			if (poll.value.options.is_multi_choice) {
				if (response.value.keys.includes(key)) {
					helper.respond("❓ Already voted this option")
				}
				else {
					await helper.cache.ref
						.collection("responses")
						.doc(response.value.id)
						.update({
							keys: admin.firestore.FieldValue.arrayUnion(key)
						})
					helper.respond("✅ Response saved")
				}
			}
			else {
				helper.respond("❌ You already responded to this poll")
			}
		}
		else {
			await helper.cache.setResponse(new Response({
				id: helper.cache.ref.collection("responses").doc().id,
				user_id: helper.interaction.user.id,
				poll_id,
				keys: [key]
			}))
			helper.respond("✅ Response saved")
		}
	}

}
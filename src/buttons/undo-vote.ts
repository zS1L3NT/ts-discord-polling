import { iButtonFile } from "../utilities/BotSetupHelper"

module.exports = {
	id: "undo-vote",
	execute: async helper => {
		const poll_id = helper.interaction.message.embeds[0]!.fields!.find(field => field.name === "ID")!.value

		const response = helper.cache.responses.find(res =>
			res.value.poll_id === poll_id &&
			res.value.user_id === helper.interaction.user.id
		)

		if (response) {
			await helper.cache.ref
				.collection("responses")
				.doc(response.value.id)
				.delete()
			helper.respond("✅ Response removed")
		} else {
			helper.respond("❌ You didn't respond to this poll")
		}
	}
} as iButtonFile
import { iButtonFile } from "../utilities/BotSetupHelper"
import { GuildMember } from "discord.js"

module.exports = {
	id: "close-poll",
	execute: async helper => {
		const poll_id = helper.interaction.message.embeds[0]!.fields!.find(field => field.name === "ID")!.value
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)!
		const member = helper.interaction.member as GuildMember

		if (
			helper.interaction.user.id === poll.value.author_id ||
			member.permissions.has("ADMINISTRATOR")
		) {
			await helper.cache.ref
				.collection("polls")
				.doc(poll_id)
				.set({
					options: {
						is_closed: true
					}
				}, { merge: true })
			helper.cache.updatePollChannel().then()
			helper.respond("✅ Poll closed")
		}
		else {
			helper.respond("❌ Only the creator of the poll or admins can close the poll!")
		}
	}
} as iButtonFile
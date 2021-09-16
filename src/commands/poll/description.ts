import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("description")
		.setDescription("Change the description of a poll")
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription("ID of the poll to edit. Can be found in every poll")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("description")
				.setDescription("Description of the poll")
				.setRequired(true)
		),
	execute: async helper => {
		const poll_id = helper.string("poll-id", true)!
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)
		if (!poll) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Poll doesn't exist"
			))
		}

		const description = helper.string("description", true)!
		await helper.cache.ref
			.collection("polls")
			.doc(poll_id)
			.set({
				description
			}, { merge: true })

		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"Poll description updated"
		))
	}
} as iInteractionSubcommandFile
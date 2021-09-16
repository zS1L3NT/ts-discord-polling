import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("title")
		.setDescription("Change the title of a poll")
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription("ID of the poll to edit. Can be found in every poll")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("title")
				.setDescription("Title of the poll")
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

		const title = helper.string("title", true)!
		await helper.cache.ref
			.collection("polls")
			.doc(poll_id)
			.set({
				title
			}, { merge: true })

		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"Poll title updated"
		))
	}
} as iInteractionSubcommandFile
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("choice")
		.setDescription("Change the description of a choice. Key is unchangeable")
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription("ID of the poll to edit. Can be found in every poll")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("key")
				.setDescription("The short form / identifying keyword of the choice to edit")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("description")
				.setDescription("The new description of the choice")
				.setRequired(false)
		),
	execute: async helper => {
		const poll_id = helper.string("poll-id")!
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)
		if (!poll) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Poll doesn't exist"
			))
		}

		const key = helper.string("key")!
		if (poll.value.choices[key] === undefined) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Poll doesn't have a choice with that key"
			))
		}

		const description = helper.string("description")
		await helper.cache.ref
			.collection("polls")
			.doc(poll_id)
			.set({
				choices: {
					[key]: description
				}
			}, { merge: true })

		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"Poll choice updated"
		))
	}
} as iInteractionSubcommandFile
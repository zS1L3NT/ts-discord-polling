import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("description")
		.setDescription("Change the description of a poll")
		.addStringOption(option =>
			option
				.setName("description")
				.setDescription("Description of the poll")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription(
					"ID of the poll to edit. If not provided, edits the draft instead"
				)
				.setRequired(false)
		),
	execute: async helper => {
		const poll_id = helper.string("poll-id")
		const description = helper.string("description")!

		if (poll_id) {
			const poll = helper.cache.polls.find(
				poll => poll.value.id === poll_id
			)
			if (!poll) {
				return helper.respond(
					new EmbedResponse(Emoji.BAD, "Poll doesn't exist")
				)
			}

			await helper.cache.ref.collection("polls").doc(poll_id).set(
				{
					description
				},
				{ merge: true }
			)

			helper.respond(
				new EmbedResponse(Emoji.GOOD, "Poll description updated")
			)
		} else {
			const draft = helper.cache.draft
			if (!draft) {
				return helper.respond(
					new EmbedResponse(Emoji.BAD, "No draft to edit")
				)
			}

			draft.value.description = description
			await helper.cache.getDraftDoc().set(
				{
					description
				},
				{ merge: true }
			)

			helper.respond({
				embeds: [
					new EmbedResponse(
						Emoji.GOOD,
						"Draft description updated"
					).create(),
					Poll.getDraftEmbed(draft, helper.cache)
				]
			})
		}
	}
} as iInteractionSubcommandFile

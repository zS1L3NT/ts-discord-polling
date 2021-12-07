import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import ResponseBuilder, { Emoji } from "../../utilities/ResponseBuilder"
import Poll from "../../models/Poll"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	builder: new SlashCommandSubcommandBuilder()
		.setName("title")
		.setDescription("Change the title of a poll")
		.addStringOption(option =>
			option
				.setName("title")
				.setDescription("Title of the poll")
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
		const title = helper.string("title")!

		if (poll_id) {
			const poll = helper.cache.polls.find(
				poll => poll.value.id === poll_id
			)
			if (!poll) {
				return helper.respond(
					new ResponseBuilder(Emoji.BAD, "Poll doesn't exist")
				)
			}

			await helper.cache.ref.collection("polls").doc(poll_id).set(
				{
					title
				},
				{ merge: true }
			)

			helper.respond(new ResponseBuilder(Emoji.GOOD, "Poll title updated"))
		} else {
			const draft = helper.cache.draft
			if (!draft) {
				return helper.respond(
					new ResponseBuilder(Emoji.BAD, "No draft to edit")
				)
			}

			draft.value.title = title
			await helper.cache.getDraftDoc().set(
				{
					title
				},
				{ merge: true }
			)

			helper.respond({
				embeds: [
					new ResponseBuilder(
						Emoji.GOOD,
						"Draft title updated"
					).create(),
					Poll.getDraftEmbed(draft, helper.cache)
				]
			})
		}
	}
}

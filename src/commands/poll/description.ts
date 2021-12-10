import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "nova-bot"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "description",
		description: {
			slash: "Change the description of a Poll",
			help: "Change the description of a Poll"
		},
		options: [
			{
				name: "description",
				description: {
					slash: "Description of the Poll",
					help: "Description of the Poll"
				},
				type: "string",
				requirements: "Text",
				required: true
			},
			{
				name: "poll-id",
				description: {
					slash: "ID of the Poll to edit",
					help: [
						"This is the ID of the Poll to edit",
						"Each Poll ID can be found in the Poll itself in the Poll channel"
					].join("\n")
				},
				type: "string",
				requirements: "Valid Poll ID",
				required: false,
				default: "Draft ID"
			}
		]
	},
	execute: async helper => {
		const pollId = helper.string("poll-id")
		const description = helper.string("description")!

		if (pollId) {
			const poll = helper.cache.polls.find(
				poll => poll.value.id === pollId
			)
			if (!poll) {
				return helper.respond(
					new ResponseBuilder(Emoji.BAD, "Poll doesn't exist")
				)
			}

			await helper.cache.ref.collection("polls").doc(pollId).set(
				{
					description
				},
				{ merge: true }
			)

			helper.respond(
				new ResponseBuilder(Emoji.GOOD, "Poll description updated")
			)
		} else {
			const draft = helper.cache.draft
			if (!draft) {
				return helper.respond(
					new ResponseBuilder(Emoji.BAD, "No draft to edit")
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
					new ResponseBuilder(
						Emoji.GOOD,
						"Draft description updated"
					).build(),
					Poll.getDraftEmbed(draft, helper.cache)
				]
			})
		}
	}
}

export default file

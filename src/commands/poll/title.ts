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
		name: "title",
		description: {
			slash: "Change the title of a Poll",
			help: "Change the title of a Poll"
		},
		options: [
			{
				name: "title",
				description: {
					slash: "Title of a Poll",
					help: "Title of a Poll"
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
		const title = helper.string("title")!

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
					title
				},
				{ merge: true }
			)

			helper.respond(
				new ResponseBuilder(Emoji.GOOD, "Poll title updated")
			)
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
					).build(),
					Poll.getDraftEmbed(draft, helper.cache)
				]
			})
		}
	}
}

export default file

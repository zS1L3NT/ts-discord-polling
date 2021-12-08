import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "discordjs-nova"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "choice-edit",
		description: {
			slash: "Change the description of a choice in the draft",
			help: "Change the description of a choice in the draft"
		},
		options: [
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
				required: true
			},
			{
				name: "name",
				description: {
					slash: "Name of the choice",
					help: "Name of the choice in the Poll to edit"
				},
				type: "string",
				requirements: "Valid Poll choice name",
				required: true
			},
			{
				name: "description",
				description: {
					slash: "New description of the choice",
					help: [
						"New description of the choice",
						"Leave this empty if you want to delete the description"
					].join("\n")
				},
				type: "string",
				requirements: "Text",
				required: false
			}
		]
	},
	execute: async helper => {
		const pollId = helper.string("poll-id")!
		const poll = helper.cache.polls.find(poll => poll.value.id === pollId)
		if (!poll) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Poll doesn't exist")
			)
		}

		const name = helper.string("name")!
		if (poll.value.choices[name] === undefined) {
			return helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"Poll doesn't have a choice with that name"
				)
			)
		}

		const description = helper.string("description")
		await helper.cache.ref
			.collection("polls")
			.doc(pollId)
			.set(
				{
					choices: {
						[name]: description
					}
				},
				{ merge: true }
			)

		helper.respond(new ResponseBuilder(Emoji.GOOD, "Poll choice updated"))
	}
}

export default file

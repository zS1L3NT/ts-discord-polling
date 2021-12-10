import admin from "firebase-admin"
import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "nova-bot"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "choice-remove",
		description: {
			slash: "Remove a choice from a Poll",
			help: "Remove a choice from a Poll by its name"
		},
		options: [
			{
				name: "name",
				description: {
					slash: "Name of the choice",
					help: "This is the name of the choice that will be removed"
				},
				type: "string",
				requirements: "Valid Poll choice name",
				required: true
			}
		]
	},
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "No draft to edit")
			)
		}

		const name = helper.string("name")!

		if (draft.value.choices[name] !== undefined) {
			delete draft.value.choices[name]
			await helper.cache.getDraftDoc().set(
				{
					choices: {
						[name]: admin.firestore.FieldValue.delete()
					}
				},
				{ merge: true }
			)

			helper.respond(new ResponseBuilder(Emoji.GOOD, "Choice removed"))
		} else {
			helper.respond(
				new ResponseBuilder(Emoji.BAD, "No choice with that name")
			)
		}
	}
}

export default file

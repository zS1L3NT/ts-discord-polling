import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "nova-bot"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "choice-add",
		description: {
			slash: "Add a choice to the list of choices in the draft",
			help: [
				"Add a choice to the list of choices in the draft",
				"You can have a maximum of 5 choices"
			].join("\n")
		},
		options: [
			{
				name: "name",
				description: {
					slash: "Name of the choice",
					help: "This is the main text of the choice and will appear in bigger text"
				},
				type: "string",
				requirements: "Text shorter than 80 characters",
				required: true
			},
			{
				name: "description",
				description: {
					slash: "Description of the choice",
					help: "This is the secondary text of the choice and will appear below the main text of the choice"
				},
				type: "string",
				requirements: "Text",
				required: false
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

		if (Object.keys(draft.value.choices).length === 5) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Cannot set more than 5 choices")
			)
		}

		const name = helper.string("name")!
		const description = helper.string("description")
		draft.value.choices[name] = description
		await helper.cache.getDraftDoc().set(
			{
				choices: {
					[name]: description
				}
			},
			{ merge: true }
		)

		helper.respond({
			embeds: [
				new ResponseBuilder(Emoji.GOOD, "Draft choice added").build(),
				Poll.buildDraft(draft, helper.cache)
			]
		})
	}
}

export default file

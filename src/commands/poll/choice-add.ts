import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "discordjs-nova"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	help: {
		description: [
			"Add an option for a poll to choose from.",
			"You can have a maximum of 5 choices"
		].join("\n"),
		params: [
			{
				name: "key",
				description: "",
				requirements: "",
				required: true,
			}
		]
	},
	builder: {
		name: "choice-add",
		description: "Add a choice to the list of choices",
		options: [
			{
				type: "string",
				name: "key",
				description:
					"The short form / identifying keyword of the choice. Limited to 80 characters",
				required: true
			},
			{
				type: "string",
				name: "string",
				description:
					"The description of the choice. No character limit",
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

		if (Object.keys(draft.value.choices).length === 5) {
			return helper.respond(
				new ResponseBuilder(Emoji.BAD, "Cannot set more than 5 choices")
			)
		}

		const key = helper.string("key")!
		const description = helper.string("description")
		draft.value.choices[key] = description
		await helper.cache.getDraftDoc().set(
			{
				choices: {
					[key]: description
				}
			},
			{ merge: true }
		)

		helper.respond({
			embeds: [
				new ResponseBuilder(Emoji.GOOD, "Draft choice added").create(),
				Poll.getDraftEmbed(draft, helper.cache)
			]
		})
	}
}

export default file

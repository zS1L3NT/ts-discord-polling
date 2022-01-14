import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "nova-bot"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "is-anonymous",
		description: {
			slash: "Changes whether users can see the results of a poll",
			help: "Changes whether users can see the results of a poll"
		},
		options: [
			{
				name: "is-anonymous",
				description: {
					slash: "If the Poll is anonymous",
					help: "If the Poll is anonymous"
				},
				type: "boolean",
				requirements: "-",
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

		const anonymous = helper.boolean("is-anonymous")!
		draft.value.options.is_anonymous = anonymous
		await helper.cache.getDraftDoc().set(
			{
				options: {
					is_anonymous: anonymous
				}
			},
			{ merge: true }
		)

		helper.respond({
			embeds: [
				new ResponseBuilder(Emoji.GOOD, "Draft updated").build(),
				Poll.buildDraft(draft, helper.cache)
			]
		})
	}
}

export default file

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
	data: {
		name: "is-multi-choice",
		description: {
			slash: "Changes whether a Poll allows multiple choices",
			help: "Changes whether a Poll allows users to choose multiple choices"
		},
		options: [
			{
				name: "is-multi-choice",
				description: {
					slash: "If the Poll is multi-choice",
					help: "If the Poll is multi-choice"
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

		const multi_choice = helper.boolean("multi-choice")!
		draft.value.options.is_multi_choice = multi_choice
		await helper.cache.getDraftDoc().set(
			{
				options: {
					is_multi_choice: multi_choice
				}
			},
			{ merge: true }
		)

		helper.respond({
			embeds: [
				new ResponseBuilder(Emoji.GOOD, "Draft updated").build(),
				Poll.getDraftEmbed(draft, helper.cache)
			]
		})
	}
}

export default file

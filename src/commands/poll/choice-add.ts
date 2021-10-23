import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("choice-add")
		.setDescription("Add a choice to the list of choices")
		.addStringOption(option =>
			option
				.setName("key")
				.setDescription("The short form / identifying keyword of the choice. Limited to 80 characters")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("description")
				.setDescription("The description of the choice. No character limit")
				.setRequired(false)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"No draft to edit"
			))
		}

		if (Object.keys(draft.value.choices).length === 5) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Cannot set more than 5 choices"
			))
		}

		const key = helper.string("key")!
		const description = helper.string("description")
		draft.value.choices[key] = description
		await helper.cache.getDraftDoc().set({
			choices: {
				[key]: description
			}
		}, { merge: true })

		helper.respond({
			embeds: [
				new EmbedResponse(Emoji.GOOD, "Draft choice added").create(),
				Poll.getDraftEmbed(draft, helper.cache)
			]
		})
	}
} as iInteractionSubcommandFile
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
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
				.setName("value")
				.setDescription("The description of the choice. No character limit")
				.setRequired(false)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to edit")
		}

		if (Object.keys(draft.value.choices).length === 5) {
			return helper.respond("❌ Cannot set more than 5 choices")
		}

		const key = helper.string("key", true)!
		const value = helper.string("value")
		draft.value.choices[key] = value
		await helper.cache.getDraftDoc().set({
			choices: {
				[key]: value
			}
		}, { merge: true })

		helper.respond({
			content: "✅ Draft choice added",
			embeds: [Poll.getDraftEmbed(draft, helper.cache)]
		})
	}
} as iInteractionSubcommandFile
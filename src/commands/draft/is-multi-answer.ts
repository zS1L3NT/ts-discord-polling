import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("is-multi-choice")
		.setDescription("Multi-choice polls let you choose multiple options")
		.addBooleanOption(option =>
			option
				.setName("multi-choice")
				.setDescription("If the poll is multi-choice")
				.setRequired(true)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to edit")
		}

		const multi_choice = helper.boolean("multi-choice", true)!
		draft.value.options.is_multi_choice = multi_choice
		await helper.cache.getDraftDoc().set({
			options: {
				is_multi_choice: multi_choice
			}
		}, { merge: true })

		helper.respond({
			content: "✅ Draft updated",
			embeds: [Poll.getDraftEmbed(draft, helper.cache)]
		})
	}
} as iInteractionSubcommandFile
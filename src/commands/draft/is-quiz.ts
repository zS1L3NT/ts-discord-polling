import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("is-quiz")
		.setDescription("Quiz polls have right and wrong answers")
		.addBooleanOption(option =>
			option
				.setName("quiz")
				.setDescription("If the poll is quiz")
				.setRequired(true)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to edit")
		}

		const quiz = helper.boolean("quiz", true)!
		draft.value.options.is_quiz = quiz
		await helper.cache.getDraftDoc().set({
			options: {
				is_quiz: quiz
			}
		}, { merge: true })

		helper.respond({
			content: "✅ Draft updated",
			embeds: [Poll.getDraftEmbed(draft, helper.cache)]
		})
	}
} as iInteractionSubcommandFile
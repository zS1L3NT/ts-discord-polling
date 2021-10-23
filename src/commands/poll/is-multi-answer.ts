import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
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
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"No draft to edit"
			))
		}

		const multi_choice = helper.boolean("multi-choice")!
		draft.value.options.is_multi_choice = multi_choice
		await helper.cache.getDraftDoc().set({
			options: {
				is_multi_choice: multi_choice
			}
		}, { merge: true })

		helper.respond({
			embeds: [
				new EmbedResponse(Emoji.GOOD, "Draft updated").create(),
				Poll.getDraftEmbed(draft, helper.cache)
			]
		})
	}
} as iInteractionSubcommandFile
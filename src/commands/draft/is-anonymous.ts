import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("is-anonymous")
		.setDescription("Anonymous polls prevent users from specifically seeing what each user voted")
		.addBooleanOption(option =>
			option
				.setName("anonymous")
				.setDescription("If the poll is anonymous")
				.setRequired(true)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to edit")
		}

		const anonymous = helper.boolean("anonymous", true)!
		draft.value.options.is_anonymous = anonymous
		await helper.cache.getDraftDoc().set({
			options: {
				is_anonymous: anonymous
			}
		}, { merge: true })

		helper.respond({
			content: "✅ Draft updated",
			embeds: [Poll.getDraftEmbed(draft, helper.cache)]
		})
	}
} as iInteractionSubcommandFile
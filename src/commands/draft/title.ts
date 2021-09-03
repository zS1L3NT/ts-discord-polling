import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("title")
		.setDescription("Change the title of the existing draft")
		.addStringOption(option =>
			option
				.setName("title")
				.setDescription("Title of the draft")
				.setRequired(true)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to edit")
		}

		const title = helper.string("title", true)!
		draft.value.title = title
		await helper.cache.getDraftDoc().set({
			title
		}, { merge: true })

		helper.respond({
			content: "✅ Draft title updated",
			embeds: [Poll.getDraftEmbed(draft, helper.cache)]
		})
	}
} as iInteractionSubcommandFile
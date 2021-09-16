import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("description")
		.setDescription("Change the description of the existing draft")
		.addStringOption(option =>
			option
				.setName("description")
				.setDescription("Description of the draft")
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

		const description = helper.string("description", true)!
		draft.value.description = description
		await helper.cache.getDraftDoc().set({
			description
		}, { merge: true })

		helper.respond({
			embeds: [
				new EmbedResponse(Emoji.GOOD, "Draft description updated").create(),
				Poll.getDraftEmbed(draft, helper.cache)
			]
		})
	}
} as iInteractionSubcommandFile
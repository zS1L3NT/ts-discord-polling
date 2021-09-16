import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Create a draft of a poll to make changes to"),
	execute: async helper => {
		const draft = helper.cache.draft
		if (draft) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				`Discard the existing draft before creating a new one`
			))
		}

		const poll = Poll.getEmpty()
		poll.value.id = "draft"

		await helper.cache.ref
			.collection("polls")
			.doc("draft")
			.set(poll.value)
		helper.cache.draft = poll

		helper.respond({
			embeds: [
				new EmbedResponse(Emoji.GOOD, `Created draft`).create(),
				Poll.getDraftEmbed(helper.cache.draft, helper.cache)
			]
		})
	}
} as iInteractionSubcommandFile
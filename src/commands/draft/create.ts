import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Create a draft of a poll to make changes to"),
	execute: async helper => {
		const draft = helper.cache.draft
		if (draft) {
			return helper.respond(
				`❌ Discard the existing draft before creating a new one`
			)
		}

		const poll = Poll.getEmpty()
		poll.value.id = "draft"

		await helper.cache.ref
			.collection("polls")
			.doc("draft")
			.set(poll.value)
		helper.cache.draft = poll

		helper.respond({
			content: `✅ Created draft`,
			embeds: [await Poll.getDraftDisplay(helper.cache.draft, helper.cache.guild.members)]
		})
	}
} as iInteractionSubcommandFile
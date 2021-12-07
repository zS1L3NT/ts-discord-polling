import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import ResponseBuilder, { Emoji } from "../../utilities/ResponseBuilder"
import Poll from "../../models/Poll"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	builder: new SlashCommandSubcommandBuilder()
		.setName("draft-create")
		.setDescription("Create a draft of a poll to make changes to"),
	execute: async helper => {
		const draft = helper.cache.draft
		if (draft) {
			return helper.respond(new ResponseBuilder(
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
				new ResponseBuilder(Emoji.GOOD, `Created draft`).create(),
				Poll.getDraftEmbed(helper.cache.draft, helper.cache)
			]
		})
	}
}
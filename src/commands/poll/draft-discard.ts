import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import ResponseBuilder, { Emoji } from "../../utilities/ResponseBuilder"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	builder: new SlashCommandSubcommandBuilder()
		.setName("draft-discard")
		.setDescription("Discard the existing draft"),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond(new ResponseBuilder(
				Emoji.BAD,
				"No draft to discard"
			))
		}
		
		delete helper.cache.draft
		await helper.cache.getDraftDoc().delete()

		helper.respond(new ResponseBuilder(
			Emoji.GOOD,
			"Draft discarded"
		))
	}
}
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	builder: new SlashCommandSubcommandBuilder()
		.setName("draft-show")
		.setDescription("Show the current draft"),
	execute: async helper => {
		helper.respond({
			embeds: [Poll.getDraftEmbed(helper.cache.draft, helper.cache)]
		})
	}
}

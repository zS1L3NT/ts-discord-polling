import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("draft-show")
		.setDescription("Show the current draft"),
	execute: async helper => {
		helper.respond({
			embeds: [Poll.getDraftEmbed(helper.cache.draft, helper.cache)]
		})
	}
} as iInteractionSubcommandFile

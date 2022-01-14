import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import { iInteractionSubcommandFile } from "nova-bot"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "show",
		description: {
			slash: "Show the current draft",
			help: "Shows the current draft"
		}
	},
	execute: async helper => {
		helper.respond({
			embeds: [Poll.buildDraft(helper.cache.draft, helper.cache)]
		})
	}
}

export default file

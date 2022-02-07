import Entry from "../../../data/Entry"
import GuildCache from "../../../data/GuildCache"
import Poll from "../../../data/Poll"
import { iSlashSubFile } from "nova-bot"

const file: iSlashSubFile<Entry, GuildCache> = {
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

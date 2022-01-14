import ButtonHelper from "nova-bot/dist/helpers/ButtonHelper"
import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"

export default (helper: ButtonHelper<Entry, GuildCache>) =>
	helper.cache.polls.find(
		poll =>
			poll.value.id ===
			helper.interaction.message.embeds[0]!.fields!.find(
				field => field.name === "ID"
			)!.value
	)!

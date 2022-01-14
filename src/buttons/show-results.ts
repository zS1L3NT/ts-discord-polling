import Entry from "../models/Entry"
import getPoll from "../utilities/getPoll"
import GuildCache from "../models/GuildCache"
import ResultsBuilder from "../utilities/ResultsBuilder"
import { iButtonFile } from "nova-bot"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const poll = getPoll(helper)
		const votes = helper.cache.votes.filter(
			v => v.value.poll_id === poll.value.id
		)

		helper.respond(
			new ResultsBuilder(poll, votes).build()
		)
	}
}

export default file

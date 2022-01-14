import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import ResultsBuilder from "../utilities/ResultsBuilder"
import { iMenuFile } from "nova-bot"

const file: iMenuFile<Entry, GuildCache> = {
	defer: false,
	ephemeral: true,
	execute: async helper => {
		const [pollId, ...rest] = helper.value()!.split("-")
		const poll = helper.cache.polls.find(poll => poll.value.id === pollId)!
		const choice = rest.join("-")

		const votes = helper.cache.votes.filter(
			v => v.value.poll_id === poll.value.id
		)

		helper.update(new ResultsBuilder(poll, votes).build(choice))
	}
}

export default file

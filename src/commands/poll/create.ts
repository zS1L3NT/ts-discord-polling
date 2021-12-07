import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "discordjs-nova"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "create",
		description: {
			slash: "Create a draft of a Poll to make changes to",
			help: [
				"Creates a draft for a Peminder that you should make changes to",
				"Use `reminder show` to see the draft"
			].join("\n")
		}
	},
	execute: async helper => {
		const draft = helper.cache.draft
		if (draft) {
			return helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					`Discard the existing draft before creating a new one`
				)
			)
		}

		const poll = Poll.getEmpty()
		poll.value.id = "draft"

		await helper.cache.ref.collection("polls").doc("draft").set(poll.value)
		helper.cache.draft = poll

		helper.respond({
			embeds: [
				new ResponseBuilder(Emoji.GOOD, `Created draft`).build(),
				Poll.getDraftEmbed(helper.cache.draft, helper.cache)
			]
		})
	}
}

export default file

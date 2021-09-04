import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("choice")
		.setDescription("Change the description of a choice. Key is unchangeable")
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription("ID of the poll to edit. Can be found in every poll")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("key")
				.setDescription("The short form / identifying keyword of the choice to edit")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("value")
				.setDescription("The new description of the choice")
				.setRequired(false)
		),
	execute: async helper => {
		const poll_id = helper.string("poll-id", true)!
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)
		if (!poll) {
			return helper.respond("❌ Poll doesn't exist")
		}

		const key = helper.string("key", true)!
		if (poll.value.choices[key] === undefined) {
			return helper.respond("❌ Poll doesn't have a choice with that key")
		}

		const value = helper.string("value")
		await helper.cache.ref
			.collection("polls")
			.doc(poll_id)
			.set({
				choices: {
					[key]: value
				}
			}, { merge: true })

		helper.respond("✅ Poll choice updated")
	}
} as iInteractionSubcommandFile
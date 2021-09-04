import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import DateHelper from "../../utilities/DateHelper"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("date")
		.setDescription("Change the closing date of a poll")
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription("ID of the poll to edit. Can be found in every poll")
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option
				.setName("day")
				.setDescription("Day of the month from 1 - 31")
				.setRequired(false)
		)
		.addIntegerOption(option =>
			option
				.setName("month")
				.setDescription("Month")
				.setRequired(false)
				.addChoices(
					DateHelper.name_of_months.map(name => [
						name,
						DateHelper.name_of_months.indexOf(name)
					])
				)
		)
		.addIntegerOption(option =>
			option
				.setName("year")
				.setDescription("Year")
				.setRequired(false)
		)
		.addIntegerOption(option =>
			option
				.setName("hour")
				.setDescription("Hour in 24h format from 0 - 23")
				.setRequired(false)
		)
		.addIntegerOption(option =>
			option
				.setName("minute")
				.setDescription("Minute")
				.setRequired(false)
		),
	execute: async helper => {
		const poll_id = helper.string("poll-id", true)!
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)
		if (!poll) {
			return helper.respond("❌ Poll doesn't exist")
		}

		const date = new Date(poll.value.closing_date)

		const day = helper.integer("day")
		const month = helper.integer("month")
		const year = helper.integer("year")
		const hour = helper.integer("hour")
		const minute = helper.integer("minute")

		if (!day && !month && !year && !hour && !minute) {
			return helper.respond("❌ You must update at least 1 part of the closing date")
		}

		let closing_date: number
		try {
			closing_date = DateHelper.verify(
				day ?? date.getDate(),
				month ?? date.getMonth(),
				year ?? date.getFullYear(),
				hour ?? date.getHours(),
				minute ?? date.getMinutes()
			).getTime()
		} catch (err) {
			return helper.respond(`❌ ${err.message}`)
		}

		await helper.cache.ref
			.collection("polls")
			.doc(poll_id)
			.set({
				closing_date
			}, { merge: true })

		helper.respond("✅ Poll closing date updated")
	}
} as iInteractionSubcommandFile
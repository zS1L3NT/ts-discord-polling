import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import DateHelper from "../../utilities/DateHelper"
import { useTry } from "no-try"
import { DateTime } from "luxon"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("closing-date")
		.setDescription(
			"Change the closing date of a poll. Leave empty to unset closing date"
		)
		.addStringOption(option =>
			option
				.setName("poll-id")
				.setDescription(
					"ID of the poll to edit. If not provided, edits the draft instead"
				)
				.setRequired(false)
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
			option.setName("year").setDescription("Year").setRequired(false)
		)
		.addIntegerOption(option =>
			option
				.setName("hour")
				.setDescription("Hour in 24h format from 0 - 23")
				.setRequired(false)
		)
		.addIntegerOption(option =>
			option.setName("minute").setDescription("Minute").setRequired(false)
		),
	execute: async helper => {
		const poll_id = helper.string("poll-id")
		const day = helper.integer("day")
		const month = helper.integer("month")
		const year = helper.integer("year")
		const hour = helper.integer("hour")
		const minute = helper.integer("minute")

		if (poll_id) {
			const poll = helper.cache.polls.find(
				poll => poll.value.id === poll_id
			)
			if (!poll) {
				return helper.respond(
					new EmbedResponse(Emoji.BAD, "Poll doesn't exist")
				)
			}
			if (
				!poll.value.closing_date &&
				(!day || !month || !year || !hour || !minute)
			) {
				return helper.respond(
					new EmbedResponse(
						Emoji.BAD,
						"Set a full closing date before leaving out other date fields!"
					)
				)
			}

			const [err, closing_date] = useTry(() => {
				if (!day && !month && !year && !hour && !minute) {
					return null
				}
				const date = DateTime.fromMillis(
					poll.value.closing_date || 0
				).setZone("Asia/Singapore")
				return DateHelper.verify(
					day ?? date.day,
					month ?? date.month - 1,
					year ?? date.year,
					hour ?? date.hour,
					minute ?? date.minute
				).toMillis()
			})

			if (err) {
				return helper.respond(
					new EmbedResponse(Emoji.BAD, `${err.message}`)
				)
			}

			await helper.cache.ref
				.collection("polls")
				.doc(poll_id)
				.set({ closing_date }, { merge: true })

			helper.respond(
				new EmbedResponse(Emoji.GOOD, "Poll closing date updated")
			)
		} else {
			const draft = helper.cache.draft
			if (!draft) {
				return helper.respond(
					new EmbedResponse(Emoji.BAD, "No draft to edit")
				)
			}

			const [err, closing_date] = useTry(() => {
				if (!day && !month && !year && !hour && !minute) {
					return null
				}
				const date = DateTime.fromMillis(
					draft.value.closing_date || 0
				).setZone("Asia/Singapore")
				return DateHelper.verify(
					day ?? date.day,
					month ?? date.month - 1,
					year ?? date.year,
					hour ?? date.hour,
					minute ?? date.minute
				).toMillis()
			})

			if (err) {
				return helper.respond(
					new EmbedResponse(Emoji.BAD, `${err.message}`)
				)
			}

			draft.value.closing_date = closing_date
			await helper.cache
				.getDraftDoc()
				.set({ closing_date }, { merge: true })

			helper.respond({
				embeds: [
					new EmbedResponse(
						Emoji.GOOD,
						"Draft closing date updated"
					).create(),
					Poll.getDraftEmbed(draft, helper.cache)
				]
			})
		}
	}
} as iInteractionSubcommandFile

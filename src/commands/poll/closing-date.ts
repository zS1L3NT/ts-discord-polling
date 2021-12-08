import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import Poll from "../../models/Poll"
import {
	DateHelper,
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "discordjs-nova"
import { DateTime } from "luxon"
import { useTry } from "no-try"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "closing-date",
		description: {
			slash: "Change the closing date of a Poll",
			help: [
				"Change the closing date of a Poll",
				"You can change specific parts of the closing date"
			].join("\n")
		},
		options: [
			{
				name: "poll-id",
				description: {
					slash: "ID of the Poll to edit",
					help: [
						"This is the ID of the Poll to edit",
						"Each Poll ID can be found in the Poll itself in the Poll channel"
					].join("\n")
				},
				type: "string",
				requirements: "Valid Poll ID",
				required: true
			},
			{
				name: "day",
				description: {
					slash: "Day",
					help: "Day of the month for the Poll"
				},
				type: "number",
				requirements:
					"Number between 1 ~ 30 or 31, depending on the `month`",
				required: false,
				default: "Current value in the Poll"
			},
			{
				name: "month",
				description: {
					slash: "Month",
					help: "Month of the year for the Poll"
				},
				type: "number",
				requirements: "Month",
				required: false,
				default: "Current value in the Poll",
				choices: DateHelper.name_of_months.map(name => ({
					name,
					value: DateHelper.name_of_months.indexOf(name)
				}))
			},
			{
				name: "year",
				description: {
					slash: "Year",
					help: "Year for the Poll"
				},
				type: "number",
				requirements:
					"Number that isn't more than 5 years more than the current year",
				required: false,
				default: "Current value in the Poll"
			},
			{
				name: "hour",
				description: {
					slash: "Hour",
					help: "Hour of the day for the Poll"
				},
				type: "number",
				requirements: "Number between 0 ~ 23",
				required: false,
				default: "Current value in the Poll"
			},
			{
				name: "minute",
				description: {
					slash: "Minute",
					help: "Minute of the hour for the Poll"
				},
				type: "number",
				requirements: "Number between 0 ~ 59",
				required: false,
				default: "Current value in the Poll"
			}
		]
	},
	execute: async helper => {
		const pollId = helper.string("poll-id")
		const day = helper.integer("day")
		const month = helper.integer("month")
		const year = helper.integer("year")
		const hour = helper.integer("hour")
		const minute = helper.integer("minute")

		if (pollId) {
			const poll = helper.cache.polls.find(
				poll => poll.value.id === pollId
			)
			if (!poll) {
				return helper.respond(
					new ResponseBuilder(Emoji.BAD, "Poll doesn't exist")
				)
			}
			if (
				!poll.value.closing_date &&
				(!day || !month || !year || !hour || !minute)
			) {
				return helper.respond(
					new ResponseBuilder(
						Emoji.BAD,
						"Set a full closing date before leaving out other date fields!"
					)
				)
			}

			const [err, closingDate] = useTry(() => {
				if (!day && !month && !year && !hour && !minute) {
					return null
				}
				const date = DateTime.fromMillis(
					poll.value.closing_date || Date.now()
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
					new ResponseBuilder(Emoji.BAD, `${err.message}`)
				)
			}

			await helper.cache.ref
				.collection("polls")
				.doc(pollId)
				.set({ closing_date: closingDate }, { merge: true })

			helper.respond(
				new ResponseBuilder(Emoji.GOOD, "Poll closing date updated")
			)
		} else {
			const draft = helper.cache.draft
			if (!draft) {
				return helper.respond(
					new ResponseBuilder(Emoji.BAD, "No draft to edit")
				)
			}

			const [err, closingDate] = useTry(() => {
				if (!day && !month && !year && !hour && !minute) {
					return null
				}
				const date = DateTime.fromMillis(
					draft.value.closing_date || Date.now()
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
					new ResponseBuilder(Emoji.BAD, `${err.message}`)
				)
			}

			draft.value.closing_date = closingDate
			await helper.cache
				.getDraftDoc()
				.set({ closing_date: closingDate }, { merge: true })

			helper.respond({
				embeds: [
					new ResponseBuilder(
						Emoji.GOOD,
						"Draft closing date updated"
					).build(),
					Poll.getDraftEmbed(draft, helper.cache)
				]
			})
		}
	}
}

export default file

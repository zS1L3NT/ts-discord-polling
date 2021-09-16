import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"
import DateHelper from "../../utilities/DateHelper"
import Poll from "../../models/Poll"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("closing-date")
		.setDescription("Change the closing date of the existing draft. Leave empty to unset closing date")
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
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"No draft to edit"
			))
		}

		const day = helper.integer("day")
		const month = helper.integer("month")
		const year = helper.integer("year")
		const hour = helper.integer("hour")
		const minute = helper.integer("minute")

		let closing_date: number | null
		if (!day && !month && !year && !hour && !minute) {
			closing_date = null
		}
		else if (!draft.value.closing_date && (!day || !month || !year || !hour || !minute)) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Set a full closing date before leaving out other date fields!"
			))
		}
		else {
			const date = new Date(draft.value.closing_date ?? 0)
			try {
				closing_date = DateHelper.verify(
					day ?? date.getDate(),
					month ?? date.getMonth(),
					year ?? date.getFullYear(),
					hour ?? date.getHours(),
					minute ?? date.getMinutes()
				).getTime()
			} catch (err) {
				return helper.respond(new EmbedResponse(
					Emoji.BAD,
					`${err.message}`
				))
			}
		}

		draft.value.closing_date = closing_date
		await helper.cache.getDraftDoc().set({
			closing_date
		}, { merge: true })

		helper.respond({
			embeds: [
				new EmbedResponse(Emoji.GOOD, "Draft closing date updated").create(),
				Poll.getDraftEmbed(draft, helper.cache)
			]
		})
	}
} as iInteractionSubcommandFile
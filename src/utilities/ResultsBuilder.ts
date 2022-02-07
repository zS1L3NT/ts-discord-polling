import Poll from "../data/Poll"
import Vote from "../data/Vote"
import {
	MessageActionRow,
	MessageEmbed,
	MessageOptions,
	MessageSelectMenu
} from "discord.js"

export default class ResultsBuilder {
	public constructor(private poll: Poll, private votes: Vote[]) {}

	public build(choice?: string): MessageOptions {
		const embed = new MessageEmbed().setTitle(
			`__${this.poll.value.title}__`
		)

		if (choice) {
			const votes = this.votes.filter(v => v.value.names.includes(choice))
			embed.setDescription(
				[
					`**${this.poll.value.description}**`,
					"",
					`Votes for **${choice}**`,
					...votes.map(vote => `<@!${vote.value.user_id}>`)
				].join("\n")
			)
		} else {
			embed.setDescription(
				[
					`**${this.poll.value.description}**`,
					"",
					"Select a choice to see the votes for it"
				].join("\n")
			)
		}

		return {
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId("show-result")
						.setPlaceholder("Choose an option")
						.addOptions(
							this.poll.getNames().map(choice => ({
								label: choice,
								value: `${this.poll.value.id}-${choice}`
							}))
						)
				)
			]
		}
	}
}

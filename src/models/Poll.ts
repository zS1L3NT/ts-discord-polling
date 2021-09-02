import { GuildMemberManager, MessageActionRow, MessageButton, MessageEmbed, MessageOptions } from "discord.js"
import DateFunctions from "../utilities/DateFunctions"
import QuickChart from "quickchart-js"
import GuildCache from "./GuildCache"

export interface iPoll {
	id: string
	date: number
	author_id: string
	title: string
	description: string
	options: { [key: string]: string }
}

export default class Poll {
	public value: iPoll

	public constructor(value: iPoll) {
		this.value = value
	}

	public static getEmpty(): Poll {
		return new Poll({
			id: "",
			date: 0,
			author_id: "",
			title: "",
			description: "",
			options: {}
		})
	}

	public static async getDraftDisplay(poll: Poll | undefined, members: GuildMemberManager): Promise<MessageEmbed> {
		const embed = new MessageEmbed()
		const emojis = [
			"1️⃣",
			"2️⃣",
			"3️⃣",
			"4️⃣",
			"5️⃣"
		]

		if (poll) {
			const member = await members.fetch(poll.value.author_id)
			if (member) {
				embed.setAuthor(member.displayName, member.user.displayAvatarURL())
			}

			embed.setTitle(`__${poll.value.title}__`)
			embed.addField(poll.value.description, "\u200B")

			let i = 0
			for (const key of Object.keys(poll.value.options).sort()) {
				const value = poll.value.options[key]
				i++

				if (i === Object.keys(poll.value.options).length) {
					embed.addField(`${emojis[i - 1]} ${key}`, value + "\n\u200B")
				}
				else {
					embed.addField(`${emojis[i - 1]} ${key}`, value)
				}
			}

			const date = new DateFunctions(poll.value.date)
			embed.addField("Closing date", date.getDueDate())
			embed.addField("Closing in", date.getDueIn())
		}
		else {
			embed.setTitle("No draft")
		}

		return embed
	}

	public async getMessagePayload(cache: GuildCache): Promise<MessageOptions> {
		const chart = new QuickChart()
		const keys = Object.keys(this.value.options).sort()
		chart.setBackgroundColor("#2F3136")
		chart.setConfig({
			type: "outlabeledPie",
			data: {
				labels: keys,
				datasets: [{
					backgroundColor: ["#FF3784", "#36A2EB", "#4BC0C0", "#F77825", "#9966FF"],
					data: [24, 2, 1, 25, 48]
				}]
			},
			options: {
				plugins: {
					legend: false,
					outlabels: {
						text: "%l %p",
						color: "white",
						stretch: 35,
						font: {
							resizable: true,
							minSize: 15,
							maxSize: 20
						}
					}
				}
			}
		})

		return {
			content: "\u200B",
			embeds: [
				(await Poll.getDraftDisplay(this, cache.guild.members))
					.setImage(chart.getUrl())
			],
			components: [
				new MessageActionRow()
					.addComponents(
						keys.map(key => new MessageButton()
							.setLabel(key)
							.setStyle("PRIMARY")
							.setCustomId(`${this.value.id}-${key}`))
					),
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Close poll")
							.setStyle("DANGER")
							.setCustomId("close-poll")
							.setEmoji("❎"),
						new MessageButton()
							.setLabel("Undo my vote")
							.setStyle("SECONDARY")
							.setCustomId("undo-vote")
							.setEmoji("↩️"),
						new MessageButton()
							.setLabel("Show my vote")
							.setStyle("SUCCESS")
							.setCustomId("show-vote")
							.setEmoji("👁️")
					)
			]
		}
	}
}
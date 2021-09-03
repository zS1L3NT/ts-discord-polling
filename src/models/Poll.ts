import { MessageActionRow, MessageButton, MessageEmbed, MessageOptions } from "discord.js"
import DateHelper from "../utilities/DateHelper"
import QuickChart from "quickchart-js"
import GuildCache from "./GuildCache"

export interface iPoll {
	id: string
	date: number
	author_id: string
	title: string
	description: string
	choices: { [key: string]: string | null }
	options: {
		is_closed: boolean
		is_anonymous: boolean
		is_multi_choice: boolean
		is_quiz: boolean
	}
}

export default class Poll {
	public static emojis = [
		"1️⃣",
		"2️⃣",
		"3️⃣",
		"4️⃣",
		"5️⃣"
	]
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
			choices: {},
			options: {
				is_closed: false,
				is_anonymous: false,
				is_multi_choice: false,
				is_quiz: false
			}
		})
	}

	public static getDraftEmbed(poll: Poll | undefined, cache: GuildCache): MessageEmbed {
		const embed = new MessageEmbed()

		if (poll) {
			const member = cache.guild.members.cache.get(poll.value.author_id)
			if (member) {
				embed.setAuthor(member.displayName, member.user.displayAvatarURL())
			}
			else {
				cache.guild.members.fetch(poll.value.author_id).then()
			}

			embed.addField("Title", poll.value.title || "\u200B")
			embed.addField("Description", (poll.value.description || "\u200B") + "\n\u200B")

			let i = 0
			for (const key of poll.getKeys()) {
				const value = poll.value.choices[key]
				if (++i === poll.getKeys().length) {
					embed.addField(`${Poll.emojis[i - 1]} ${key}`, (value ?? "*No description*") + "\n\u200B")
				}
				else {
					embed.addField(`${Poll.emojis[i - 1]} ${key}`, value ?? "*No description*")
				}
			}

			embed.addField("Closing Date",
				new DateHelper(poll.value.date)
					.getDueDate()
			)
			embed.addField("Anonymous",
				poll.value.options.is_anonymous
					? "Yes"
					: "No"
			)
			embed.addField("Multi-Choice",
				poll.value.options.is_multi_choice
					? "Yes"
					: "No"
			)
			embed.addField("Quiz",
				poll.value.options.is_quiz
					? "Yes"
					: "No"
			)
		}
		else {
			embed.setTitle("No draft")
		}

		return embed
	}

	public getKeys() {
		return Object.keys(this.value.choices).sort()
	}

	public getMessagePayload(cache: GuildCache): MessageOptions {
		return {
			content: "\u200B",
			embeds: [(() => {
				const embed = new MessageEmbed()
				const member = cache.guild.members.cache.get(this.value.author_id)
				if (member) {
					embed.setAuthor(member.displayName, member.user.displayAvatarURL())
				}
				else {
					cache.guild.members.fetch(this.value.author_id).then()
				}

				embed.setTitle(`__${this.value.title}__`)
				embed.setDescription(`**${this.value.description}**\n\u200B`)

				let i = 0
				for (const key of this.getKeys()) {
					const value = this.value.choices[key]
					if (++i === this.getKeys().length) {
						embed.addField(`${Poll.emojis[i - 1]} ${key}`, (value ?? "*No description*") + "\n\u200B")
					}
					else {
						embed.addField(`${Poll.emojis[i - 1]} ${key}`, value ?? "*No description*")
					}
				}

				const date = new DateHelper(this.value.date)
				embed.addField("ID", this.value.id)

				if (!this.value.options.is_closed) {
					embed.addField("Closing date", date.getDueDate())
					embed.addField("Closing in", date.getDueIn())
				}
				else {
					embed.addField("\u200B", "**Closed**")
				}

				const responses = cache.responses.filter(res => res.value.poll_id === this.value.id)
				const chart = new QuickChart()
				chart.setBackgroundColor("#2F3136")
				chart.setConfig({
					type: "outlabeledPie",
					data: {
						labels: this.getKeys(),
						datasets: [{
							backgroundColor: ["#FF3784", "#36A2EB", "#4BC0C0", "#F77825", "#9966FF"],
							data: this.getKeys().map(key => responses.filter(res => res.value.keys.includes(key)).length)
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
				embed.setImage(responses.length > 0 ? chart.getUrl() : "")

				return embed
			})()],
			components: !this.value.options.is_closed
				? [
					new MessageActionRow()
						.addComponents(
							this.getKeys().map(key => new MessageButton()
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
				: [
					new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setLabel("Delete poll")
								.setStyle("DANGER")
								.setCustomId("delete-poll")
								.setEmoji("🗑️")
						)
				]
		}
	}
}
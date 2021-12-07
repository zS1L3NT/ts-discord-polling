import GuildCache from "./GuildCache"
import QuickChart from "quickchart-js"
import { DateHelper } from "discordjs-nova"
import {
	MessageActionRow,
	MessageButton,
	MessageEditOptions,
	MessageEmbed
} from "discord.js"

export interface iPoll {
	id: string
	closing_date: number | null
	created_date: number
	author_id: string
	title: string
	description: string
	choices: { [key: string]: string | null }
	options: {
		is_closed: boolean
		is_multi_choice: boolean
	}
}

export default class Poll {
	public static emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
	public value: iPoll

	public constructor(value: iPoll) {
		this.value = value
	}

	public static getEmpty(): Poll {
		return new Poll({
			id: "",
			closing_date: null,
			created_date: 0,
			author_id: "",
			title: "",
			description: "",
			choices: {},
			options: {
				is_closed: false,
				is_multi_choice: false
			}
		})
	}

	public static getDraftEmbed(
		poll: Poll | undefined,
		cache: GuildCache
	): MessageEmbed {
		const embed = new MessageEmbed()

		if (poll) {
			const member = cache.guild.members.cache.get(poll.value.author_id)
			if (member) {
				embed.setAuthor(
					member.displayName,
					member.user.displayAvatarURL()
				)
			} else {
				cache.guild.members.fetch(poll.value.author_id)
			}

			embed.addField("Title", poll.value.title || "\u200B")
			embed.addField(
				"Description",
				(poll.value.description || "\u200B") + "\n\u200B"
			)

			let i = 0
			for (const key of poll.getKeys()) {
				const value = poll.value.choices[key]
				if (++i === poll.getKeys().length) {
					embed.addField(
						`${Poll.emojis[i - 1]} ${key}`,
						(value ?? "*No description*") + "\n\u200B"
					)
				} else {
					embed.addField(
						`${Poll.emojis[i - 1]} ${key}`,
						value ?? "*No description*"
					)
				}
			}

			if (poll.value.closing_date) {
				embed.addField(
					"Closing Date",
					new DateHelper(poll.value.closing_date).getDate()
				)
			}

			embed.addField(
				"Multi-Choice",
				poll.value.options.is_multi_choice ? "Yes" : "No"
			)
		} else {
			embed.setTitle("No draft")
		}

		return embed
	}

	public getKeys() {
		return Object.keys(this.value.choices).sort()
	}

	public getMessagePayload(cache: GuildCache): MessageEditOptions {
		return {
			content: "\u200B",
			embeds: [
				(() => {
					const embed = new MessageEmbed()
					const member = cache.guild.members.cache.get(
						this.value.author_id
					)
					if (member) {
						embed.setAuthor(
							member.displayName,
							member.user.displayAvatarURL()
						)
					} else {
						cache.guild.members.fetch(this.value.author_id)
					}

					embed.setTitle(`__${this.value.title}__`)
					embed.setDescription(
						`**${this.value.description}**\n\u200B`
					)

					let i = 0
					for (const key of this.getKeys()) {
						const value = this.value.choices[key]
						if (++i === this.getKeys().length) {
							embed.addField(
								`${Poll.emojis[i - 1]} ${key}`,
								(value ?? "*No description*") + "\n\u200B"
							)
						} else {
							embed.addField(
								`${Poll.emojis[i - 1]} ${key}`,
								value ?? "*No description*"
							)
						}
					}

					embed.addField("ID", this.value.id)
					embed.addField(
						"Multi-choice",
						this.value.options.is_multi_choice ? "Yes" : "No"
					)
					embed.addField(
						"Created date",
						new DateHelper(this.value.created_date).getDate()
					)

					if (!this.value.options.is_closed) {
						if (this.value.closing_date) {
							const closing_date = new DateHelper(
								this.value.closing_date
							)
							embed.addField(
								"Closing date",
								closing_date.getDate()
							)
							embed.addField(
								"Closing in",
								closing_date.getTimeLeft()
							)
						}
					} else {
						embed.addField("\u200B", "**Closed**")
					}

					const votes = cache.votes.filter(
						res => res.value.poll_id === this.value.id
					)
					const chart = new QuickChart()
					chart.setBackgroundColor("#2F3136")
					chart.setConfig({
						type: "outlabeledPie",
						data: {
							labels: this.getKeys(),
							datasets: [
								{
									backgroundColor: [
										"#FF3784",
										"#36A2EB",
										"#4BC0C0",
										"#F77825",
										"#9966FF"
									],
									data: this.getKeys().map(
										key =>
											votes.filter(res =>
												res.value.keys.includes(key)
											).length
									)
								}
							]
						},
						options: {
							plugins: {
								legend: false,
								outlabels: {
									text: "%l • %v • %p",
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
					embed.setImage(votes.length > 0 ? chart.getUrl() : "")

					return embed
				})()
			],
			components: !this.value.options.is_closed
				? [
						new MessageActionRow().addComponents(
							this.getKeys().map(key =>
								new MessageButton()
									.setLabel(key)
									.setStyle("PRIMARY")
									.setCustomId(`${this.value.id}-${key}`)
							)
						),
						new MessageActionRow().addComponents(
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
						new MessageActionRow().addComponents(
							new MessageButton()
								.setLabel("Reopen poll")
								.setStyle("SUCCESS")
								.setCustomId("reopen-poll")
								.setEmoji("✅"),
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

import { iButtonFile } from "../utilities/BotSetupHelper"
import { GuildMember, MessageEmbed } from "discord.js"
import Poll from "../models/Poll"

module.exports = {
	id: "show-vote",
	execute: async helper => {
		const poll_id = helper.interaction.message.embeds[0]!.fields!.find(field => field.name === "ID")!.value
		const poll = helper.cache.polls.find(poll => poll.value.id === poll_id)!
		const keys = poll.getKeys()

		const response = helper.cache.responses.find(res =>
			res.value.poll_id === poll_id &&
			res.value.user_id === helper.interaction.user.id
		)

		const member = helper.interaction.member as GuildMember
		const user = helper.interaction.user

		const embed = new MessageEmbed()
			.setAuthor(`${member.displayName}'s response`, user.displayAvatarURL())
			.setTitle(`__${poll.value.title}__`)
			.setDescription(`**${poll.value.description}**\n\u200B`)

		if (response) {
			for (const key of poll.getKeys()) {
				if (response.value.keys.includes(key)) {
					embed.addField(`${Poll.emojis[keys.indexOf(key)]} ${key}`, poll.value.choices[key] ?? "*No description*")
				}
			}
		}
		else {
			embed.description += "\nNo response"
		}

		helper.respond({
			embeds: [embed]
		})
	}
} as iButtonFile
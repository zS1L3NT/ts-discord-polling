import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import Poll from "../models/Poll"
import { GuildMember, MessageEmbed } from "discord.js"
import { iButtonFile } from "discordjs-nova"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const pollId = helper.interaction.message.embeds[0]!.fields!.find(
			field => field.name === "ID"
		)!.value
		const poll = helper.cache.polls.find(poll => poll.value.id === pollId)!
		const names = poll.getNames()

		const vote = helper.cache.votes.find(
			res =>
				res.value.poll_id === pollId &&
				res.value.user_id === helper.interaction.user.id
		)

		const member = helper.interaction.member as GuildMember
		const user = helper.interaction.user

		const embed = new MessageEmbed()
			.setAuthor(`${member.displayName}'s vote`, user.displayAvatarURL())
			.setTitle(`__${poll.value.title}__`)
			.setDescription(`**${poll.value.description}**\n\u200B`)

		if (vote) {
			for (const name of poll.getNames()) {
				if (vote.value.names.includes(name)) {
					embed.addField(
						`${Poll.emojis[names.indexOf(name)]} ${name}`,
						poll.value.choices[name] ?? "*No description*"
					)
				}
			}
		} else {
			embed.description += "\nNo Vote"
		}

		helper.respond({
			embeds: [embed]
		})
	}
}

export default file

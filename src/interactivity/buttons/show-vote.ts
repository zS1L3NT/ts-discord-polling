import Entry from "../../data/Entry"
import getPoll from "../../utilities/getPoll"
import GuildCache from "../../data/GuildCache"
import Poll from "../../data/Poll"
import { GuildMember, MessageEmbed } from "discord.js"
import { iButtonFile } from "nova-bot"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const poll = getPoll(helper)
		const names = poll.getNames()

		const vote = helper.cache.votes.find(
			res =>
				res.value.poll_id === poll.value.id &&
				res.value.user_id === helper.interaction.user.id
		)

		const member = helper.interaction.member as GuildMember
		const user = helper.interaction.user

		const embed = new MessageEmbed()
			.setAuthor({
				name: `${member.displayName}'s vote`,
				iconURL: user.displayAvatarURL()
			})
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

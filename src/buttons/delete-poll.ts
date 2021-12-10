import admin from "firebase-admin"
import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { Emoji, iButtonFile, ResponseBuilder } from "nova-bot"
import { GuildMember, Message } from "discord.js"

const file: iButtonFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	execute: async helper => {
		const pollId = helper.interaction.message.embeds[0]!.fields!.find(
			field => field.name === "ID"
		)!.value
		const member = helper.interaction.member as GuildMember
		const message = helper.interaction.message as Message

		if (member.permissions.has("ADMINISTRATOR")) {
			const serverDoc = helper.cache.ref
			const promises: Promise<any>[] = []

			const snaps = await serverDoc
				.collection("votes")
				.where("poll_id", "==", pollId)
				.get()

			promises.push(message.delete())
			promises.push(serverDoc.collection("polls").doc(pollId).delete())
			promises.push(
				serverDoc.set(
					{
						// @ts-ignore
						poll_message_ids:
							admin.firestore.FieldValue.arrayRemove(message.id)
					},
					{ merge: true }
				)
			)
			for (const snap of snaps.docs) {
				promises.push(
					serverDoc.collection("votes").doc(snap.id).delete()
				)
			}

			await Promise.allSettled(promises)
			helper.cache.updatePollChannel()
			helper.respond(new ResponseBuilder(Emoji.GOOD, "Poll deleted"))
		} else {
			helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"Only admins can delete the Poll!"
				)
			)
		}
	}
}

export default file

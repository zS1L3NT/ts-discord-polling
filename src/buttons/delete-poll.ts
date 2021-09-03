import admin from "firebase-admin"
import { iButtonFile } from "../utilities/BotSetupHelper"
import { GuildMember, Message } from "discord.js"

module.exports = {
	id: "delete-poll",
	execute: async helper => {
		const poll_id = helper.interaction.message.embeds[0]!.fields!.find(field => field.name === "ID")!.value
		const member = helper.interaction.member as GuildMember
		const message = helper.interaction.message as Message

		if (member.permissions.has("ADMINISTRATOR")) {
			const serverDoc = helper.cache.ref
			const promises: Promise<any>[] = []

			const snaps = await serverDoc.collection("votes").where("poll_id", "==", poll_id).get()

			promises.push(message.delete())
			promises.push(serverDoc.collection("polls").doc(poll_id).delete())
			promises.push(serverDoc.set({
				poll_message_ids: admin.firestore.FieldValue.arrayRemove(message.id)
			}, { merge: true }))
			for (const snap of snaps.docs) {
				promises.push(serverDoc.collection("votes").doc(snap.id).delete())
			}

			await Promise.allSettled(promises)
			helper.cache.updatePollChannel().then()
			helper.respond("✅ Poll deleted")
		}
		else {
			helper.respond("❌ Only admins can delete the poll!")
		}
	}
} as iButtonFile
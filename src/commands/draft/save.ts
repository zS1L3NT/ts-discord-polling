import admin from "firebase-admin"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("save")
		.setDescription("Save the existing draft to a poll"),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to save")
		}

		if (draft.value.title === "") {
			return helper.respond(`❌ Existing draft title is empty`)
		}

		if (draft.value.description === "") {
			return helper.respond(`❌ Existing draft description is empty`)
		}

		if (draft.value.closing_date && draft.value.closing_date < Date.now()) {
			return helper.respond(`❌ Existing draft date is invalid, please set it again`)
		}

		if (Object.keys(draft.value.choices).length < 2) {
			return helper.respond(`❌ Existing draft has fewer than 2 choices`)
		}

		const doc = helper.cache.ref
			.collection("polls")
			.doc()
		draft.value.author_id = helper.interaction.user.id
		draft.value.id = doc.id
		await helper.cache.ref
			.set({
				poll_message_ids: admin.firestore.FieldValue.arrayUnion("")
			}, { merge: true })
		await doc.set(draft.value)
		delete helper.cache.draft
		await helper.cache
			.getDraftDoc()
			.delete()

		helper.respond("✅ Saved draft to poll")
	}
} as iInteractionSubcommandFile
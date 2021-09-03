import admin from "firebase-admin"
import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("choice-remove")
		.setDescription("Remove a choice from the list of choices")
		.addStringOption(option =>
			option
				.setName("key")
				.setDescription("The short form / identifying keyword of the choice")
				.setRequired(true)
		),
	execute: async helper => {
		const draft = helper.cache.draft
		if (!draft) {
			return helper.respond("❌ No draft to edit")
		}

		const key = helper.string("key", true)!

		if (draft.value.choices[key] !== undefined) {
			delete draft.value.choices[key]
			await helper.cache.getDraftDoc().set({
				choices: {
					[key]: admin.firestore.FieldValue.delete()
				}
			}, { merge: true })

			helper.respond("✅ Choice added")
		} else {
			helper.respond("❌ No choice with that key")
		}
	}
} as iInteractionSubcommandFile
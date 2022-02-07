import Entry from "./Entry"
import GuildCache from "./GuildCache"
import { BaseBotCache } from "nova-bot"

export default class BotCache extends BaseBotCache<Entry, GuildCache> {
	public onConstruct(): void {}
	public onSetGuildCache(cache: GuildCache): void {}

	public async registerGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (!doc.exists) {
			await this.ref.doc(guildId).set(this.getEmptyEntry())
		}
	}

	public async eraseGuildCache(guildId: string) {
		const promises: Promise<any>[] = []

		const doc = await this.ref.doc(guildId).get()
		if (doc.exists) {
			const doc = this.ref.doc(guildId)
			;(await doc.collection("polls").get()).forEach(snap => {
				promises.push(doc.collection("polls").doc(snap.id).delete())
			})
			;(await doc.collection("votes").get()).forEach(snap => {
				promises.push(doc.collection("votes").doc(snap.id).delete())
			})
			promises.push(doc.delete())

			await Promise.allSettled(promises)
		}
	}

	public getEmptyEntry() {
		return {
			poll_channel_id: "",
			poll_message_ids: []
		}
	}
}

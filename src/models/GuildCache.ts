import Document, { iDocument } from "./Document"
import { Client, Collection, Guild, Message } from "discord.js"
import ChannelCleaner from "../utilities/ChannelCleaner"
import equal from "deep-equal"
import Poll from "./Poll"
import FirestoreParser from "../utilities/FirestoreParser"
import Vote from "./Vote"

export default class GuildCache {
	public bot: Client
	public guild: Guild
	public ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	private document: Document = Document.getEmpty()

	public polls: Poll[] = []
	public votes: Vote[] = []
	public draft: Poll | undefined

	public constructor(
		bot: Client,
		guild: Guild,
		ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
		resolve: (cache: GuildCache) => void
	) {
		this.bot = bot
		this.guild = guild
		this.ref = ref
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.document = new Document(snap.data() as iDocument)
				resolve(this)
			}
		})
		this.ref.collection("polls").onSnapshot(snaps => {
			const converter = new FirestoreParser(this, snaps.docs)
			this.polls = converter.getPolls()
			this.draft = converter.getDraft()
		})
		this.ref.collection("votes").onSnapshot(snaps => {
			const converter = new FirestoreParser(this, snaps.docs)
			this.votes = converter.getVotes()
		})
	}

	/**
	 * Method run every minute
	 */
	public async updateMinutely(debug: number) {
		console.time(`Updated Channels for Guild(${this.guild.name}) [${debug}]`)

		await this.updatePollChannel()

		console.timeEnd(`Updated Channels for Guild(${this.guild.name}) [${debug}]`)
	}

	public async updatePollChannel() {
		const pollChannelId = this.getPollChannelId()
		if (pollChannelId === "") return

		let messages: Collection<string, Message> | undefined

		try {
			const pollMessageIds = this.getPollMessageIds()
			const cleaner = new ChannelCleaner(this, pollChannelId, pollMessageIds)
			await cleaner.clean()
			messages = cleaner.getMessages()

			const newPollMessageIds = cleaner.getMessageIds()
			if (!equal(newPollMessageIds, pollMessageIds)) {
				this.setPollMessageIds(newPollMessageIds).then()
			}
		} catch {
			console.warn(
				`Guild(${this.guild.name}) has no Channel(${pollChannelId})`
			)
			await this.setPollChannelId("")
			return
		}

		// Remove expired polls
		for (const poll of this.polls) {
			if (poll.value.closing_date && poll.value.closing_date < Date.now()) {
				this.removePoll(poll.value.id).then()
				const pollMessageIds = this.getPollMessageIds()
				pollMessageIds.pop()
				this.setPollMessageIds(pollMessageIds).then()
			}
		}

		const payloads = this.polls
			.sort((a, b) => b.value.created_date - a.value.created_date)
			.map(poll => poll.getMessagePayload(this))

		const pollMessageIds = this.getPollMessageIds()

		if (payloads.length === pollMessageIds.length) {
			for (let i = 0, il = pollMessageIds.length; i < il; i++) {
				const messageId = pollMessageIds[i]
				const payload = payloads[i]
				const message = messages.get(messageId)!
				message.edit(payload).then()
			}
		}
		else {
			console.error("Payload count doesn't match up to poll message id count!")
			if (payloads.length > pollMessageIds.length) {
				console.log("Polls > Message IDs")
			} else {
				console.log("Message IDs > Polls")
			}
		}
	}

	public getDraftDoc() {
		return this.ref.collection("polls").doc("draft")
	}

	public getPollChannelId() {
		return this.document.value.poll_channel_id
	}

	public async setPollChannelId(poll_channel_id: string) {
		this.document.value.poll_channel_id = poll_channel_id
		await this.ref.update({ poll_channel_id })
	}

	public getPollMessageIds() {
		return this.document.value.poll_message_ids
	}

	public async setPollMessageIds(poll_message_ids: string[]) {
		this.document.value.poll_message_ids = poll_message_ids
		await this.ref.update({ poll_message_ids })
	}

	public async removePoll(id: string) {
		this.polls = this.polls.filter(poll => poll.value.id !== id)
		await this.ref.collection("polls").doc(id).delete()
	}

	public async setVote(vote: Vote) {
		this.votes.push(vote)
		await this.ref.collection("votes").doc(vote.value.id).set(vote.value)
	}
}

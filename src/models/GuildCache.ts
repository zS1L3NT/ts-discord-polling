import Entry from "./Entry"
import equal from "deep-equal"
import FirestoreParser from "../utilities/FirestoreParser"
import Poll from "./Poll"
import Vote from "./Vote"
import { BaseGuildCache, ChannelCleaner } from "nova-bot"
import { useTryAsync } from "no-try"

export default class GuildCache extends BaseGuildCache<Entry, GuildCache> {
	public polls: Poll[] = []
	public votes: Vote[] = []
	public draft: Poll | undefined

	public resolve(resolve: (cache: GuildCache) => void) {
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.entry = snap.data() as Entry
				resolve(this)
			}
		})
		this.ref.collection("polls").onSnapshot(snaps => {
			const converter = new FirestoreParser(snaps.docs)
			this.polls = converter.getPolls()
			this.draft = converter.getDraft()
		})
		this.ref.collection("votes").onSnapshot(snaps => {
			const converter = new FirestoreParser(snaps.docs)
			this.votes = converter.getVotes()
		})
	}

	public onConstruct() {}

	public async updateMinutely(debug: number) {
		console.time(
			`Updated Channels for Guild(${this.guild.name}) [${debug}]`
		)

		await this.updatePollChannel()

		console.timeEnd(
			`Updated Channels for Guild(${this.guild.name}) [${debug}]`
		)
	}

	public async updatePollChannel() {
		const pollChannelId = this.getPollChannelId()
		if (pollChannelId === "") return

		const [err, messages] = await useTryAsync(async () => {
			const pollMessageIds = this.getPollMessageIds()
			const cleaner = new ChannelCleaner<Entry, GuildCache>(
				this,
				pollChannelId,
				pollMessageIds
			)
			await cleaner.clean()
			const messages = cleaner.getMessages()

			const newPollMessageIds = cleaner.getMessageIds()
			if (!equal(newPollMessageIds, pollMessageIds)) {
				this.setPollMessageIds(newPollMessageIds)
			}

			return messages
		})

		if (err) {
			if (err.message === "no-channel") {
				console.warn(
					`Guild(${this.guild.name}) has no Channel(${pollChannelId})`
				)
				await this.setPollChannelId("")
				return
			}
			throw err
		}

		// Remove expired polls
		for (const poll of this.polls) {
			if (
				poll.value.closing_date &&
				poll.value.closing_date < Date.now()
			) {
				this.removePoll(poll.value.id)
				const pollMessageIds = this.getPollMessageIds()
				pollMessageIds.pop()
				this.setPollMessageIds(pollMessageIds)
			}
		}

		const closedPolls = this.polls
			.filter(poll => poll.value.options.is_closed)
			.sort((a, b) => a.value.created_date - b.value.created_date)

		const openPolls = this.polls
			.filter(poll => !poll.value.options.is_closed)
			.sort((a, b) => a.value.created_date - b.value.created_date)

		const payloads = [...closedPolls, ...openPolls].map(poll =>
			poll.getMessagePayload(this)
		)

		const pollMessageIds = this.getPollMessageIds()

		if (payloads.length === pollMessageIds.length) {
			for (let i = 0, il = pollMessageIds.length; i < il; i++) {
				const messageId = pollMessageIds[i]!
				const payload = payloads[i]!
				const message = messages.get(messageId)!
				message.edit(payload)
			}
		} else {
			console.error(
				"Payload count doesn't match up to Poll message id count!"
			)
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
		return this.entry.poll_channel_id
	}

	public async setPollChannelId(poll_channel_id: string) {
		this.entry.poll_channel_id = poll_channel_id
		await this.ref.update({ poll_channel_id })
	}

	public getPollMessageIds() {
		return this.entry.poll_message_ids
	}

	public async setPollMessageIds(poll_message_ids: string[]) {
		this.entry.poll_message_ids = poll_message_ids
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

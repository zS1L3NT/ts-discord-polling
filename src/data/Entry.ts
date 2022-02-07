import { BaseEntry } from "nova-bot"

export default interface Entry extends BaseEntry {
	poll_channel_id: string
	poll_message_ids: string[]
}

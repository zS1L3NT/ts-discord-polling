export interface iDocument {
	poll_channel_id: string
	poll_message_ids: string[]
}

export default class Document {
	public value: iDocument

	public constructor(value: iDocument) {
		this.value = value
	}

	public static getEmpty():Document {
		return new Document({
			poll_channel_id: "",
			poll_message_ids: []
		})
	}
}
import { MessageOptions } from "discord.js"

export interface iPoll {
	id: string
	date: number
	name: string
}

export default class Poll {
	public value: iPoll

	public constructor(value: iPoll) {
		this.value = value
	}

	public static getEmpty(): Poll {
		return new Poll({
			id: "",
			date: 0,
			name: ""
		})
	}

	public getMessagePayload(): MessageOptions {
		return {
			content: this.value.name
		}
	}
}
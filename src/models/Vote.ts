export interface iVote {
	id: string
	user_id: string
	poll_id: string
	names: string[]
}

export default class Vote {
	public value: iVote

	public constructor(value: iVote) {
		this.value = value
	}

	public static getEmpty(): Vote {
		return new Vote({
			id: "",
			user_id: "",
			poll_id: "",
			names: []
		})
	}
}

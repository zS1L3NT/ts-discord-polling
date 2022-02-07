export interface iVote {
	id: string
	user_id: string
	poll_id: string
	names: string[]
}

export default class Vote {
	public constructor(public value: iVote) {}

	public static getEmpty(): Vote {
		return new Vote({
			id: "",
			user_id: "",
			poll_id: "",
			names: []
		})
	}
}

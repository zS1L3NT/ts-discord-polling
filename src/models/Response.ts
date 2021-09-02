export interface iResponse {
	id: string
	user_id: string
	poll_id: string
	keys: string[]
}

export default class Response {
	public value: iResponse

	public constructor(value: iResponse) {
		this.value = value
	}

	public static getEmpty():Response {
		return new Response({
			id: "",
			user_id: "",
			poll_id: "",
			keys: []
		})
	}
}
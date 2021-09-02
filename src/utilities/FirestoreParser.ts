import GuildCache from "../models/GuildCache"
import Poll, { iPoll } from "../models/Poll"
import Response, { iResponse } from "../models/Response"

export default class FirestoreParser {
	private cache: GuildCache
	private docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]

	public constructor(
		cache: GuildCache,
		docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
	) {
		this.cache = cache
		this.docs = docs
	}

	public getPolls(): Poll[] {
		return this.docs
			.filter(doc => doc.id !== "draft")
			.map(doc => new Poll(doc.data() as iPoll))
	}

	public getResponses(): Response[] {
		return this.docs
			.map(doc => new Response(doc.data() as iResponse))
	}

	public getDraft(): Poll | undefined {
		const data = this.docs.find(doc => doc.id === "draft")
		if (data) {
			return new Poll(data.data() as iPoll)
		}
	}

}
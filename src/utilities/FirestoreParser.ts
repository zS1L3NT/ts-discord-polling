import Poll, { iPoll } from "../models/Poll"
import Vote, { iVote } from "../models/Vote"

export default class FirestoreParser {
	private docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]

	public constructor(
		docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
	) {
		this.docs = docs
	}

	public getPolls(): Poll[] {
		return this.docs
			.filter(doc => doc.id !== "draft")
			.map(doc => new Poll(doc.data() as iPoll))
	}

	public getVotes(): Vote[] {
		return this.docs.map(doc => new Vote(doc.data() as iVote))
	}

	public getDraft(): Poll | undefined {
		const data = this.docs.find(doc => doc.id === "draft")
		if (data) {
			return new Poll(data.data() as iPoll)
		}
		return undefined
	}
}

export interface iDocument {
}

export default class Document {
	public value: iDocument

	public constructor(value: iDocument) {
		this.value = value
	}

	public static getEmpty():Document {
		return new Document({
		})
	}
}
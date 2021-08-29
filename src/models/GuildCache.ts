import Document, { iDocument } from "./Document"
import { Client, Guild } from "discord.js"

export default class GuildCache {
	public bot: Client
	public guild: Guild
	private readonly TAG: string
	private ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	private document: Document = Document.getEmpty()

	public constructor(
		bot: Client,
		guild: Guild,
		ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
		resolve: (localCache: GuildCache) => void
	) {
		this.TAG = `{${guild.name}}<<GuildCache`

		this.bot = bot
		this.guild = guild
		this.ref = ref
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.document = new Document(snap.data() as iDocument)
				resolve(this)
			}
		})
	}

	/**
	 * Method run every minute
	 */
	public async updateMinutely(debug: number) {
		console.time(`Updated Channels for Guild(${this.guild.name}) [${debug}]`)

		// Bot channel updates

		console.timeEnd(`Updated Channels for Guild(${this.guild.name}) [${debug}]`)
	}

	public log(METHOD: string, message: any) {
		console.log(`${this.TAG}::${METHOD}>>`, message)
	}
}

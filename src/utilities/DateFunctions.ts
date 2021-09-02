export default class DateFunctions {
	private readonly time: number
	private readonly days_of_week: {
		[day: string]: string
	} = {
		Mon: "Monday",
		Tue: "Tuesday",
		Wed: "Wednesday",
		Thu: "Thursday",
		Fri: "Friday",
		Sat: "Saturday",
		Sun: "Sunday"
	}
	private readonly name_of_months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	]

	public constructor(time: number) {
		this.time = time
	}

	public getDueIn() {
		const ms = this.time - Date.now() + 30000

		if (ms < 1000) {
			return "NOW"
		}

		const s = Math.floor(ms / 1000)
		if (s < 60) {
			return "Less than 1m"
		}

		const m = Math.floor(s / 60)
		if (m < 60) {
			return m + "m"
		}

		const h = Math.floor(m / 60)
		const mr = m % 60
		if (h < 24) {
			return h + "h " + mr + "m"
		}

		const d = Math.floor(h / 24)
		const hr = h % 24
		if (d < 7) {
			return d + "d " + hr + "h " + mr + "m"
		}

		const w = Math.floor(d / 7)
		const dr = d % 7
		return w + "w " + dr + "d " + hr + "h " + mr + "m"
	}

	public getDueDate() {
		const date = new Date(this.time)
		let localDate: Date
		if (date.getUTCHours() === date.getHours()) {
			// Wrong timezone, in UK
			localDate = new Date(this.time + 28800000)
		}
		else {
			localDate = date
		}

		const day_of_week =
			this.days_of_week[localDate.toDateString().slice(0, 3)]
		const date_in_month = localDate.getDate()
		const name_of_month = this.name_of_months[localDate.getMonth()]
		const year = localDate.getFullYear()

		const hours = localDate.getHours()
		const minutes = localDate.getMinutes()

		const time =
			hours >= 12
				? hours === 12
					? `12:${minutes.toString().padStart(2, "0")}pm`
					: `${(hours - 12).toString().padStart(2, "0")}:${minutes
						.toString()
						.padStart(2, "0")}pm`
				: `${hours.toString().padStart(2, "0")}:${minutes
					.toString()
					.padStart(2, "0")}am`

		return `${day_of_week}, ${date_in_month} ${name_of_month} ${year} at ${time}`
	}
}

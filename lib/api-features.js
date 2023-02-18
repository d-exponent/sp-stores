class ApiFeatures {

	constructor(query, parsedQueryFromUrl) {
		this.query = query
		this.parsedQueryFromUrl = parsedQueryFromUrl
	}

	filter() {

		const propertiesToExclude = ['page', 'sort', 'limit', 'feilds']
		const reg = /\b(gte|gt|lt|lte|ne)\b/g

		let paresedQueryClone = { ...this.parsedQueryFromUrl }
		propertiesToExclude.forEach((prop) => delete paresedQueryClone[prop])

		paresedQueryClone = JSON.stringify(paresedQueryClone)
		paresedQueryClone = paresedQueryClone.replace(reg, (match) => `$${match}`)

		this.query.find(JSON.parse(paresedQueryClone))
		return this
	}

	feilds() {

		if (this.parsedQueryFromUrl.feilds) {
			const feilds = this.parsedQueryFromUrl.feilds.split(',').join(' ')
			this.query.select(feilds)
		}

		return this
	}

	sort() {

		if (this.parsedQueryFromUrl.sort) {
			const sortBy = this.parsedQueryFromUrl.sort.split(',').join(' ')
			this.query.sort(sortBy)
		}

		return this
	}

	paginate() {

		const page = +this.parsedQueryFromUrl.page || 1
		const limit = +this.parsedQueryFromUrl.limit || 1

		const skip = (page - 1) * limit

		this.query.skip(skip).limit(limit)
		return this
	}
}

export default ApiFeatures

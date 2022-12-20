require('dotenv').config()


/**
 *
 * A simple script to make dummy products data on our dB
 */

const mongoose = require('mongoose')
const slugify = require('slugify')

const terminalArgs = process.argv

function generateRandomNumber(number, useZero) {
	const randomNum = Math.floor(Math.random() * number)

	if (useZero) {
		return randomNum
	}

	return randomNum === 0 ? generateRandomNumber(number, null) : randomNum
}

function getRandomChoice(arr) {
	return arr[generateRandomNumber(arr.length, true)]
}

function sizeFactory(mode) {
	const sizeObject = { quantity: generateRandomNumber(9) }

	if (mode === 'a') {
		sizeObject.size = getRandomChoice(['xl', 'l', 'xxl', 'm', 'sm'])
		return sizeObject
	}

	sizeObject.size = getRandomChoice([30, 12, 24, 51, 24, 27, 40, 55])
	return sizeObject
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function runner(fun, runtimes) {
	const arr = []

	for (var i = 0; i < runtimes; i++) {
		arr.push(fun())
	}

	return arr
}

function productFactory() {
	const images = [
		'https://images.unsplash.com/photo-1610384104075-e05c8cf200c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWVuJTIwZmFzaGlvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1632226390535-2f02c1a93541?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWVuJTIwZmFzaGlvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWVucyUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
	]

	const imageCovers = [
		'https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWVucyUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1527010154944-f2241763d806?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bWVucyUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWVuJTIwZmFzaGlvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1536766820879-059fec98ec0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1507253831417-37c43a944f51?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjd8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1550246140-29f40b909e5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1543960713-7538001f7c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1593757147298-e064ed1419e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzl8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1623975522547-3d7ad176973e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzB8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
	]

	const names = [
		'commodi repudiandae consequuntur voluptatum',
		'harum nesciunt ipsum debitis',
		'dolor sit amet consectetur',
		'Provident similique accusantium',
	]

	const colors = ['red', 'blue', 'Green', 'Yellow', 'Lilac', 'Indigo', 'Brown']

	const brands = ['Gucci', 'Versace', 'LV', 'Fendi', 'Prada']
	const categories = ['clothing', 'footwares', 'accessories']
	const prices = [20000, 50000, 15000, 253400, 1200, 5000, 7600, 29000, 97320, 65000]
	const sizes = runner(sizeFactory, 6)
	const initCategory = getRandomChoice(categories)

	return {
		name: getRandomChoice(names),
		brand: getRandomChoice(brands),
		category: initCategory,
		color: capitalize(getRandomChoice(colors)),
		price: getRandomChoice(prices),
		productType: capitalize(initCategory),
		imageCover: getRandomChoice(imageCovers),
		sizes: sizes,
		images: runner(() => getRandomChoice(images), generateRandomNumber(3)),
	}
}

const sizeSchema = new mongoose.Schema({
	size: {
		type: String,
		lowercase: true,
		required: [true, 'Please provide a size'],
	},
	quantity: {
		type: Number,
		validate: {
			validator: function (value) {
				return value > -1
			},
			message: '(value) must be at least 0',
		},
	},
})

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A product must have a name'],
			trim: true,
		},
		brand: {
			type: String,
			required: [true, 'A product must have a brand'],
			trim: true,
			lowercase: true,
		},
		category: {
			type: String,
			enum: ['clothing', 'footwares', 'accessories'],
			required: [true, 'A product must have a category'],
		},
		color: {
			type: String,
			required: [true, 'A product must have a color'],
			lowercase: true,
		},
		discountPercentage: Number,
		discountPrice: {
			type: Number,
			validate: {
				validator: function (value) {
					return this.price > value && value > -1
				},
				message: 'A discount-price must be less than the price.',
			},
			default: 0,
		},
		quantity: {
			type: Number,
			default: 0,
			// required: [true, 'A product must have at least one item'],
		},
		initialQuantity: {
			type: Number,
			select: false,
		},
		imageCover: {
			type: String,
			required: true,
		},
		images: [String],
		inStock: {
			type: Boolean,
			default: true,
		},
		lastModifiedAt: Date,
		totalRatings: {
			type: Number,
			default: 0,
		},
		ratingsAverage: {
			type: Number,
			default: 4,
		},
		sizes: [sizeSchema],
		slug: {
			type: String,
			unique: true,
		},
		price: {
			type: Number,
			required: [true, 'A product must have a price'],
		},
		productType: {
			type: String,
			required: [true, 'A product must belong to a type'],
			trim: true,
			lowercase: true,
		},
		uploadedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'product',
	localField: '_id',
})

productSchema.pre('save', function (next) {
	const sizeQuantityArr = this.sizes.map((size) => size.quantity)
	const totalQuantity = sizeQuantityArr.reduce((sum, quantity) => sum + quantity)

	this.initialQuantity = totalQuantity
	this.quantity = totalQuantity

	next()
})

//Set initial quantity
productSchema.pre('save', function (next) {
	// Handle discount price changes
	if (this.discountPrice) {
		const percentage = (this.discountPrice / this.price) * 100
		this.discountPercentage = 100 - Math.round(percentage)
	}

	// Handle inStock Boolean
	this.inStock = this.quantity > 0

	next()
})

// AUTO GENERATE SLUG ON SAVE
productSchema.pre('save', function (next) {
	const nowInMillisecondsStr = Date.now().toString()
	const dateStringLength = nowInMillisecondsStr.length
	
	const slugString = `${this.brand} ${
		this.name
	} ${nowInMillisecondsStr} ${generateRandomNumber(100)}`
	this.slug = slugify(slugString, { lower: true })
	next()
})

// Remove __v feild from queries
productSchema.pre(/^find/, function (next) {
	this.select('-__v')
	next()
})

// Show date of lastModified
productSchema.pre(/^findOneAnd/, function (next) {
	// Handle discount price changes
	if (this.discountPrice) {
		const percentage = (this.discountPrice / this.price) * 100
		this.discountPercentage = 100 - Math.round(percentage)
	}

	this.inStock = this.quantity > 0

	this.lastModifiedAt = Date.now()
	next()
})

const Product = mongoose.model('Product', productSchema)

async function createMany() {
	let numOfProducts = 200

	if (terminalArgs[3] && typeof Number(terminalArgs[3]) === 'number') {
		numOfProducts = Number(terminalArgs[3])
	}

	try {
		await Product.create(runner(productFactory, numOfProducts))
		console.log('Create successful 👍')
	} catch (e) {
		console.error(e.message)
	}
}

async function deleteAll() {
	try {
		await Product.deleteMany()
		console.log('Delete successfull 👍')
	} catch (e) {
		console.error(e.message)
	}
}

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ntzames.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
	)
	.then(() => {
		console.log('Connected 👍')

		const init = terminalArgs[2]

		init === '--create' && createMany()
		init === '--delete' && deleteAll()
	})
	.catch((e) => console.log(e.message || 'Error connecting 🧰'))

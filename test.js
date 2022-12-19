const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({ name: 'string' })
const Child = mongoose.model('Child', childSchema)

const parentSchema = new mongoose.Schema({
	child: {
		type: mongoose.ObjectId,
		ref: 'Child',
	},
})

parentSchema.pre(/^find/, function (next) {
	this.populate('child')
	next()
})

const Parent = mongoose.model('Parent', parentSchema)

mongoose.connect('mongodb://localhost:27017/Parent').then(async () => {
	// create('David')
})

function create(name) {
	Child.create({ name })
		.then((child) => {
			console.log('Child 🧰', child)
			console.log('\n\n')

			return Parent.create({ child: child._id })
		})
		.then((parent) => {
			console.log('Parent🧰🧰', parent)
		})
		.catch((err) => console.log(err.message))
}

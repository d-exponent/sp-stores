import { setFeildDataType } from "../lib/controller-utils"
import throwOperationalError from "../lib/app-error"


export const setProductFeilds = (req, res, next) => {
	if (!req.body) {
		throwOperationalError('Please provide product information', 400)
	}

	const filtered = setFeildDataType(req.body)

	if (req.files.imageCover) {
		filtered.imageCover = req.files.imageCover
	}

	if (req.files.images) {
		filtered.images = req.files.images
	}

	req.body = filtered

	next()
}
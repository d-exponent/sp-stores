import path from 'path'
import sharp from 'sharp'

import { nanoid } from 'nanoid'

/** resize images, conver to jpeg, save image name to file*/
function imageResizeHandler(handler) {
	return async function (req, res) {
		//Configuration for images
		const imageDimension = 1000
		const imageFormat = 'jpeg'
		const imageQualityConfig = { mozjpeg: { mozjpeg: true } }

		//Base file path /public/images/products for images
		const imagesFilePath = path.join(process.cwd(), 'public', 'images', 'products')

		if (req.files.imageCover) {
			// Handle cover image
			const coverImageName = `product-${nanoid()}-${Date.now()}-cover.jpeg`
						
			await sharp(req.files.imageCover[0].buffer)
				.resize(imageDimension, imageDimension)
				.toFormat(imageFormat)
				.jpeg(imageQualityConfig.mozjpeg)
				.toFile(imagesFilePath + '/' + coverImageName)

			req.files.imageCover = coverImageName
		}

		if (req.files.images) {
			//Handle Images
			const imagesNamesArr = await req.files.images.map(async (image, i) => {
				const imageName = `product-${nanoid()}-${Date.now()}-${i + 1}.jpeg`
				await sharp(image.buffer)
					.resize(imageDimension, imageDimension)
					.toFormat(imageFormat)
					.jpeg(imageQualityConfig.mozjpeg)
					.toFile(imagesFilePath + '/' + imageName)

				return imageName
			})

			req.files.images = await Promise.all(imagesNamesArr)
		}

		return handler(req, res)
	}
}

export default imageResizeHandler

import path from 'path'
import sharp from 'sharp'
import multer from 'multer'
import { nanoid } from 'nanoid'

import catchAsync from '../lib/catch-async'
import AppError from '../lib/app-error'
import Product from '../models/product-model'
import factory from './handler-factory'
import { sendResponse } from '../lib/controller-utils'
import { removeCommas } from '../lib/utils'

/** resize images, conver to jpeg, save image name to file*/
export const imageResizeHandler = async (req, _, next) => {
  //Configuration for images
  const imageDimension = 1000
  const imageFormat = 'jpeg'
  const imageQualityConfig = { mozjpeg: { mozjpeg: true } }

  //Base file path /public/images/products for images
  const imagesFilePath = path.join(
    process.cwd(),
    'public',
    'images',
    'products'
  )

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

  next()
}

const storage = multer.memoryStorage()

const fileFilter = function (_, file, cb) {
  //Only allow image files to be uploaded
  if (file.mimetype.startsWith('image')) return cb(null, true)

  // Nope! Not here fam! Error time.
  return cb(
    new Error(
      'Incorrect file format. Please ensure files are of type Image'
    ),
    false
  )
}

const upload = multer({ storage, fileFilter })

export const imageUploadHandler = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 10 },
])

const setFeildsDataType = upload => {
  const allowedFeilds = [
    'name',
    'brand',
    'category',
    'color',
    'productType',
    'discountPrice',
    'quantity',
    'imageCover',
    'images',
    'totalRatings',
    'ratingsAverage',
    'sizes',
    'price',
    'productType',
  ]

  const filterd = {}

  Object.entries(upload).forEach(entry => {
    let [key, value] = entry

    key = key.trim()

    if (!allowedFeilds.includes(key)) return

    switch (key) {
      case 'quantity':
        filterd[key] = +value
        break

      case 'price':
        filterd[key] = +removeCommas(value)
        break

      case 'discountPrice':
        filterd[key] = +removeCommas(value)
        break

      default:
        filterd[key] = value
        break
    }
  })

  return filterd
}

export const setProductFeilds = (req, _, next) => {
  if (!req.body) {
    AppError.throwAppError('Please provide product information', 400)
  }

  const filtered = setFeildsDataType(req.body)

  if (req.files.imageCover) {
    filtered.imageCover = req.files.imageCover
  }

  if (req.files.images) {
    filtered.images = req.files.images
  }

  req.body = filtered

  next()
}

export const getProducts = catchAsync(async (req, res) => {
  const query = factory.setTrueToBoolean(req.query)
  const products = await Product.find(query)

  sendResponse(res, 200, {
    success: true,
    results: products.length,
    data: products,
  })
})

export const createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body)

  sendResponse(res, 201, {
    success: true,
    data: newProduct,
  })
})

import { sendResponse } from '../lib/controller-utils'

const setIdOnQuery = (req, routeQueryId) => {
  req.query.id = req.query[routeQueryId]
  delete req.query[routeQueryId]
  return req
}

const setTrueFromStringToBoolean = query => {
  if (!query) return {}

  let entries = Object.entries(query)

  if (entries.length === 0) return {}

  entries.forEach(entry => {
    const [key, value] = entry

    if (value === 'true') {
      query[key] = true
    }
  })

  return Object.fromEntries(entries)
}

const getAll = async (req, res, Model, populateOption) => {
  const query = setTrueFromStringToBoolean(req.query)

  let allQueriedDocuments = Model.find(query)

  if (populateOption) {
    allQueriedDocuments = allQueriedDocuments.populate(populateOption)
  }

  const allDocuments = await allQueriedDocuments

  sendResponse(res, 200, {
    success: true,
    results: allDocuments.length,
    data: allDocuments,
  })
}

const getOne = async (req, res, Model, populateOption) => {
  let query = Model.findById(req.query.id)

  if (populateOption) {
    query = query.populate(populateOption)
  }

  const queriedDocument = await query

  sendResponse(res, 200, {
    success: true,
    data: queriedDocument,
  })
}

const createOne = async (req, res, Model) => {
  const newDocument = await Model.create(req.body)

  sendResponse(res, 201, {
    success: true,
    data: newDocument,
  })
}

const updateOne = async (req, res, Model) => {
  const updateConfig = {
    new: true,
    runValidators: true,
  }

  const updatedDocument = await Model.findByIdAndUpdate(
    req.query.id,
    req.body,
    updateConfig
  )

  sendResponse(res, 200, {
    success: true,
    data: updatedDocument,
  })
}

const deleteOne = async (req, res, Model) => {
  await Model.findByIdAndDelete(req.query.id)
  res.status(204).send('Deleted')
}

const factory = {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  createOne,
  setId: setIdOnQuery,
  setTrueToBoolean: setTrueFromStringToBoolean,
}

export default factory

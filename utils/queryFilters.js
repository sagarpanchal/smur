// const debug = require('debug')('app:utils:query-filters')

/**
 * Construct sort object from query params
 *
 * @param {Array}  fields Array of valid fields
 * @param {String} sort   `sortBy, sortOrder`
 */
const constructSort = (fields, sort = ',1') => {
  sort = sort.split(',')
  if (sort.length > 2) throw new Error('Invalid sort parameters')

  let order = parseInt(sort[1])
  order = order < 1 ? -1 : order > 1 ? 1 : order

  if (typeof sort[0] === 'string') {
    const sortBy = sort[0].trim()
    if (sortBy) {
      if (!fields.includes(sortBy)) throw new Error(`Invalid field name - ${sortBy}`)
      return { [sortBy]: order }
    }
  }
  return { _id: order }
}

/**
 * Construct find object from query params
 *
 * @param {Array}  fields Array of valid fields
 * @param {String} search `searchFor, searchIn`
 */
const constructFind = (fields, search = ',') => {
  search = search.split(',')
  if (search.length > 2) throw new Error('Invalid search parameters')

  if (typeof search[0] !== 'string') return {}
  const searchFor = search[0].trim()
  if (!searchFor) return {}

  if (typeof search[1] !== 'string') return {}
  const searchIn = search[1].trim()
  if (!searchIn)
    return {
      $text: {
        $search: searchFor,
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    }

  if (![...fields, 'meta'].includes(searchIn)) throw new Error(`Invalid field name - ${searchIn}`)

  switch (searchIn) {
    case 'gender':
      return { [searchIn]: { $regex: `^${searchFor}`, $options: 'i' } }

    case 'phone': {
      const n = parseInt(searchFor)
      return { [searchIn]: n > 0 ? n : 0 }
    }

    case 'meta': {
      const str = require('./metaPhone')(searchFor)
      return {
        $or: [
          { meta: { $regex: `^${str}` } },
          { lastName: { $regex: `${searchFor}`, $options: 'i' } },
          { firstName: { $regex: `${searchFor}`, $options: 'i' } },
        ],
      }
    }

    default:
      return { [searchIn]: { $regex: `${searchFor}`, $options: 'i' } }
  }
}

/**
 * Construct select object from query params
 *
 * @param {String}  list Comma separated list of fields
 * @param {Boolean} exclude Exclude: true/false
 */
const constructSelect = (list = '', exclude = false) => {
  const output = []
  const sign = exclude ? '-' : ''
  if (list.trim()) {
    if (typeof list === 'string') {
      list = list.trim().split(',')
      if (list) list.forEach((field) => output.push(`${sign}${field}`))
    }
  }
  return output
}

/**
 * Construct pagination parameters from query params
 *
 * @param {Array}  fields Array of valid fields
 * @param {String} page   `recordsPerPage, pageNumber`
 */
const constructPage = (fields, page = '0,0') => {
  page = page.split(',')
  if (page.length !== 2) throw new Error('Invalid pagination parameters')

  const records = parseInt(page[0])
  const pageNum = parseInt(page[1])
  if (typeof records === 'number' && typeof pageNum === 'number') {
    if (records > 0 && pageNum > 0)
      return {
        limit: records,
        skip: records * (pageNum - 1),
      }
  }

  return { limit: null, skip: null }
}

/**
 *
 * @param {Object} query  req.query (url query params)
 * @param {Array}  fields array of valid fields
 */

const constructParams = (query, fields) => {
  const { exclude, include, page, search, sort } = query
  try {
    if (include && exclude) throw new Error("`include` and `exclude` can't be used together")
    return {
      select: [...constructSelect(include), ...constructSelect(exclude, true)],
      sort: constructSort(fields, sort),
      find: constructFind(fields, search),
      page: constructPage(fields, page),
    }
  } catch ({ message }) {
    return { error: message }
  }
}

module.exports = {
  constructSort,
  constructFind,
  constructSelect,
  constructParams,
}

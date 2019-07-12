'use strict'

const querystring = require('querystring')

// defines the allowed dimensions, default dimensions and how much variance from allowed
// dimension is allowed.

exports.handler = (event, context, callback) => {
  console.log('event', JSON.stringify(event, null, 2))

  const request = event.Records[0].cf.request
  const headers = request.headers

  // parse the querystrings key-value pairs. In our case it would be d=100x100
  const params = querystring.parse(request.querystring)
  // if there is no dimension attribute, just pass the request
  if (!params.d) {
    console.log('No dimensions set, returning')
    callback(null, request)
    return
  }

  // fetch the uri of original image
  let fwdUri = request.uri

  // read the dimension parameter value = width x height and split it by 'x'
  const dimensionMatch = params.d.split('x')
  console.log(JSON.stringify(dimensionMatch, null, 2))

  // set the width and height parameters
  // Round to the upper 100 to minimize variations
  let width = Math.ceil(parseInt(dimensionMatch[0]) / 100) * 100
  let height = Math.ceil(parseInt(dimensionMatch[1]) / 100) * 100

  // parse the prefix, image name and extension from the uri.
  // In our case /images/image.jpg

  const match = fwdUri.match(/(.*)\/(.*)\.(.*)/)

  let prefix = match[1]
  let imageName = match[2]
  let extension = match[3]

  let url = []
  // build the new uri to be forwarded upstream
  url.push(prefix)
  url.push(width + 'x' + height)

  // check support for webp
  // read the accept header to determine if webP is supported.
  let accept = headers['accept'] ? headers['accept'][0].value : ''

  if (accept.includes('webp')) {
    url.push('webp')
  } else {
    url.push(extension)
  }
  url.push(imageName + '.' + extension)

  fwdUri = url.join('/')

  // final modified url is of format /images/200x200/webp/image.jpg
  request.uri = fwdUri
  console.log('request', JSON.stringify(request, null, 2))
  callback(null, request)
}

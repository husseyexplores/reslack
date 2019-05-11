const functions = require('firebase-functions')

module.exports = functions.https.onRequest((request, response) => {
  response.send('Welcome to Reslack!')
})

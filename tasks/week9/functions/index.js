const { onRequest } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const cors = require('cors')({ origin: true })

initializeApp()

exports.countBooks = onRequest(
  { region: 'australia-southeast1', maxInstances: 10 },
  (request, response) => {
    cors(request, response, async () => {
      try {
        const snapshot = await getFirestore().collection('books').count().get()
        response.status(200).json({ count: snapshot.data().count })
      } catch (error) {
        console.error('Unable to count books:', error)
        response.status(500).json({ error: 'Unable to count books.' })
      }
    })
  }
)

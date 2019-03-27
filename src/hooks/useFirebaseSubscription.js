import { useState, useEffect } from 'react'
import { normalizeFirestoreData } from '../utils'
import firebase from '../firebase'

const db = firebase.database()

/**
 *
 * @param {string} dbCollectionPath - Path to firebase db collection
 * @returns {[Array<Object>, Boolean, {}]} Returns an array of data, isSubscribed and error object
 */
function useFirebaseSubscription(dbCollectionPath) {
  const [fetchedData, setFetchedData] = useState([])
  const [isSubscribed, setSubscribed] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = db.ref(dbCollectionPath)

    ref.on('value', snapshot => {
      if (snapshot.exists()) {
        const normalized = normalizeFirestoreData()(snapshot.val())
        setFetchedData(normalized)
        setSubscribed(true)
        setError(null)
      } else {
        setFetchedData([])
        setError({
          code: 'NOT_FOUND',
          message: 'Document does not exist',
        })
        setSubscribed(true)
      }
    })

    return () => {
      ;(async () => {
        await ref.off()
      })()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return [fetchedData, isSubscribed, error]
}

export default useFirebaseSubscription

import { useState, useEffect } from 'react'
import { normalizeFirestoreData } from '../utils'
import { db } from '../firebase'

///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Callback for adding two numbers.
 *
 * @callback onSnapCallback
 * @param {Object} FormattedSnapshot - Firebase snapshot.
 * @param {Object} RawSnapshot - Firebase snapshot.
 */

/**
 * Callback for adding two numbers.
 *
 * @callback onSnapRawCallback
 * @param {Object} RawSnapshot - Firebase snapshot.
 * @param {Object} FormattedSnapshot - Firebase snapshot.
 */

/**
 *
 * @param {Object} options - Path to firebase db collection
 * @param {string} options.path - Name of the event to listen for
 * @param {string} options.event - Name of the event to listen for
 * @param {Boolean} options.normalize - Name of the event to listen for
 * @param {onSnapCallback} options.onSnap - Fired upon each snapshot
 * @param {onSnapRawCallback} options.onSnapRaw - Fired upon each snapshot
 * @returns {[Array<Object>, Boolean, {}]} Returns an array of data, isSubscribed and error object
 */
function useFirebaseSubscription({
  path,
  event = 'value',
  normalize = true,
  onSnap = () => {},
  onSnapRaw = () => {},
} = {}) {
  if (!path) throw new Error('Please provide a valid firebase path')
  const [fetchedData, setFetchedData] = useState([])
  const [isSubscribed, setSubscribed] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = db.ref(path)

    ref.on(event, snapshot => {
      if (snapshot.exists()) {
        const formattedSnapshot = {
          id: snapshot.key,
          ...snapshot.val(),
        }

        onSnap(formattedSnapshot, snapshot)
        onSnapRaw(snapshot, formattedSnapshot)

        const normalized =
          event === 'value' && normalize
            ? normalizeFirestoreData()(snapshot.val())
            : formattedSnapshot

        event === 'value'
          ? setFetchedData(normalized)
          : setFetchedData(fetchedData.concat(normalized))

        console.log('inside useFirebase Hook')

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
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps
  return [fetchedData, isSubscribed, error]
}

export default useFirebaseSubscription

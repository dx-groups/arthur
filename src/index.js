import connectArthur from './connect'
import createArthur from './createArthur'
import arthurHelper from './helper'

import { createBrowserHistory } from 'history'
import {
  routerMiddleware,
  // syncHistoryWithStore,
  // routerReducer as routing,
} from 'react-router-redux'

export default createArthur({
  mobile: false,
  initialReducer: {
    // routing,
  },
  defaultHistory: createBrowserHistory(),
  routerMiddleware,

  setupHistory(history) {
    // this._history = syncHistoryWithStore(history, this._store)
  },
})

export const connect = connectArthur
export const helper = arthurHelper

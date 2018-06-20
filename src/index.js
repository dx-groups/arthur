import connectArthur from './connect'
import createArthur from './createArthur'

import { createBrowserHistory } from 'history'
import {
  routerMiddleware,
} from 'react-router-redux'

export default createArthur({
  mobile: false,
  initialReducer: {},
  defaultHistory: createBrowserHistory(),
  routerMiddleware,

  setupHistory(history) {},
})

export const connect = connectArthur

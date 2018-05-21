
import arthur from 'baoshi-arthur1'
import { createBrowserHistory } from 'history'
import Router from './router'
import arthurModule from '../modules/Arthur/module'

// 1. Initialize
const app = arthur({
  history: createBrowserHistory()
})

// init callBack
app.init(() => dispatch => {
  
})

// 2.modules
app.modules([
  arthurModule,
])

// 3. Router
app.router(Router)

// 4. Start
app.start('#root')

export default app._store

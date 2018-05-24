
import arthur from '@dx-groups/arthur'
import { createBrowserHistory } from 'history'
import Router from './router'
import arthurModule from '../modules/Arthur/module'

// 1. Initialize
const app = arthur({
  history: createBrowserHistory()
})

// 2. execute initialization codes
app.init(() => dispatch => {
  
})

// 3. modules
app.modules([
  arthurModule,
])

// 4. Router
app.router(Router)

// 5. Start
app.start('#root')

export default app._store

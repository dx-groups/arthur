# arthur
基于业务形成的一个业务框架 ( Inspired by [dva](https://github.com/dvajs/dva) )

## 安装

npm
```
  npm install --save @dx-groups/arthur
```
yarn

```
  yarn add  @dx-groups/arthur
```
## 用法
### module.js
项目中使用 redux 用来管理状态库，当希望改变状态库的 state 时需要通过 dispatch 发起一个 action ，根据 actionType 调用 reducers 改变 state 。arthur 中一个 [module.js](https://github.com/xubaoshi/arthur/blob/master/examples/arthur/src/modules/Arthur/module.js) 包含了一个功能模块的 store、action、reducer 的实现。

```
import pageModule from './page/module'

// actionType
const GET_FIRST_LIST = 'spa/Arthur/GET_FIRST_LIST' 

export default {

  // 不能为空,组件会通过 namespace 访问state
  namespace: 'arthur',
  // 初始状态 state
  state: {
    first: ''
  },
  // redux actions，支持 redux-thunk 及 redux-promise 
  actions: {
    getFirstList(arg) {
      return dispatch => {
        dispatch({
          type: GET_FIRST_LIST,
          payload: {
            name: 'first'
          },
        })
      }
    }
  },
  // redux reducers, 同步操作用于更新 state
  reducers: {
    [GET_FIRST_LIST]: (state, action) => ({
      ...state,
      first: action.payload,
    })
  },

  children: [
    // 下级module.js
    pageModule
  ]
}
```

### 组件引入
```
import React, { Component } from 'react'
// 该 connect 是对 react-redux 中 connect 方法进行了二次封装
import { connect } from '@dx-groups/arthur'
class Page extends Component {
  render() {
    const { first } = this.props
    return (<div>{ first }</div>)
  }
}

const mapStateToProps = (state) => {
  return {
    // ...state.arthur.page 依然支持
    ...state['arthur.page']
  }
}

// 不需要 mapDispatchToProps 方法，store.dispatch 已经在 arthur 框架内塞入组件的 props 中
export default connect(['common.showListSpin', 'arthur.page'],mapStateToProps)(Page)

```
### 整合 module.js

```
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
  
```

[DEMO](https://github.com/xubaoshi/arthur/tree/master/examples/arthur)
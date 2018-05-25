# arthur



[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/@dx-groups/arthur.svg?style=flat-square
[npm-url]: http://npmjs.org/package/@dx-groups/arthur
[travis-image]: https://img.shields.io/travis/@dx-groups/arthur.svg?style=flat-square
[travis-url]: https://travis-ci.org/@dx-groups/arthur
[coveralls-image]: https://img.shields.io/coveralls/@dx-groups/arthur.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/@dx-groups/arthur?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium@dx-groups/arthur.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/@dx-groups/arthur
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@dx-groups/arthur.svg?style=flat-square
[download-url]: https://npmjs.org/package/@dx-groups/arthur

基于业务形成的一个业务框架 ( Inspired by [dva](https://github.com/dvajs/dva) )

## 安装

[![@dx-groups/arthur](https://nodei.co/npm/@dx-groups/arthur.png)](https://npmjs.org/package/@dx-groups/arthur)

## 用法

### module.js

项目中使用 redux 管理状态库，当希望改变状态库的 state 时,使用 dispatch 发起一个 action ，根据 actionType 调用 reducers 改变 state 。arthur 中一个 [module.js](https://github.com/xubaoshi/arthur/blob/master/examples/arthur/src/modules/Arthur/module.js) 包含了一个功能模块的 store、action、reducer 的实现。

```javascript
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

```javascript
import React, { Component } from 'react'
// 该 connect 是对 react-redux 中 connect 方法进行了二次封装
import { connect } from '@dx-groups/arthur'
class Page extends Component {
  render() {
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

```javascript
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
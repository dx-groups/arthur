import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import isPlainObject from 'is-plain-object'
import invariant from 'invariant'
import warning from 'warning'
import flatten from 'flatten'

// import isFunction from 'lodash.isfunction'
import handleActions from './handleActions'
import Plugin from './plugin'

export default function createArthur(createOpts) {
  const {
    mobile,
    initialReducer,
    defaultHistory,
    routerMiddleware,
    setupHistory,
  } = createOpts

  /**
   * Create a arthur instance.
   */
  return function arthur(hooks = {}) {
    // history and initialState does not pass to plugin
    const history = hooks.history || defaultHistory
    const initialState = hooks.initialState || {}
    delete hooks.history
    delete hooks.initialState

    const plugin = new Plugin()
    plugin.use(hooks)

    const app = {
      // properties
      _init: () => {},
      _modules: [],
      _router: null,
      _store: null,
      _history: history,
      _plugin: plugin,
      _getProvider: null,
      // methods
      init,
      use,
      modules,
      router,
      start,
    }
    return app

    // //////////////////////////////////
    // Methods

    /**
     * Init action on the application.
     *
     * @param hooks
     */
    function init(fn) {
      this._init = fn
    }

    /**
     * Register an object of hooks on the application.
     *
     * @param hooks
     */
    function use(hooks) {
      plugin.use(hooks)
    }

    /**
     * Register a module.
     *
     * @param module
     */
    function module(module) {
      this._modules.push(checkModule(module, mobile))
    }

    /**
     * Register modules.
     *
     * @param modules
     */
    function modules(modules) {
      modules.forEach(module => {
        this._modules.push(checkModule(module, mobile))
      })
    }

    // inject module dynamically
    function injectModule(createReducer, onError, unlisteners, m) {
      m = checkModule(m, mobile)
      this._modules.push(m)
      const store = this._store

      // reducers
      store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state)
      store.replaceReducer(createReducer(store.asyncReducers))
    }

    // Unexpected key warn problem:
    // https://github.com/reactjs/redux/issues/1636
    function unmodule(createReducer, reducers, _unlisteners, namespace) {
      const store = this._store

      // Delete reducers
      delete store.asyncReducers[namespace]
      delete reducers[namespace]
      store.replaceReducer(createReducer(store.asyncReducers))
      store.dispatch({ type: '@@arthur/UPDATE' })

      // unlisten subscrioptions
      if (_unlisteners[namespace]) {
        const { unlisteners, noneFunctionSubscriptions } = _unlisteners[namespace]
        warning(
          noneFunctionSubscriptions.length === 0,
          `app.unmodule: subscription should return unlistener function, check these subscriptions ${noneFunctionSubscriptions.join(', ')}`,
        )
        for (const unlistener of unlisteners) {
          unlistener()
        }
        delete _unlisteners[namespace]
      }

      // delete module from this._modules
      this._modules = this._modules.filter(module => module.namespace !== namespace)
    }

    /**
     * Config router. Takes a function with arguments { history, dispatch },
     * and expects router config. It use the same api as react-router,
     * return jsx elements or JavaScript Object for dynamic routing.
     *
     * @param router
     */
    function router(router) {
      invariant(typeof router === 'function', 'app.router: router should be function')
      this._router = router
    }

    /**
     * Start the application. Selector is optional. If no selector
     * arguments, it will return a function that return JSX elements.
     *
     * @param container selector | HTMLElement
     */
    function start(container) {
      // support selector
      if (typeof container === 'string') {
        container = document.querySelector(container)
        invariant(container, `app.start: could not query selector: ${container}`)
      }

      invariant(!container || isHTMLElement(container), 'app.start: container should be HTMLElement')
      invariant(this._router, 'app.start: router should be defined')

      // error wrapper
      const onError = plugin.apply('onError', (err) => {
        throw new Error(err.stack || err)
      })
      const onErrorWrapper = (err) => {
        if (err) {
          if (typeof err === 'string') err = new Error(err)
          onError(err, app._store.dispatch)
        }
      }

      // internal module for destroy
      module.call(this, {
        namespace: '@@arthur',
        state: 0,
        reducers: {
          UPDATE(state) { return state + 1 },
        },
      })

      // get reducers from module
      const reducers = getReducers('', this._modules, initialReducer)

      // extra reducers
      const extraReducers = plugin.get('extraReducers')
      invariant(
        Object.keys(extraReducers).every(key => !(key in reducers)),
        'app.start: extraReducers is conflict with other reducers',
      )

      // extra enhancers
      const extraEnhancers = plugin.get('extraEnhancers')
      invariant(
        Array.isArray(extraEnhancers),
        'app.start: extraEnhancers should be array',
      )

      // create store
      const extraMiddlewares = plugin.get('onAction')
      const reducerEnhancer = plugin.get('onReducer')
      let middlewares = [
        thunkMiddleware,
        promiseMiddleware,
        ...flatten(extraMiddlewares),
      ]
      if (routerMiddleware) {
        middlewares = [routerMiddleware(history), ...middlewares]
      }
      let devtools = () => noop => noop
      if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        devtools = window.__REDUX_DEVTOOLS_EXTENSION__
      }
      const enhancers = [
        applyMiddleware(...middlewares),
        devtools(),
        ...extraEnhancers,
      ]
      const store = this._store = createStore(  // eslint-disable-line
        createReducer(),
        initialState,
        compose(...enhancers),
      )

      function createReducer(asyncReducers) {
        return reducerEnhancer(combineReducers({
          ...reducers,
          ...extraReducers,
          ...asyncReducers,
        }))
      }

      // extend store
      store.asyncReducers = {}

      // store change
      const listeners = plugin.get('onStateChange')
      for (const listener of listeners) {
        store.subscribe(() => {
          listener(store.getState())
        })
      }

      // execute initialization codes
      store.dispatch(this._init())

      // setup history
      if (setupHistory) setupHistory.call(this, history)

      // run subscriptions
      const unlisteners = {}

      // inject module after start
      this.module = injectModule.bind(this, createReducer, onErrorWrapper, unlisteners)

      this.unmodule = unmodule.bind(this, createReducer, reducers, unlisteners)

      // export _getProvider for HMR
      this._getProvider = getProvider.bind(null, app._store, app)

      // If has container, render; else, return react component
      if (container) {
        render(container, store, this, this._router)
        plugin.apply('onHmr')(render.bind(this, container, store, this))
      } else {
        return getProvider(store, this, this._router)
      }
    }

    // //////////////////////////////////
    // Helpers

    function getReducers(ns, modules, reducers) {
      return modules ? modules.reduce((a, m) => {
        const finalNs = ns ? `${ns}.${m.namespace}` : m.namespace
        const finalReducers = {
          ...a,
          ...(m.state ? { [finalNs]: getReducer(m.reducers, m.state) } : {}),
          ...getReducers(finalNs, m.children, {})
        }
        return finalReducers
      }, reducers) : reducers
    }

    function getProvider(store, app, Router) {
      return extraProps => (
        <Provider store={store}>
          <Router
            app={app}
            history={app._history}
            {...extraProps}
          />
        </Provider>
      )
    }

    function render(container, store, app, router) {
      const ReactDOM = require('react-dom')
      ReactDOM.render(React.createElement(getProvider(store, app, router)), container)
    }

    function checkModule(m, mobile) {
      // Clone module to avoid prefixing namespace multiple times
      const module = { ...m }
      const { namespace, reducers, children } = module

      invariant(
        namespace,
        'app.module: namespace should be defined',
      )
      invariant(
        !app._modules.some(module => module.namespace === namespace),
        'app.module: namespace should be unique',
      )
      invariant(
        mobile || namespace !== 'routing',
        'app.module: namespace should not be routing, it\'s used by react-redux-router',
      )
      invariant(
        !module.subscriptions || isPlainObject(module.subscriptions),
        'app.module: subscriptions should be Object',
      )
      invariant(
        !reducers || isPlainObject(reducers) || Array.isArray(reducers),
        'app.module: reducers should be Object or array',
      )
      invariant(
        !Array.isArray(reducers) || (isPlainObject(reducers[0]) && typeof reducers[1] === 'function'),
        'app.module: reducers with array should be app.module({ reducers: [object, function] })',
      )
      invariant(
        !children || Array.isArray(children),
        'app.module: children should be array',
      )

      return module
    }

    function isHTMLElement(node) {
      return typeof node === 'object' && node !== null && node.nodeType && node.nodeName
    }

    function getReducer(reducers, state) {
      // Support reducer enhancer
      // e.g. reducers: [realReducers, enhancer]
      if (Array.isArray(reducers)) {
        return reducers[1](handleActions(reducers[0], state))
      } else {
        return handleActions(reducers || {}, state)
      }
    }
  }
}

import { connect as reduxConnect } from 'react-redux'
// import shallowEqual from './shallowEqual'
import { isArray, get } from '@dx-groups/utils/lang.js'
import { equal } from './utils/lang'

function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}

export default function connect(module, mapStateToProps, mapDispatchToProps) {
  return reduxConnect(
    (state) => {
      if (isArray(module)) {
        return mapStateToProps(module.reduce((a, c) => ({
          ...a,
          // [c]: get(state, c)
          [c]: state[c] || get(state, c)
          // ...get(state, c)
        }), {}))
      }
      const moduleState = get(state, module)
      return mapStateToProps(moduleState)
    },
    mapDispatchToProps,
    defaultMergeProps,
    {
      areStatePropsEqual: equal
    }
  )
}


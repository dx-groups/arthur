
// import { createAction } from 'redux-actions'
// import { message } from 'antd'
// import { SHOW_LIST_SPIN } from 'Global/action'

// ===========================> Action Types <=========================== //
export const GET_PAGE_LIST = 'spa/SupplyChain/depotStock/GET_PAGE_LIST' // 库存查询

export default {
  namespace: 'sub',

  state: {
    level3: { name: 'old' }
  },

  actions: {
    getCheckList(arg) {
      return dispatch => {
        dispatch({
          type: GET_PAGE_LIST,
          payload: {
            name: 'new'
          },
        })
      }
    }
  },

  reducers: {
    [GET_PAGE_LIST]: (state, action) => ({
      ...state,
      level3: action.payload,
    })
  },

  children: [

  ]
}

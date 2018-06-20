
import subModule from './sub/module'

// ===========================> Action Types <=========================== //
export const GET_PAGE_LIST = 'spa/SupplyChain/depotStock/GET_PAGE_LIST' // 库存查询

export default {
  namespace: 'page',

  state: {
    level2: {
      name: 'old'
    }
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
      level2: action.payload,
    })
  },

  children: [
    subModule
  ]
}

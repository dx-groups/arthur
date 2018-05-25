
import pageModule from './page/module'

// ===========================> Action Types <=========================== //
const GET_PAGE_LIST = 'spa/Arthur/GET_FIRST_LIST' // 库存查询

export default {
  namespace: 'arthur',

  state: {
    level1: { name: 'old' }
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
      level1: action.payload,
    })
  },

  children: [
    pageModule
  ]
}

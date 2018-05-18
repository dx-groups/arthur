
import pageModule from './page/module'

// ===========================> Action Types <=========================== //
const GET_FIRST_LIST = 'spa/Arthur/GET_FIRST_LIST' // 库存查询

export default {
  namespace: 'arthur',

  state: {
    first: ''
  },

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

  reducers: {
    [GET_FIRST_LIST]: (state, action) => ({
      ...state,
      first: action.payload,
    })
  },

  children: [
    pageModule
  ]
}

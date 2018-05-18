import { createAction } from 'redux-actions'
import { message, Tooltip } from 'antd'
import moment from 'moment'
import { isEmpty } from './lang'

const SHOW_LIST_SPIN = 'SHOW_LIST_SPIN'

// ===========================> Route <=========================== //

function genRoute(path, breadcrumbName, baseComponent, parentPath) {
  return {
    path,
    exact: true,
    baseComponent,
    breadcrumbName,
    parentPath
  }
}

const RouteHelper = { genRoute }

// ===========================> Menu <=========================== //

function genMenu(menu, menuUrl, buttons = [], menuIcon = 'team', children = null) {
  return {
    menu,
    menuKey: menuUrl,
    menuIcon,
    menuUrl,
    buttons,
    children,
  }
}

const Buttons = {
  DEFINE: (key, name, path) => ({ key, name, path }),
  CHECK: (name = '查看', path) => ({ key: 'check', name, path }),
  ADD: (name = '新增', path) => ({ key: 'add', name, path }),
  EDIT: (name = '编辑') => ({ key: 'edit', name }),
  DELETE: (name = '删除') => ({ key: 'delete', name }),
  EXPORT: (name = '导出') => ({ key: 'export', name }),
  PRINT: (name = '打印') => ({ key: 'print', name }),
  SAVE: (name = '保存') => ({ key: 'save', name }),
  SUBMIT: (name = '提交') => ({ key: 'submit', name }),
  CANCEL: (name = '取消') => ({ key: 'cancel', name }),
  BACK: (name = '返回') => ({ key: 'back', name }),
}

const CRUDButtons = [
  Buttons.CHECK(),
  Buttons.ADD(),
  Buttons.EDIT(),
  Buttons.DELETE(),
]

const MenuHelper = { genMenu, Buttons, CRUDButtons }

// ===========================> Reduck <=========================== //

function genListAction(arg, fetch, url, actionType) {
  return dispatch => {
    // const filter = objectHandler(arg, trim)
    const filter = arg
    return fetch(dispatch, SHOW_LIST_SPIN)(url, filter)
      .then(res => {
        if (res.code === 0) {
          dispatch(createAction(actionType)({ ...res.data, filter }))
        } else {
          message.error(res.errmsg)
        }
      })
  }
}

function genListState(key, filter) {
  return {
    [`${key}Filter`]: {
      pageSize: 10,
      currentPage: 1,
      ...filter,
    },
    [`${key}List`]: [],
    [`${key}Page`]: {},
  }
}

function resolveListState(key, state, payload) {
  const { filter, result, data, ...page } = payload
  return {
    ...state,
    [`${key}Filter`]: filter,
    [`${key}List`]: result || data,
    [`${key}Page`]: page,
  }
}

const ReduckHelper = { genListAction, genListState, resolveListState }

// ===========================> Page <=========================== //

function genPlanColumn(key, title, extend) {
  return { ...extend, key, title, dataIndex: key }
}

function genLangColumn(key, title, extend, len = 20) {
  return {
    ...extend,
    key,
    title,
    dataIndex: key,
    render: (text, record, index) => {
      if (text.length <= len) {
        return <span>{text}</span>
      }
      return (
        <Tooltip placement='top' title={text}>
          {text.substring(0, len) + '...'}
        </Tooltip>
      )
    }
  }
}

function genSelectColumn(key, title, options) {
  return {
    title,
    key,
    dataIndex: key,
    render: (text, record, index) => {
      const status = options.filter(option => (option.value + '') === (text + ''))
      return status.length > 0 ? status[0].name : text
    }
  }
}

function unshiftIndexColumn(old, page, cProps = {}) {
  return [{
    key: 'index',
    title: '序号',
    ...cProps,
    render: (text, record, index) => page ? (page.pageSize * page.pageNo + (index + 1) - page.pageSize) : index + 1
  }].concat(old)
}

function filterResolver(filter, key, sub1, sub2, format = 'YYYY-MM-DD') {
  const resItem = filter[key]
  delete filter[key]
  const finalFilter = Object.assign({}, filter, {
    [sub1]: (resItem && !isEmpty(resItem) && moment(resItem[0]).format(format)) || '',
    [sub2]: (resItem && !isEmpty(resItem) && moment(resItem[1]).format(format)) || '',
  })
  return finalFilter
}

const DefaultPage = {
  pageNo: 1,
  records: 0,
  pageSize: 10,
}
function genPagination(page = DefaultPage, showSizeChanger = true) {
  return {
    current: parseInt(page.pageNo),
    total: parseInt(page.records),
    pageSize: parseInt(page.pageSize),
    showSizeChanger,
    showQuickJumper: true,
    showTotal: total => `共 ${page.records} 项`,
    pageSizeOptions: ['5', '10', '20', '50'],
  }
}

// const PageHelper = {}

export {
  RouteHelper,
  MenuHelper,
  ReduckHelper,
  genPlanColumn,
  genLangColumn,
  genSelectColumn,
  unshiftIndexColumn,
  filterResolver,
  genPagination,
}

import * as urls from '../../global/urls'
import { helper } from 'baoshi-arthur1'
import BaseModule from './'

const genRoute = (path, breadcrumbName, parentPath) =>
  helper.RouteHelper.genRoute(path, breadcrumbName, BaseModule, parentPath)

export default [
  genRoute(urls.ARTHUR, 'ARTHUR'),
  genRoute(urls.ARTHUR_PAGE, 'ARTHUR_PAGE', urls.ARTHUR),
  genRoute(urls.ARTHUR_PAGE_SUB, 'ARTHUR_PAGE_SUB', urls.ARTHUR_PAGE),
]

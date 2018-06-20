import React, { Component } from 'react'
import { Route, Switch } from '@dx-groups/arthur/routerDom'
import * as urls from '../../global/urls'

import Page from './page'
import Sub from './page/sub'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={urls.ARTHUR_PAGE} component={Page} />
        <Route exact path={urls.ARTHUR_PAGE_SUB} component={Sub} />
      </Switch>
    )
  }
}
export default BaseModule

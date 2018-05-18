import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from '../../global/urls'

import Page from './page'
import Sub from './page/sub'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.ARTHUR} to={urls.ARTHUR_PAGE} />
        <Route exact path={urls.ARTHUR_PAGE} component={Page} />
        <Route exact path={urls.ARTHUR_PAGE_SUB} component={Sub} />
      </Switch>
    )
  }
}
export default BaseModule

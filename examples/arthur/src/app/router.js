import React, { Component } from 'react'
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { LocaleProvider } from 'antd'

import routes from '../routes'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import Layout from './layout'
import * as urls from '../global/urls'

class RouteConfig extends Component {
  verifyUser = (match, route, finalRoutes) => {
    return (
      <Layout
        routes={finalRoutes}
        match={match}
        content={route.baseComponent}
        path={route.path}
      />)
  }

  render() {
    const finalRoutes = routes
    return (
      <LocaleProvider locale={zhCN}>
        <ConnectedRouter history={this.props.history}>
          <Switch>
            {
              finalRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={match => this.verifyUser(match, route, finalRoutes)}
                />
              ))
            }
            <Redirect exact from='/' to={urls.ARTHUR_PAGE} />
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    )
  }
}

export default RouteConfig

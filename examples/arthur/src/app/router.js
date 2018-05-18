import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
} from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { LocaleProvider } from 'antd'

import routes from '../routes'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

class RouteConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      acceptRoutes: []
    }
  }

  verifyUser = (match, route, finalRoutes) => {
    <Layout
      routes={finalRoutes}
      match={match}
      content={route.baseComponent}
      path={route.path}
    />
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
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(RouteConfig)

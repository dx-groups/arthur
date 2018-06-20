import React, { Component } from 'react'

class MainLayout extends Component {
  render() {
    let MainContent = this.props.content
    const { routeActions } = this.props
    return (
      <MainContent {...this.props} routeActions={routeActions} />
    )
  }
}

export default MainLayout

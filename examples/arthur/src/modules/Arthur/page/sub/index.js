import React, { Component } from 'react'
import { connect } from 'baoshi-arthur1'
import { Link } from 'react-router-dom'
import * as urls from '../../../../global/urls'

class Sub extends Component {
  render() {
    return (
      <div>
        <div>{this.props.name}</div>
        <Link to={urls.ARTHUR_PAGE}>old</Link>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  console.log(state)
  return {
    ...state['arthur.page.sub']
  }
}
export default connect(['common.showListSpin', 'arthur.page.sub'], mapStateToProps)(Sub)


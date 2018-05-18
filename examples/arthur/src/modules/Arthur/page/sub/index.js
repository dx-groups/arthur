import React, { Component } from 'react'
import { connect } from 'baoshi-arthur'

class Sub extends Component {
  render() {
    return (
      <div>{this.props.name}</div>
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


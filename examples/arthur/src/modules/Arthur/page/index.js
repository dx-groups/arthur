import React, { Component } from 'react'
import { connect } from 'baoshi-arthur'
import Module from './module'
import BaseModule from '../module'

class Page extends Component {
  _handleClick = () => {
    this.props.dispatch(Module.actions.getCheckList())
    this.props.dispatch(BaseModule.actions.getFirstList())
  }

  render() {
    return (
      <div onClick={this._handleClick}>{this.props.data.name}</div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    ...state['arthur.page']
  }
}
export default connect(['common.showListSpin', 'arthur.page'], mapStateToProps)(Page)

import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Link } from 'react-router-dom'
import Module from './module'
import BaseModule from '../module'
import * as urls from '../../../global/urls'

class Page extends Component {
  _handleClick = () => {
    this.props.dispatch(Module.actions.getCheckList())
    this.props.dispatch(BaseModule.actions.getFirstList())
  }

  render() {
    return (
      <div>
        <h2>this is arthur page</h2>
        <div onClick={this._handleClick}>{this.props.data.name}</div>
        <Link to={urls.ARTHUR_PAGE_SUB}>sub</Link>
      </div>
     
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

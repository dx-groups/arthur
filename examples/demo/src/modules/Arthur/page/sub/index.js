import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Link } from '@dx-groups/arthur/routerDom'
import * as urls from '../../../../global/urls'

import level3Module from './module'
import level2Module from '../module'
import level1Module from '../../module'

class Sub extends Component {
  _handleClick = () => {
    const { dispatch } = this.props
    dispatch(level3Module.actions.getCheckList())
    dispatch(level2Module.actions.getCheckList())
    dispatch(level1Module.actions.getCheckList())
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <h2>this is arthur sub page</h2>
        <div>{ this.props.level1.name }</div>
        <div>{ this.props.level2.name }</div>
        <div>{ this.props.level3.name }</div>
        <button onClick={this._handleClick}>click</button><br />
        <Link to={urls.ARTHUR_PAGE}>level2</Link>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state['arthur'],
    ...state['arthur.page'],
    ...state['arthur.page.sub']
  }
}
export default connect(['arthur', 'arthur.page', 'arthur.page.sub'], mapStateToProps)(Sub)


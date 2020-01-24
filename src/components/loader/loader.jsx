import React, { Component } from 'react'
import { LinearProgress } from '@material-ui/core'

class Loader extends Component {
  render() {
    return (
      <div style={{ position: 'absolute', left: '0px', right: '0px', top: '0px'}}>
        <LinearProgress />
      </div>
    )
  }
}

export default Loader

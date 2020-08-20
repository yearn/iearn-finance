import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { withNamespaces } from 'react-i18next'
import PoolTop from './poolTop'
import PoolMain from './poolMain'

const styles = (theme) => ({})

const Pool = ({ history }) => {
  console.log({history})
  const [accGlobal, setAccGlobal] = useState(null)

  return (
    <div>
      <PoolTop currentPage={history.location.pathname} nav={(slag) => history.push(slag)} account={accGlobal} />
      <PoolMain setAccountGlobal={(acc) => setAccGlobal(acc)} />
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(Pool)))

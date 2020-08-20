import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { withNamespaces } from 'react-i18next'
import TopBar from '../topBar'
import Zap from './zapMain'

const styles = (theme) => ({})

const ZapNew = ({ history, accGlobal, setAccGlobal }) => {
  return (
    <div>
      <TopBar
        currentPage={history.location.pathname}
        nav={(slag) => history.push(slag)}
        account={accGlobal}
        pageTitle="Lorem"
        pageSubtitle="Ipsum"
      />
      <Zap setAccountGlobal={(acc) => setAccGlobal(acc)} />
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(ZapNew)))

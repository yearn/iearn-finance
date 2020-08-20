import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { withNamespaces } from 'react-i18next'
import TopBar from '../topBar'
import APR from './aprMain'

const styles = (theme) => ({})

const APRNew = ({ history, accGlobal, setAccGlobal }) => {
  return (
    <div>
      <TopBar
        currentPage={history.location.pathname}
        nav={(slag) => history.push(slag)}
        account={accGlobal}
        pageTitle="Lorem"
        pageSubtitle="Ipsum"
      />
      <APR setAccountGlobal={(acc) => setAccGlobal(acc)} />
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(APRNew)))

import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { withNamespaces } from 'react-i18next'
import TopBar from '../topBar'

const styles = (theme) => ({})

const Cover = ({ history, accGlobal, setAccGlobal }) => {
  return (
    <div>
      <TopBar
        currentPage={history.location.pathname}
        nav={(slag) => history.push(slag)}
        account={accGlobal}
        pageTitle="Lorem"
        pageSubtitle="Ipsum"
      />
      <h2>SOON</h2>
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(Cover)))

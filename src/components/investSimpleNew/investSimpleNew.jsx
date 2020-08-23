import React from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { withNamespaces } from 'react-i18next'
import TopBar from '../topBar'
import InvestSimpleMain from './investSimpleMain'

const styles = (theme) => ({})

const Pool = ({ history, accGlobal, setAccGlobal, isDarkTheme, setIsDarkTheme }) => {
  return (
    <div>
      <TopBar
        currentPage={history.location.pathname}
        nav={(slag) => history.push(slag)}
        account={accGlobal}
        pageTitle="Maximize Savings With Automated DeFi Lending"
        pageSubtitle="Deploys funds to the best lending strategy for your asset at any time"
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
      />
      <InvestSimpleMain setAccountGlobal={(acc) => setAccGlobal(acc)} isDarkTheme={isDarkTheme} />
    </div>
  )
}

export default withNamespaces()(withRouter(withStyles(styles)(Pool)))

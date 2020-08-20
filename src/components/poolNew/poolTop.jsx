import React,{ useState} from 'react'
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';
import {Button,Typography} from '@material-ui/core'
import UnlockModal from '../unlock/unlockModal.jsx'

const styles = theme => ({
  buttonText: {
    fontWeight: '700',
  },
  actionButton: {
    height: '47px'
  },
})

const PoolTop = ({ account, classes, nav, currentPage }) => {
  const [modalOpen, setModalOpen] = useState(false)
  
  if (!account || !account.address) return null
  return (
      <>
        <div>
          <img src={require(`../../assets/logo-top.svg`)} alt="" />
        </div>
        <div>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color={currentPage === '/' ? 'primary' : 'secondary'}
            onClick={() => nav('/')}
          >
            <img src={require(`../../assets/ico-dashboard.svg`)} alt="" />
            {' '}
            Dashboard
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="secondary"
            onClick={() => nav('/zap')}
            color={currentPage === '/zap' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/ico-zapper.svg`)} alt="" />
            {' '}
            Zapper
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="secondary"
            onClick={() => nav('/vaults')}
            color={currentPage === '/vaults' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/ico-grow.svg`)} alt="" />
            {' '}
            Grow
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="secondary"
            onClick={() => nav('/earn')}
            color={currentPage === '/earn' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/ico-save.svg`)} alt="" />
            {' '}
            Save
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="secondary"
            onClick={() => nav('/apr')}
            color={currentPage === '/apr' ? 'primary' : 'secondary'}
          >
            <img src={require(`../../assets/ico-cover.svg`)} alt="" />
            {' '}
            Cover
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="secondary"
            onClick={() => setModalOpen(true)}
            // fullWidth
          >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>
              <img src={require(`../../assets/ico-wallet.svg`)} alt="" />
              {' '}
              {`${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4, account.address.length)}`}
            </Typography>
          </Button>
        </div>
        <div>
          <h2>Harvest DeFi Yield Opportunities on Autopilot</h2>
          <h3>Maximize profits with the best growth strategy for your asset at any time</h3>
        </div>
        {modalOpen && <UnlockModal closeModal={() =>   setModalOpen(false)} modalOpen={modalOpen} />}
      </>

  )
}

export default withNamespaces()(withRouter(withStyles(styles)(PoolTop)))
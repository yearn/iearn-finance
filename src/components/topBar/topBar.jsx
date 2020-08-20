import React,{ useState} from 'react'
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';
import {Button,Typography} from '@material-ui/core'
import UnlockModal from '../unlock/unlockModal.jsx'

const styles = theme => ({
  buttonText: {
    fontWeight: '700',
    alignItems: 'center',
    display: 'flex',
    fontSize: '14px',
    lineHeight: '22px',
  },
  actionButton: {
    fontWeight: '600',
    fontSize: '16px',
    lineLeight: '24px',
    padding: '8px 13px',
    margin: '15px 8px 0',
    borderRadius: '4px',
    '&:first-of-type': {
      marginLeft: '0',
    },
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  menuContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '21px',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '30px',
    lineHeight: '38px',
    color: '#080809',
    marginTop: '54px'
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#080809',
    marginTop: '22px'
  },
  container: {
    padding: '36px 0 53px'
  }
})

const TopBar = ({ account, classes, nav, currentPage, pageTitle, pageSubtitle }) => {
  const [modalOpen, setModalOpen] = useState(false)
  return (
      <div className={ classes.container }>
        <div className={ classes.logoContainer }>
          <img src={require(`../../assets/logo-top.svg`)} alt="" />
        </div>
        <div className={ classes.menuContainer }>
          <Button
            className={ classes.actionButton }
            variant="contained"
            color={currentPage === '/' ? 'primary' : ''}
            onClick={() => nav('/')}
          >
            <img src={require(`../../assets/ico-dashboard.svg`)} alt="" />
            {' '}
            Dashboard
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            
            onClick={() => nav('/zap')}
            color={currentPage === '/zap' ? 'primary' : ''}
          >
            <img src={require(`../../assets/ico-zapper.svg`)} alt="" />
            {' '}
            Zapper
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            
            onClick={() => nav('/vaults')}
            color={currentPage === '/vaults' ? 'primary' : ''}
          >
            <img src={require(`../../assets/ico-grow.svg`)} alt="" />
            {' '}
            Grow
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            
            onClick={() => nav('/earn')}
            color={currentPage === '/earn' ? 'primary' : ''}
          >
            <img src={require(`../../assets/ico-save.svg`)} alt="" />
            {' '}
            Save
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            onClick={() => nav('/apr')}
            color={currentPage === '/apr' ? 'primary' : ''}
          >
            <img src={require(`../../assets/ico-cover.svg`)} alt="" />
            {' '}
            Cover
          </Button>
          <Button
            className={ classes.actionButton }
            variant="contained"
            onClick={() => setModalOpen(true)}
            // fullWidth
          >
            {!account || !account.address ? 'Login' : (
              <Typography className={ classes.buttonText } variant={'h5'} >
                <img src={require(`../../assets/ico-wallet.svg`)} alt="" />
                {' '}
                {`${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4, account.address.length)}`}
              </Typography>
            )}
          </Button>
        </div>
        <div >
          <Typography className={ classes.title } variant={'h2'} >{pageTitle}</Typography>
          <Typography className={ classes.subTitle } variant={'h3'} >{pageSubtitle}</Typography>
        </div>
        {modalOpen && <UnlockModal closeModal={() => setModalOpen(false)} modalOpen={modalOpen} />}
      </div>

  )
}

export default withNamespaces()(withRouter(withStyles(styles)(TopBar)))